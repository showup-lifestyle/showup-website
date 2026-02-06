import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Showup",
  description: "Terms and conditions for using the Showup accountability platform.",
};

export default function TermsPage() {
  const lastUpdated = "February 6, 2026";
  const effectiveDate = "February 6, 2026";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-serif text-4xl font-semibold tracking-tight">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: {lastUpdated} | Effective: {effectiveDate}
        </p>

        <div className="mt-10 space-y-8 text-foreground/90">
          <section>
            <h2 className="font-serif text-2xl font-semibold">Agreement to Terms</h2>
            <p className="mt-3 leading-relaxed">
              By accessing or using Showup ("Platform," "Service," or "App"), you agree 
              to be bound by these Terms of Service ("Terms"). If you do not agree to all 
              terms, you may not use our services.
            </p>
            <p className="mt-3 leading-relaxed">
              Showup is an accountability platform where users create challenges with financial 
              stakes and invite guarantors to validate daily progress through photo submissions. 
              These Terms govern your use of all features, including challenge creation, 
              financial staking, guarantor voting, and yield generation (retained by Showup).
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold">Eligibility</h2>
            <p className="mt-3 leading-relaxed">You must:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Be at least 18 years old</li>
              <li>Have the legal capacity to enter into binding contracts</li>
              <li>Not be prohibited from using financial services under applicable law</li>
              <li>Provide accurate and complete registration information</li>
            </ul>
            <p className="mt-3 leading-relaxed">
              By using Showup, you represent and warrant that you meet all eligibility 
              requirements.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold">Account Responsibilities</h2>
            <p className="mt-3 leading-relaxed">You are responsible for:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized access</li>
              <li>Ensuring your account information remains accurate and current</li>
            </ul>
            <p className="mt-3 leading-relaxed">
              Showup reserves the right to suspend or terminate accounts that violate 
              these Terms or engage in fraudulent activity.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold">Challenge Mechanics</h2>
            
            <h3 className="mt-4 text-lg font-medium">Creating Challenges</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>You may create challenges with durations of 7, 14, 21, or 30 days</li>
              <li>Each challenge requires a financial stake (minimum and maximum limits may apply)</li>
              <li>You must invite 3-5 guarantors who will validate your daily submissions</li>
              <li>Challenge descriptions must be lawful, accurate, and not misleading</li>
            </ul>

            <h3 className="mt-4 text-lg font-medium">Daily Submissions</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>All submissions must be original photos taken by you</li>
              <li>Images must be in 16:9 portrait format (vertical orientation)</li>
              <li>Submissions must directly relate to the challenge goal</li>
              <li>Late submissions may not be accepted depending on challenge settings</li>
              <li>You may not submit photos depicting illegal activity, violence, nudity, or offensive content</li>
            </ul>

            <h3 className="mt-4 text-lg font-medium">Guarantor System</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Guarantors vote on the validity of your daily submissions</li>
              <li>You are responsible for inviting trustworthy guarantors</li>
              <li>Showup is not responsible for guarantor voting decisions</li>
              <li>Guarantors must act in good faith and base votes on the actual submission</li>
              <li>Collusion between challengers and guarantors is prohibited</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold">Financial Terms</h2>
            
            <h3 className="mt-4 text-lg font-medium">Stakes & Escrow</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>When you create a challenge, your stake amount is held in escrow</li>
              <li>Funds are held securely and separate from Showup operating funds</li>
              <li>Stakes are non-refundable once the challenge begins, except as outlined below</li>
            </ul>

            <h3 className="mt-4 text-lg font-medium">Yield Generation</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Challenge stakes are deposited into AAVE liquidity pools to generate yield during the challenge period</li>
              <li>Yield rates are variable and depend on market conditions</li>
              <li>Showup does not guarantee any specific yield rate</li>
              <li>All accrued yield is retained by Showup as platform revenue</li>
            </ul>

            <h3 className="mt-4 text-lg font-medium">Success Conditions</h3>
            <p className="mt-2 leading-relaxed">
              A challenge is considered successful when:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>All required daily submissions are completed on time</li>
              <li>A majority of guarantors approve each submission</li>
              <li>No submissions are flagged for fraud or violations</li>
            </ul>
            <p className="mt-3 leading-relaxed">
              Upon successful completion: You receive your full stake back. All accrued yield 
              is retained by Showup as platform revenue.
            </p>

            <h3 className="mt-4 text-lg font-medium">Failure Conditions</h3>
            <p className="mt-2 leading-relaxed">
              A challenge fails when:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>You miss a required daily submission deadline</li>
              <li>A majority of guarantors reject a submission</li>
              <li>You violate these Terms or engage in fraudulent behavior</li>
            </ul>
            <p className="mt-3 leading-relaxed">
              Upon failure: Both your original stake and all accrued yield are retained by 
              Showup. No portion of your stake is returned, and no funds are distributed 
              to guarantors or charities unless explicitly stated in specific challenge terms.
            </p>

            <h3 className="mt-4 text-lg font-medium">Fees</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>A single processing fee is charged when you deposit your stake</li>
              <li>This fee covers transaction costs, payment processor fees, and blockchain network fees (if applicable)</li>
              <li>The processing fee is non-refundable once the challenge begins</li>
              <li>No additional fees are charged upon successful or failed challenge completion</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold">Payment Methods</h2>
            <p className="mt-3 leading-relaxed">Showup supports:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li><strong>Fiat Currency:</strong> Credit/debit cards via Stripe</li>
              <li><strong>Cryptocurrency:</strong> ETH, USDC, or other supported tokens on Ethereum, Polygon, or Base networks</li>
            </ul>
            <p className="mt-3 leading-relaxed">
              You are responsible for ensuring sufficient funds and for any fees charged by 
              your payment provider or blockchain network. Crypto transactions are irreversible 
              once confirmed on-chain.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold">Prohibited Conduct</h2>
            <p className="mt-3 leading-relaxed">You may not:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Submit photos that are not your own or do not depict your actual challenge progress</li>
              <li>Use AI-generated, stock, or previously taken photos as submissions</li>
              <li>Collude with guarantors to manipulate voting results</li>
              <li>Create multiple accounts to circumvent limits or rules</li>
              <li>Upload content that is illegal, harmful, threatening, or offensive</li>
              <li>Attempt to hack, disrupt, or interfere with the Platform</li>
              <li>Reverse engineer or scrape our services</li>
              <li>Use Showup for money laundering or other illegal financial activities</li>
            </ul>
            <p className="mt-3 leading-relaxed">
              Violations may result in immediate account termination, forfeiture of stakes, 
              and legal action.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold">Dispute Resolution</h2>
            
            <h3 className="mt-4 text-lg font-medium">Guarantor Voting Disputes</h3>
            <p className="mt-2 leading-relaxed">
              Showup respects the collective judgment of guarantors. However, if you believe 
              a guarantor acted in bad faith, you may submit a dispute within 48 hours of the 
              voting deadline. Showup will review and make a final determination, which is 
              binding.
            </p>

            <h3 className="mt-4 text-lg font-medium">Technical Issues</h3>
            <p className="mt-2 leading-relaxed">
              If technical failures on our part prevent submission or voting, contact support 
              immediately. We will investigate and may, at our sole discretion, adjust challenge 
              outcomes or provide account credits.
            </p>

            <h3 className="mt-4 text-lg font-medium">Arbitration</h3>
            <p className="mt-2 leading-relaxed">
              Any dispute arising from these Terms shall be resolved through binding arbitration 
              in accordance with the rules of the American Arbitration Association. You waive 
              any right to participate in class actions. Arbitration will take place in the 
              state where Showup is headquartered.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold">Limitation of Liability</h2>
            <p className="mt-3 leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW:
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-6">
              <li>Showup is not liable for any indirect, incidental, special, or consequential damages</li>
              <li>Our total liability shall not exceed the amount you staked in the specific challenge giving rise to the claim</li>
              <li>We do not guarantee uninterrupted or error-free service</li>
              <li>We are not responsible for yield generation shortfalls; all yield is retained by Showup regardless of challenge outcome</li>
              <li>Crypto transactions carry inherent risks; you assume full responsibility for blockchain-related losses</li>
            </ul>
            <p className="mt-3 leading-relaxed">
              Some jurisdictions do not allow certain limitations, so these may not apply to you.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold">Indemnification</h2>
            <p className="mt-3 leading-relaxed">
              You agree to indemnify and hold harmless Showup, its officers, employees, and 
              agents from any claims, damages, or expenses (including attorneys' fees) arising 
              from:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Your use of the Platform</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Content you submit to the Platform</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold">Termination</h2>
            <p className="mt-3 leading-relaxed">
              You may delete your account at any time. Active challenges must be completed or 
              forfeited before account deletion.
            </p>
            <p className="mt-3 leading-relaxed">
              We may suspend or terminate your account immediately for violations of these Terms, 
              fraudulent activity, or any conduct we deem harmful to the Platform or other users.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold">Changes to Terms</h2>
            <p className="mt-3 leading-relaxed">
              We may modify these Terms at any time. Material changes will be notified via email 
              or in-app notice at least 30 days before taking effect. Continued use after changes 
              constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold">Governing Law</h2>
            <p className="mt-3 leading-relaxed">
              These Terms are governed by the laws of the jurisdiction where Showup is 
              incorporated, without regard to conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold">Contact Information</h2>
            <p className="mt-3 leading-relaxed">
              For questions about these Terms:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Email: legal@showup.app</li>
              <li>Address: Showup, Inc. — Legal Department</li>
            </ul>
          </section>

          <section className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <h2 className="font-serif text-xl font-semibold">Acknowledgment</h2>
            <p className="mt-2 text-sm leading-relaxed">
              BY USING SHOWUP, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE 
              BOUND BY THESE TERMS OF SERVICE. YOU UNDERSTAND THAT CHALLENGES INVOLVE FINANCIAL 
              RISK AND THAT YOU MAY LOSE YOUR STAKE IF YOU FAIL TO COMPLETE THE CHALLENGE 
              SUCCESSFULLY. YOU ACKNOWLEDGE THAT ALL YIELD GENERATED ON YOUR STAKE IS RETAINED 
              BY SHOWUP AND YOU WILL ONLY RECEIVE YOUR ORIGINAL STAKE AMOUNT UPON SUCCESSFUL 
              COMPLETION.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
