import alumniLogos from "@/assets/logos/alumni-companies.png";

export function AlumniLogosSection() {
  return (
    <section className="py-20 md:py-28 bg-[#2d2654] overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Used by Alumni of
            <br />
            <span className="text-white/80">Industry-Leading Companies</span>
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Consultants and freelancers from the world's top companies trust Pitch Genius
          </p>
        </div>
        <img 
          src={alumniLogos} 
          alt="Used by alumni of Microsoft, Goldman Sachs, Google, Robinhood, Deloitte, Morgan Stanley, Facebook, PayPal, Citi, and more"
          className="w-full h-auto max-w-4xl mx-auto"
        />
      </div>
    </section>
  );
}
