import { BrandMarquee } from "./LogoMarquee";

// VCs and funding sources
const fundingSources = [
  "SoftBank", "Techstars", "Google Ventures", "Vista Equity", 
  "Essence VC", "SXSW", "Backstage Capital", "Upfront Ventures",
  "MaC Venture Capital", "Black Ambition", "Fidelity", "Next Play Capital",
  "Commerce Ventures", "PivotNorth", "Sand Hill Angels", "Cross River"
];

export function FundingLogosSection() {
  return (
    <section className="py-12 bg-gradient-to-r from-primary/5 via-transparent to-accent-secondary/5 overflow-hidden">
      <div className="container mx-auto px-4 mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground text-center font-medium">
          Our clients raised funding from
        </p>
      </div>
      <BrandMarquee logos={fundingSources} direction="right" speed="slow" variant="muted" />
    </section>
  );
}
