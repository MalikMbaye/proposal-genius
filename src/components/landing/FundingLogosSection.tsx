import vcFunding from "@/assets/logos/vc-funding.png";

export function FundingLogosSection() {
  return (
    <section className="py-20 md:py-28 bg-[#0f0f0f] overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Our Clients Raised Funding From
            <br />
            <span className="text-gradient">Leading Venture Capital Firms</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            These pitches helped startups secure funding from top-tier investors
          </p>
        </div>
        <img 
          src={vcFunding} 
          alt="Clients raised funding from Google, Techstars, SoftBank, Vista, Essence, SXSW, Fidelity, Upfront, MaC, Backstage Capital, and more"
          className="w-full h-auto max-w-5xl mx-auto"
        />
      </div>
    </section>
  );
}
