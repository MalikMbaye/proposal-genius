import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/AppLayout";
import { LibraryNDAGate } from "@/components/library/LibraryNDAGate";
import { LibraryUpgradePrompt } from "@/components/library/LibraryUpgradePrompt";
import { LibraryDashboard } from "@/components/library/LibraryDashboard";
import { Loader2 } from "lucide-react";

export default function Library() {
  const { user } = useAuth();
  const { has_lifetime, loading: subLoading } = useSubscription();
  const [hasAcceptedNDA, setHasAcceptedNDA] = useState<boolean | null>(null);
  const [checkingNDA, setCheckingNDA] = useState(true);

  const hasAccess = has_lifetime;

  useEffect(() => {
    if (!user || !hasAccess) {
      setCheckingNDA(false);
      return;
    }

    const checkNDA = async () => {
      const { data } = await supabase
        .from("library_nda_acceptances")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      
      setHasAcceptedNDA(!!data);
      setCheckingNDA(false);
    };

    checkNDA();
  }, [user, hasAccess]);

  const handleNDAAccepted = () => {
    setHasAcceptedNDA(true);
  };

  if (subLoading || checkingNDA) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  // No lifetime access - show upgrade prompt
  if (!hasAccess) {
    return (
      <AppLayout>
        <LibraryUpgradePrompt />
      </AppLayout>
    );
  }

  // Has access but hasn't accepted NDA
  if (!hasAcceptedNDA) {
    return (
      <AppLayout>
        <LibraryNDAGate onAccepted={handleNDAAccepted} />
      </AppLayout>
    );
  }

  // Full access
  return (
    <AppLayout>
      <LibraryDashboard />
    </AppLayout>
  );
}
