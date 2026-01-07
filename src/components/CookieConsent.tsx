import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const COOKIE_CONSENT_KEY = "pitch-genius-cookie-consent";

type ConsentStatus = "accepted" | "declined" | null;

export function CookieConsent() {
  const [consent, setConsent] = useState<ConsentStatus>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (stored === "accepted" || stored === "declined") {
      setConsent(stored);
    } else {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setConsent("accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    setConsent("declined");
    setIsVisible(false);
  };

  if (!isVisible || consent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-card/95 backdrop-blur-sm border-t border-border shadow-lg animate-in slide-in-from-bottom-4 duration-300">
      <div className="container mx-auto max-w-4xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 pr-8">
          <p className="text-sm text-muted-foreground">
            We use cookies to enhance your experience and analyze site traffic. By clicking "Accept", you consent to our use of cookies. Read our{" "}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>{" "}
            for more information.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button variant="outline" size="sm" onClick={handleDecline}>
            Decline
          </Button>
          <Button size="sm" onClick={handleAccept}>
            Accept
          </Button>
        </div>
        <button
          onClick={handleDecline}
          className="absolute top-2 right-2 sm:hidden p-1 text-muted-foreground hover:text-foreground"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
