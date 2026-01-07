import featureGrid from "@/assets/dm-closer/feature-grid.png";

export function DMFeaturesSection() {
  return (
    <section className="py-12 md:py-16 bg-[#080c10]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h3 className="text-2xl md:text-3xl font-bold text-white">
            Everything You Need to <span className="text-emerald-400">Close in DMs</span>
          </h3>
        </div>
        <div className="max-w-4xl mx-auto">
          <img 
            src={featureGrid} 
            alt="DM Closer AI Features - Instant Analysis, 3 Response Options, Lead Scoring, Zero Account Risk" 
            className="w-full rounded-xl"
          />
        </div>
      </div>
    </section>
  );
}
