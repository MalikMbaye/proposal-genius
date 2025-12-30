import { BrandMarquee } from "./LogoMarquee";

// Press and media outlets
const pressOutlets = [
  "TechCrunch", "Fast Company", "Forbes", "NBC News", "Yahoo!", 
  "The New York Times", "Inc.", "Bloomberg", "Business Insider",
  "CNBC", "Fox Business", "GQ", "Adweek", "CNN", "ESPN",
  "Good Morning America", "Los Angeles Times", "VentureBeat"
];

export function PressLogosSection() {
  return (
    <section className="py-12 bg-slate-900 overflow-hidden">
      <div className="container mx-auto px-4 mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400 text-center font-medium">
          Our work has been featured in
        </p>
      </div>
      <div className="opacity-70">
        <BrandMarquee logos={pressOutlets} direction="left" speed="normal" variant="bright" />
      </div>
    </section>
  );
}
