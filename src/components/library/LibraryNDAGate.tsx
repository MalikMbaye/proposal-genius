import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface LibraryNDAGateProps {
  onAccepted: () => void;
}

export function LibraryNDAGate({ onAccepted }: LibraryNDAGateProps) {
  const { user } = useAuth();
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleAccept = async () => {
    if (!user || !agreed) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("library_nda_acceptances")
        .insert({ user_id: user.id });

      if (error) throw error;

      toast.success("NDA accepted. Welcome to the Library!");
      onAccepted();
    } catch (err) {
      console.error("Error accepting NDA:", err);
      toast.error("Failed to record acceptance. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Non-Disclosure Agreement</h1>
        <p className="text-muted-foreground">
          Please read and accept the following terms before accessing the Proposal Library.
        </p>
      </div>

      <Card className="p-6 mb-6">
        <ScrollArea className="h-80 pr-4">
          <div className="space-y-4 text-sm text-muted-foreground">
            <h3 className="text-foreground font-semibold">CONFIDENTIALITY AND NON-DISCLOSURE AGREEMENT</h3>
            
            <p>
              By accessing the Pitch Genius Proposal Library ("Library"), you ("User") agree to the following terms:
            </p>

            <h4 className="text-foreground font-medium">1. CONFIDENTIAL INFORMATION</h4>
            <p>
              The Library contains proprietary business proposals, strategies, pricing structures, and methodologies 
              ("Confidential Information") that are the exclusive intellectual property of Pitch Genius and its licensors.
            </p>

            <h4 className="text-foreground font-medium">2. NON-DISCLOSURE OBLIGATIONS</h4>
            <p>You agree to:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Keep all Confidential Information strictly confidential</li>
              <li>Not copy, reproduce, screenshot, download, or distribute any Library content</li>
              <li>Not share your account access with any third parties</li>
              <li>Not use Library content to create competing products or services</li>
              <li>Not resell, license, or commercially exploit any Library content</li>
            </ul>

            <h4 className="text-foreground font-medium">3. PERMITTED USE</h4>
            <p>
              You may use the Library content solely for personal educational purposes and as reference material 
              for creating your own original proposals. You may not copy content verbatim.
            </p>

            <h4 className="text-foreground font-medium">4. INTELLECTUAL PROPERTY</h4>
            <p>
              All proposals in the Library are shared pursuant to promotional rights clauses in the original 
              client contracts. No personally identifiable information is disclosed. All content remains the 
              intellectual property of Pitch Genius.
            </p>

            <h4 className="text-foreground font-medium">5. ENFORCEMENT</h4>
            <p>
              Violation of this agreement may result in immediate termination of access, legal action, and 
              liability for damages including but not limited to actual damages, lost profits, and legal fees.
            </p>

            <h4 className="text-foreground font-medium">6. MONITORING</h4>
            <p>
              Access to the Library is logged and monitored. Attempts to circumvent security measures, 
              capture content, or violate these terms will be detected and may result in legal action.
            </p>

            <h4 className="text-foreground font-medium">7. TERM</h4>
            <p>
              Your confidentiality obligations under this agreement survive indefinitely, even after 
              termination of your Library access.
            </p>
          </div>
        </ScrollArea>
      </Card>

      <div className="flex items-start gap-3 mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-200">
          <strong>Important:</strong> Screenshots and downloads are disabled throughout this section. 
          Content is watermarked and access is logged for security purposes.
        </p>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <Checkbox
          id="nda-agree"
          checked={agreed}
          onCheckedChange={(checked) => setAgreed(checked === true)}
        />
        <label htmlFor="nda-agree" className="text-sm cursor-pointer">
          I have read, understand, and agree to the terms of this Non-Disclosure Agreement.
        </label>
      </div>

      <Button
        onClick={handleAccept}
        disabled={!agreed || submitting}
        className="w-full"
        size="lg"
      >
        {submitting ? "Processing..." : "Accept & Enter Library"}
      </Button>
    </div>
  );
}
