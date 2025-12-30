import pressLogos from "@/assets/logos/press-featured.png";

export function PressLogosSection() {
  return (
    <section className="py-6 bg-[#2d2654] overflow-hidden">
      <div className="container mx-auto px-4">
        <img 
          src={pressLogos} 
          alt="Featured in TechCrunch, Fast Company, Inc, Forbes, Good Morning America, Yahoo, The New York Times, NBC News"
          className="w-full h-auto max-h-14 object-contain"
        />
      </div>
    </section>
  );
}
