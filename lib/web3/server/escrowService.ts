/**
 * Server-side Escrow Service
 * 
 * This service handles smart contract interactions from the backend.
 * After a successful Stripe payment, it creates the challenge on-chain
 * and associates it with the user's account.
 */

import { createPublicClient, createWalletClient, http, keccak256, encodePacked } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { polygon, polygonAmoy, base, baseSepolia } from "viem/chains";
import {
  CHALLENGE_ESCROW_ABI,
  ERC20_ABI,
  CONTRACT_ADDRESSES,
  parseUSDC,
} from "@/types/contracts";

// Environment variables
const PLATFORM_PRIVATE_KEY = process.env.PLATFORM_WALLET_PRIVATE_KEY;
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY || process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

// Test mode configuration
const IS_TEST_MODE = process.env.NODE_ENV !== "production" || process.env.ENABLE_TEST_PAYMENTS === "true";
const SKIP_BLOCKCHAIN_IN_TEST = process.env.SKIP_BLOCKCHAIN_IN_TEST === "true";

// Chain configurations
const chains = {
  137: polygon,
  80002: polygonAmoy,
  8453: base,
  84532: baseSepolia,
} as const;

// RPC URLs
const getRpcUrl = (chainId: number): string => {
  const alchemyUrls: Record<number, string> = {
    137: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    80002: `https://polygon-amoy.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    8453: `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    84532: `https://base-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
  };

  if (ALCHEMY_API_KEY && alchemyUrls[chainId]) {
    return alchemyUrls[chainId];
  }

  // Fallback to public RPCs
  const publicUrls: Record<number, string> = {
    137: "https://polygon-rpc.com",
    80002: "https://rpc-amoy.polygon.technology",
    8453: "https://mainnet.base.org",
    84532: "https://sepolia.base.org",
  };

  return publicUrls[chainId] || "";
};

// Default chain for production vs development
const DEFAULT_CHAIN_ID = process.env.NODE_ENV === "production" ? 137 : 80002;

export interface CreateChallengeParams {
  challengeId: string;
  userEmail: string;
  amount: number; // USD amount
  durationDays: number;
  guarantorEmails: string[];
  metadataUri: string;
  challengeTitle: string;
  stripeSessionId: string;
  stripePaymentIntentId?: string;
}

export interface ChallengeCreationResult {
  success: boolean;
  challengeId: string;
  transactionHash?: string;
  blockNumber?: bigint;
  error?: string;
  testMode?: boolean;
}

/**
 * Generate a unique challenge ID
 */
export function generateChallengeId(
  stripeSessionId: string,
  timestamp: number,
  nonce: string
): `0x${string}` {
  return keccak256(
    encodePacked(
      ["string", "uint256", "string"],
      [stripeSessionId, BigInt(timestamp), nonce]
    )
  );
}

/**
 * Create a challenge on the blockchain after successful payment
 * 
 * Note: This function uses the platform wallet to create challenges on behalf of users.
 * The platform pre-funds USDC and manages the escrow contract interactions.
 * 
 * In test mode with SKIP_BLOCKCHAIN_IN_TEST=true, returns a simulated success.
 */
export async function createChallengeOnChain(
  params: CreateChallengeParams,
  chainId: number = DEFAULT_CHAIN_ID
): Promise<ChallengeCreationResult> {
  try {
    // Test mode: Skip real blockchain interactions
    if (IS_TEST_MODE && SKIP_BLOCKCHAIN_IN_TEST) {
      console.log("=== TEST MODE: Simulating blockchain interaction ===");
      const mockChallengeId = generateChallengeId(
        params.stripeSessionId,
        Date.now(),
        Math.random().toString(36).substring(7)
      );
      
      console.log("Mock challenge created:", {
        challengeId: mockChallengeId,
        amount: params.amount,
        duration: params.durationDays,
        guarantors: params.guarantorEmails.length,
      });
      
      return {
        success: true,
        challengeId: mockChallengeId,
        transactionHash: `0x${"0".repeat(64)}` as `0x${string}`,
        blockNumber: BigInt(0),
        testMode: true,
      };
    }

    if (!PLATFORM_PRIVATE_KEY) {
      console.error("Platform wallet private key not configured");
      return {
        success: false,
        challengeId: params.challengeId,
        error: "Platform wallet not configured",
      };
    }

    const contracts = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];
    if (!contracts) {
      return {
        success: false,
        challengeId: params.challengeId,
        error: `Unsupported chain ID: ${chainId}`,
      };
    }

    const chain = chains[chainId as keyof typeof chains];
    if (!chain) {
      return {
        success: false,
        challengeId: params.challengeId,
        error: `Chain configuration not found: ${chainId}`,
      };
    }

    // Create account from private key
    const account = privateKeyToAccount(PLATFORM_PRIVATE_KEY as `0x${string}`);

    // Create clients
    const publicClient = createPublicClient({
      chain,
      transport: http(getRpcUrl(chainId)),
    });

    const walletClient = createWalletClient({
      account,
      chain,
      transport: http(getRpcUrl(chainId)),
    });

    // Generate on-chain challenge ID
    const onChainChallengeId = generateChallengeId(
      params.stripeSessionId,
      Date.now(),
      Math.random().toString(36).substring(7)
    );

    // Convert amount to USDC (6 decimals)
    const usdcAmount = parseUSDC(params.amount);

    // Duration in seconds
    const durationSeconds = BigInt(params.durationDays * 24 * 60 * 60);

    // For now, we use placeholder addresses for guarantors
    // In production, guarantors would link their wallet addresses via email invitations
    const guarantorAddresses: `0x${string}`[] = params.guarantorEmails.map((_, index) => {
      // Generate deterministic placeholder addresses for guarantors
      // These will be updated when guarantors link their wallets
      return keccak256(
        encodePacked(["string", "uint256"], [params.challengeId, BigInt(index)])
      ).slice(0, 42) as `0x${string}`;
    });

    // Ensure platform wallet has approved USDC spending
    const currentAllowance = await publicClient.readContract({
      address: contracts.usdc,
      abi: ERC20_ABI,
      functionName: "allowance",
      args: [account.address, contracts.challengeEscrow],
    });

    if (currentAllowance < usdcAmount) {
      // Approve max USDC for escrow contract
      const approvalHash = await walletClient.writeContract({
        address: contracts.usdc,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [
          contracts.challengeEscrow,
          BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"),
        ],
      });

      // Wait for approval transaction
      await publicClient.waitForTransactionReceipt({ hash: approvalHash });
      console.log("USDC approval completed:", approvalHash);
    }

    // Create the challenge on-chain
    const txHash = await walletClient.writeContract({
      address: contracts.challengeEscrow,
      abi: CHALLENGE_ESCROW_ABI,
      functionName: "createChallenge",
      args: [
        onChainChallengeId,
        guarantorAddresses,
        usdcAmount,
        durationSeconds,
        params.metadataUri,
      ],
    });

    // Wait for transaction confirmation
    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

    console.log("Challenge created on-chain:", {
      challengeId: onChainChallengeId,
      txHash,
      blockNumber: receipt.blockNumber,
    });

    return {
      success: true,
      challengeId: onChainChallengeId,
      transactionHash: txHash,
      blockNumber: receipt.blockNumber,
    };
  } catch (error) {
    console.error("Error creating challenge on-chain:", error);
    return {
      success: false,
      challengeId: params.challengeId,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Check if the escrow contract is deployed and configured
 */
export async function checkEscrowContract(chainId: number = DEFAULT_CHAIN_ID): Promise<boolean> {
  try {
    const contracts = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];
    if (!contracts) return false;

    // Check if contract address is not the zero address
    if (contracts.challengeEscrow === "0x0000000000000000000000000000000000000000") {
      console.warn(`Escrow contract not deployed on chain ${chainId}`);
      return false;
    }

    const chain = chains[chainId as keyof typeof chains];
    if (!chain) return false;

    const publicClient = createPublicClient({
      chain,
      transport: http(getRpcUrl(chainId)),
    });

    // Try to read from the contract
    const usdcAddress = await publicClient.readContract({
      address: contracts.challengeEscrow,
      abi: CHALLENGE_ESCROW_ABI,
      functionName: "usdcToken",
    });

    return usdcAddress === contracts.usdc;
  } catch (error) {
    console.error("Error checking escrow contract:", error);
    return false;
  }
}

/**
 * Get platform wallet balance information
 */
export async function getPlatformWalletInfo(chainId: number = DEFAULT_CHAIN_ID) {
  try {
    if (!PLATFORM_PRIVATE_KEY) {
      return { configured: false };
    }

    const contracts = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];
    if (!contracts) return { configured: false };

    const chain = chains[chainId as keyof typeof chains];
    if (!chain) return { configured: false };

    const account = privateKeyToAccount(PLATFORM_PRIVATE_KEY as `0x${string}`);

    const publicClient = createPublicClient({
      chain,
      transport: http(getRpcUrl(chainId)),
    });

    const [nativeBalance, usdcBalance] = await Promise.all([
      publicClient.getBalance({ address: account.address }),
      publicClient.readContract({
        address: contracts.usdc,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: [account.address],
      }),
    ]);

    return {
      configured: true,
      address: account.address,
      nativeBalance: nativeBalance.toString(),
      usdcBalance: usdcBalance.toString(),
      chainId,
    };
  } catch (error) {
    console.error("Error getting platform wallet info:", error);
    return { configured: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
