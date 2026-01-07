import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Mail, Sparkles } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Features", href: "#solution" },
    { label: "DM Closer AI", href: "#dm-closer" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="py-16 border-t border-border/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Logo column */}
          <div className="col-span-2 md:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <Logo />
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              AI-powered proposals for consultants who deserve better.
            </p>
            
            {/* Early Access Substack CTA */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 max-w-sm">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">Get Early Access</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Subscribe to get first access to new features, Chrome extension, and sales tips.
              </p>
              <a
                href="https://malikmbaye.substack.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                <Mail className="h-4 w-4" />
                Subscribe on Substack →
              </a>
            </div>
          </div>
          
          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href} 
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Bottom bar */}
        <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 Pitch Genius. Built by{" "}
            <a 
              href="https://blacklotus.co" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              Black Lotus Ventures
            </a>
          </p>
          <p className="text-sm text-muted-foreground">
            support@pitchgenius.io
          </p>
        </div>
      </div>
    </footer>
  );
}
