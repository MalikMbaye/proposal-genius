import featuredEngagements from "@/assets/logos/featured-engagements.png";

export function BrandLogosSection() {
  return (
    <section className="py-8 bg-[#0a0a0a] overflow-hidden">
      <div className="container mx-auto px-4">
        <img 
          src={featuredEngagements} 
          alt="Featured Engagements - Facebook, GoPro, British Airways, Corona, Domino's, Yelp, Lyft, LUMIX"
          className="w-full h-auto max-h-16 object-contain opacity-90"
        />
      </div>
    </section>
  );
}
