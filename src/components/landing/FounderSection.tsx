import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import malikHeadshot from "@/assets/malik-headshot.jpeg";

const companyLogos = [
  { name: "Meta", logo: "M" },
  { name: "LinkedIn", logo: "in" },
  { name: "Lyft", logo: "L" },
  { name: "Google", logo: "G" },
  { name: "Bain", logo: "B" },
];

const proofPoints = [
  "Featured in Forbes, TechCrunch, FastCompany",
  "100+ career placements at McKinsey, Goldman, Deloitte",
  "Howard University alum",
];

export function FounderSection() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-zinc-900/50 to-background relative overflow-hidden">
      {/* Subtle background effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
          {/* Left Column - Image & Logos */}
          <div className="lg:col-span-2 flex flex-col items-center">
            {/* Headshot */}
            <div className="relative mb-8">
              <div className="w-64 h-64 md:w-72 md:h-72 rounded-2xl overflow-hidden border-2 border-zinc-700/50 shadow-2xl shadow-primary/10">
                <img
                  src={malikHeadshot}
                  alt="Malik Mbaye - Founder"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              {/* Decorative glow */}
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-transparent rounded-3xl blur-2xl -z-10" />
            </div>

            {/* Company Logos */}
            <p className="text-sm text-muted-foreground mb-4 font-medium tracking-wide uppercase">
              Previously at
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {companyLogos.map((company) => (
                <div
                  key={company.name}
                  className="w-12 h-12 rounded-lg bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center text-zinc-400 font-semibold text-sm hover:bg-zinc-700/80 hover:text-zinc-200 transition-colors"
                  title={company.name}
                >
                  {company.logo}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-3">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Built by a Proposal Writer Who's Closed{" "}
              <span className="text-gradient">$10M+ in Deals</span>
            </h2>
            
            <p className="text-lg text-muted-foreground italic mb-6">
              Not another generic AI tool. This system was built from 8 years of real client work.
            </p>

            <div className="space-y-4 text-zinc-300 mb-8">
              <p>
                I'm <strong className="text-foreground">Malik Mbaye</strong>. I've spent nearly a decade writing proposals that actually close—for startups, agencies, and consultants.
              </p>
              
              <p>
                Before building this tool, I was a Product Marketing Manager at <strong className="text-foreground">Meta</strong>, where I launched features to 800M+ users. I've worked at LinkedIn, Lyft, and Upwork. I've advised startups that raised $50M+ from firms like Google Ventures, SoftBank, and Techstars.
              </p>
              
              <p>
                But here's what matters for you: Through my consultancy <strong className="text-foreground">Black Lotus</strong>, I've personally written 50+ proposals that helped clients generate over $10M in revenue. The RipRight proposal in your library? That client scaled from $15K/month to $350K/month. The MOGL proposal? They won SXSW and raised $2.6M.
              </p>
              
              <p className="text-foreground font-medium border-l-2 border-primary pl-4">
                This tool isn't built on theory. It's built on the exact system I use to close deals—now available to you.
              </p>
            </div>

            {/* Proof Points */}
            <div className="flex flex-wrap gap-2 mb-8">
              {proofPoints.map((point, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-zinc-800/60 border border-zinc-700/50 rounded-full text-sm text-zinc-300"
                >
                  {point}
                </span>
              ))}
            </div>

            {/* CTA Button */}
            <Button
              variant="outline"
              className="group border-zinc-600 hover:border-primary hover:bg-primary/10"
              asChild
            >
              <a
                href="https://www.linkedin.com/in/malikmbaye"
                target="_blank"
                rel="noopener noreferrer"
              >
                See My Full Background
                <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
