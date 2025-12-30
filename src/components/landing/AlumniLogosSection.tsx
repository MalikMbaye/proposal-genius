import { BrandMarquee } from "./LogoMarquee";

// Companies our clients are alumni of
const alumniCompanies = [
  "Microsoft", "Goldman Sachs", "Google", "Robinhood", "Deloitte",
  "Morgan Stanley", "Facebook", "PayPal", "Snapchat", "Barclays",
  "General Assembly", "Affirm", "Citi", "McKinsey", "Bain & Company"
];

export function AlumniLogosSection() {
  return (
    <section className="py-10 border-y border-border/20 bg-background overflow-hidden">
      <div className="container mx-auto px-4 mb-5">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground text-center font-medium">
          Our clients are alumni of
        </p>
      </div>
      <BrandMarquee logos={alumniCompanies} direction="right" speed="normal" variant="muted" />
    </section>
  );
}
