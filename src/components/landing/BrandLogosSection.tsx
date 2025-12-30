import { BrandMarquee } from "./LogoMarquee";

// Brands/Companies deals were closed with
const featuredEngagements = [
  "Facebook", "GoPro", "British Airways", "Corona", "Domino's", 
  "Yelp", "Lyft", "LUMIX", "Meta", "Red Bull", "Upwork", 
  "Shangri-La", "Accenture", "L'Oréal", "J.P. Morgan", "Morgan Stanley",
  "Kearney", "Lonely Planet", "Travel+Leisure", "Condé Nast"
];

export function BrandLogosSection() {
  return (
    <section className="py-12 border-y border-border/30 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4 mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground text-center font-medium">
          Pitches that closed deals with
        </p>
      </div>
      <BrandMarquee logos={featuredEngagements} direction="left" speed="slow" variant="muted" />
    </section>
  );
}
