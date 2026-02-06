import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Showup",
  description: "How Showup collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  const lastUpdated = "February 6, 2026";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-serif text-4xl font-semibold tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: {lastUpdated}
        </p>

        <div className="mt-10 space-y-8 text-foreground/90">
          <section>
            <h2 className="font-serif text-2xl font-semibold">Introduction</h2>
            <p className="mt-3 leading-relaxed">
              Showup ("we," "us," or "our") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, store, and safeguard 
              your personal information when you use our accountability challenge platform.
            </p>
            <p className="mt-3 leading-relaxed">
              By using Showup, you consent to the practices described in this Privacy Policy. 
              If you do not agree, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold">Information We Collect</h2>
            
            <h3 className="mt-4 text-lg font-medium">Account Information</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Name and email address</li>
              <li>Account credentials (encrypted passwords)</li>
              <li>Profile information you choose to provide</li>
            </ul>

            <h3 className="mt-4 text-lg font-medium">Challenge Data</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Daily photo submissions (16:9 portrait images)</li>
              <li>Challenge descriptions and goals</li>
              <li>Progress tracking and completion history</li>
              <li>Guarantor relationships and voting records</li>
            </ul>

            <h3 className="mt-4 text-lg font-medium">Financial Information</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Payment method details (processed securely via Stripe)</li>
              <li>Challenge stake amounts</li>
              <li>Transaction history</li>
              <li>Crypto wallet addresses (if using blockchain payments)</li>
            </ul>

            <h3 className="mt-4 text-lg font-medium">Technical Data</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Usage patterns and app interactions</li>
              <li>Error logs and diagnostics</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold">How We Use Your Information</h2>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li><strong>Service Delivery:</strong> To provide challenge creation, tracking, and guarantor voting functionality.</li>
              <li><strong>Financial Processing:</strong> To process stakes, manage escrow, handle returns or forfeitures, and generate yield through AAVE integration. All accrued yield is retained by Showup as platform revenue.</li>
              <li><strong>Verification:</strong> To enable guarantors to review and vote on daily submissions.</li>
              <li><strong>Communication:</strong> To send challenge reminders, voting notifications, and important updates.</li>
              <li><strong>Improvement:</strong> To analyze usage patterns and improve our platform.</li>
              <li><strong>Security:</strong> To detect fraud, prevent abuse, and protect user accounts.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold">Image Storage & Privacy</h2>
            <p className="mt-3 leading-relaxed">
              Your daily challenge submissions are stored securely and are only visible to:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>You (the challenge creator)</li>
              <li>The guarantors you specifically invite to your challenge</li>
              <li>Showup administrators (for moderation and support purposes only)</li>
            </ul>
            <p className="mt-3 leading-relaxed">
              We implement strict 16:9 portrait aspect ratio requirements to maintain 
              consistency and prevent misuse. Images are retained for the duration of 
              your challenge plus 90 days, after which they are automatically deleted 
              unless required for dispute resolution.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold">Data Sharing</h2>
            <p className="mt-3 leading-relaxed">We share information only with:</p>
            <ul className="mt-2 list-disc space-y-2 pl-6">
              <li><strong>Guarantors:</strong> Your invited guarantors can see your challenge name, description, and daily submissions during the active challenge period.</li>
              <li><strong>Payment Processors:</strong> Stripe processes payment transactions. We do not store full payment card details.</li>
              <li><strong>Blockchain Networks:</strong> For crypto challenges, transaction data is recorded on public blockchains (Ethereum, Polygon, or Base).</li>
              <li><strong>Service Providers:</strong> Cloud hosting, analytics, and customer support tools that help us operate the platform.</li>
              <li><strong>Legal Compliance:</strong> When required by law or to protect our rights and users.</li>
            </ul>
            <p className="mt-3 leading-relaxed">
              We never sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold">Financial Data Security</h2>
            <p className="mt-3 leading-relaxed">
              Challenge stakes are held in escrow and deposited into AAVE liquidity pools 
              to generate yield during the challenge period. Upon successful completion, 
              your original stake is returned; all accrued yield is retained by Showup. 
              We use industry-standard security measures including:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>256-bit SSL/TLS encryption for all data transmission</li>
              <li>PCI DSS compliant payment processing via Stripe</li>
              <li>Multi-signature wallets for crypto escrow (where applicable)</li>
              <li>Regular security audits of smart contracts</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold">Your Rights</h2>
            <p className="mt-3 leading-relaxed">You have the right to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data (subject to legal retention requirements)</li>
              <li>Export your data in a portable format</li>
              <li>Opt out of marketing communications</li>
              <li>Withdraw consent for data processing</li>
            </ul>
            <p className="mt-3 leading-relaxed">
              To exercise these rights, contact us at privacy@showup.app.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold">Data Retention</h2>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Account data: Retained until account deletion</li>
              <li>Challenge images: 90 days after challenge completion</li>
              <li>Financial records: 7 years (tax and legal compliance)</li>
              <li>Transaction history: 7 years</li>
              <li>Deleted accounts: Anonymized after 30 days, fully purged after 1 year</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold">Children's Privacy</h2>
            <p className="mt-3 leading-relaxed">
              Showup is not intended for users under 18 years of age. We do not knowingly 
              collect data from minors. If you believe we have collected information from 
              a minor, contact us immediately for deletion.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold">Changes to This Policy</h2>
            <p className="mt-3 leading-relaxed">
              We may update this Privacy Policy periodically. We will notify you of significant 
              changes via email or in-app notification. Continued use after changes constitutes 
              acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold">Contact Us</h2>
            <p className="mt-3 leading-relaxed">
              For privacy-related questions, data requests, or concerns:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Email: privacy@showup.app</li>
              <li>Address: Showup, Inc. — Privacy Team</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
