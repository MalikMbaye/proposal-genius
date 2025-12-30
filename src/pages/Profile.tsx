import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Building2, Mail, Briefcase, FileText, Trophy } from "lucide-react";

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [businessContext, setBusinessContext] = useState("");
  const [background, setBackground] = useState("");
  const [proofPoints, setProofPoints] = useState("");

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("company_name, business_context, background, proof_points")
        .eq("id", user?.id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setCompanyName(data.company_name || "");
        setBusinessContext(data.business_context || "");
        setBackground(data.background || "");
        setProofPoints(data.proof_points || "");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ 
          company_name: companyName,
          business_context: businessContext,
          background: background,
          proof_points: proofPoints
        })
        .eq("id", user.id);

      if (error) throw error;
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-radial-gradient" />
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      
      <Navbar />

      <main className="relative pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-2xl">
          <Link
            to="/proposals"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Proposals
          </Link>

          <div className="glass-card rounded-2xl p-8">
            <h1 className="text-2xl font-bold mb-2">Account Settings</h1>
            <p className="text-muted-foreground mb-8">
              Manage your account and business information. This context will be used in all your proposals.
            </p>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Account Section */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold border-b border-border pb-2">Account</h2>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="bg-muted/50"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company" className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      Company Name
                    </Label>
                    <Input
                      id="company"
                      type="text"
                      placeholder="Your company name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                </div>

                {/* Business Context Section */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold border-b border-border pb-2">Business Profile</h2>
                  <p className="text-sm text-muted-foreground">
                    Set this up once and it will be used for all your proposals.
                  </p>
                  
                  <div className="space-y-2">
                    <Label htmlFor="businessContext" className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      Business Context
                    </Label>
                    <Textarea
                      id="businessContext"
                      placeholder="Describe your business, services, and what makes you unique. E.g., 'We are a growth marketing agency specializing in B2B SaaS. We offer paid acquisition, content strategy, and AI-powered lead generation.'"
                      value={businessContext}
                      onChange={(e) => setBusinessContext(e.target.value)}
                      className="bg-background/50 min-h-[100px]"
                    />
                    <p className="text-xs text-muted-foreground">
                      General context about your business and services
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="background" className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      Your Background
                    </Label>
                    <Textarea
                      id="background"
                      placeholder="• 8 years in growth marketing & B2B SaaS&#10;• Scaled 3 companies to 7-figures&#10;• Built AI-powered lead generation systems&#10;• Ex-LinkedIn, worked on Jobs product"
                      value={background}
                      onChange={(e) => setBackground(e.target.value)}
                      className="bg-background/50 min-h-[120px]"
                    />
                    <p className="text-xs text-muted-foreground">
                      Your professional experience and credentials
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="proofPoints" className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-muted-foreground" />
                      Key Accomplishments & Proof Points
                    </Label>
                    <Textarea
                      id="proofPoints"
                      placeholder="• Scaled RipRight from $15K/mo to $350K/mo in 8 months&#10;• Generated 100M+ views and managed $1.7M ad spend&#10;• Built AI lead gen system generating 15+ meetings/week&#10;• Worked with Google-backed startups and Fortune 500 clients"
                      value={proofPoints}
                      onChange={(e) => setProofPoints(e.target.value)}
                      className="bg-background/50 min-h-[120px]"
                    />
                    <p className="text-xs text-muted-foreground">
                      Success metrics and case study highlights that will be included in proposals
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSave}
                    variant="hero"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>

                <div className="border-t border-border pt-6 mt-6">
                  <h2 className="text-lg font-semibold mb-4 text-destructive">
                    Danger Zone
                  </h2>
                  <Button
                    variant="outline"
                    onClick={handleSignOut}
                    className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}