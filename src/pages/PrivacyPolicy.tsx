import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="container mx-auto max-w-3xl">
        <Link to="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: January 7, 2025</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              Pitch Genius ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our web application and Chrome extension (collectively, the "Service").
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-medium mt-6 mb-3">2.1 Account Information</h3>
            <p className="text-muted-foreground leading-relaxed">
              When you create an account, we collect your email address and password (encrypted). If you sign up through a third-party provider, we may receive your name and email from that provider.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">2.2 Proposal and Business Data</h3>
            <p className="text-muted-foreground leading-relaxed">
              When you use our proposal generation features, we collect the information you provide, including client names, project descriptions, pricing details, and business context. This data is used solely to generate your proposals and is stored securely in your account.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">2.3 Chrome Extension Data</h3>
            <p className="text-muted-foreground leading-relaxed">
              Our Chrome extension ("Pitch Genius DM Assistant") collects the following data when you use it:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>DM Screenshots:</strong> When you click "Analyze Current DM," the extension captures a screenshot of the visible conversation to analyze the context and generate response suggestions.</li>
              <li><strong>Lead Information:</strong> If you choose to save a lead, we store the lead name, platform, conversation analysis, and any notes you add.</li>
              <li><strong>Authentication Tokens:</strong> We store your session token locally to keep you signed in.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              <strong>What we DO NOT collect:</strong> We do not continuously monitor your browsing activity. The extension only activates when you explicitly click the analyze button. We do not sell or share your DM content with third parties.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">2.4 Usage Data</h3>
            <p className="text-muted-foreground leading-relaxed">
              We collect information about how you use the Service, including pages visited, features used, and API usage for billing purposes.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">2.5 Payment Information</h3>
            <p className="text-muted-foreground leading-relaxed">
              Payment processing is handled by Stripe. We do not store your full credit card number. Stripe may collect and store payment information in accordance with their privacy policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>To provide and maintain the Service</li>
              <li>To generate proposals and analyze DM conversations</li>
              <li>To process payments and manage subscriptions</li>
              <li>To communicate with you about your account</li>
              <li>To improve and optimize the Service</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Data Storage and Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your data is stored securely using industry-standard encryption. We use Supabase for database storage, which provides enterprise-grade security including encryption at rest and in transit. Access to your data is protected by authentication and row-level security policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Data Sharing</h2>
            <p className="text-muted-foreground leading-relaxed">
              We do not sell your personal information. We may share data with:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Service Providers:</strong> Third-party services that help us operate (e.g., Stripe for payments, AI providers for proposal generation)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and associated data</li>
              <li>Export your data</li>
              <li>Opt out of marketing communications</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              To exercise these rights, contact us at support@pitchgenius.io.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Chrome Extension Permissions</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our Chrome extension requests the following permissions:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>activeTab:</strong> To capture the current tab when you click analyze</li>
              <li><strong>storage:</strong> To store your authentication session locally</li>
              <li><strong>Host permissions:</strong> To communicate with our backend API</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              We retain your data for as long as your account is active. If you delete your account, we will delete your personal data within 30 days, except where we are required to retain it for legal purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              The Service is not intended for users under 18 years of age. We do not knowingly collect information from children.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-muted-foreground mt-2">
              Email: support@pitchgenius.io
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
