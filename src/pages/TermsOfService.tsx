import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="container mx-auto max-w-3xl">
        <Link to="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: January 7, 2025</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using Pitch Genius (the "Service"), including our web application and Chrome extension, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground leading-relaxed">
              Pitch Genius provides AI-powered proposal generation tools for consultants and freelancers. Our Service includes:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Web-based proposal generation</li>
              <li>Chrome extension for DM analysis and lead management</li>
              <li>Presentation deck generation</li>
              <li>Contract templates</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Account Registration</h2>
            <p className="text-muted-foreground leading-relaxed">
              To use certain features, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must provide accurate information and promptly update it if it changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Subscription and Payment</h2>
            <p className="text-muted-foreground leading-relaxed">
              Some features require a paid subscription. By subscribing, you agree to pay the applicable fees. Subscriptions automatically renew unless cancelled. Refunds are provided at our discretion per our refund policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Acceptable Use</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree not to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Use the Service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to the Service</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Upload malicious code or content</li>
              <li>Resell or redistribute the Service without permission</li>
              <li>Use the Service to spam or harass others</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              The Service and its original content, features, and functionality are owned by Pitch Genius and are protected by copyright, trademark, and other intellectual property laws. You retain ownership of the content you create using the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. AI-Generated Content</h2>
            <p className="text-muted-foreground leading-relaxed">
              The Service uses artificial intelligence to generate proposals and other content. While we strive for accuracy, AI-generated content may contain errors. You are responsible for reviewing and editing all generated content before use. We are not liable for any consequences of using AI-generated content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Chrome Extension</h2>
            <p className="text-muted-foreground leading-relaxed">
              By using our Chrome extension, you agree that:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>You will use it in compliance with the platforms you access (e.g., Instagram's Terms of Service)</li>
              <li>You are responsible for any actions taken using the extension</li>
              <li>The extension is provided "as is" and we are not liable for platform-specific issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Disclaimer of Warranties</h2>
            <p className="text-muted-foreground leading-relaxed">
              THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT GUARANTEE THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, PITCH GENIUS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may terminate or suspend your account at any time for violation of these Terms. Upon termination, your right to use the Service will immediately cease.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify users of material changes. Continued use of the Service after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms shall be governed by the laws of the State of Delaware, United States, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">14. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              For questions about these Terms, contact us at support@pitchgenius.io.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
