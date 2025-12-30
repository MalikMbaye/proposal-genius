import { ExternalLink, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import malikHeadshot from "@/assets/malik-headshot.jpeg";

const stats = [
  { value: "$50M+", label: "Raised" },
  { value: "$10M+", label: "Revenue" },
  { value: "100+", label: "Coached" },
];

// Company logos as inline SVG components for crisp rendering
const MetaLogo = () => (
  <svg viewBox="0 0 120 24" className="h-6 md:h-7 w-auto" fill="currentColor">
    <text x="0" y="18" className="text-lg font-bold" style={{ fontFamily: 'system-ui' }}>
      <tspan fill="#0668E1">∞</tspan>
      <tspan fill="white" dx="4">Meta</tspan>
    </text>
  </svg>
);

const LinkedInLogo = () => (
  <svg viewBox="0 0 84 21" className="h-5 md:h-6 w-auto">
    <text x="0" y="17" fill="white" className="text-lg font-bold" style={{ fontFamily: 'system-ui' }}>
      Linked
      <tspan fill="white" style={{ backgroundColor: '#0A66C2' }}>in</tspan>
    </text>
  </svg>
);

// Use text-based logos with proper styling to match the reference
const companyLogos = [
  { name: "Meta", icon: "∞", color: "#0668E1" },
  { name: "LinkedIn", icon: "in", color: "#0A66C2" },
  { name: "Google", icon: null, color: "#4285F4" },
  { name: "Lyft", icon: null, color: "#FF00BF" },
  { name: "Morgan Stanley", icon: null, color: "#FFFFFF" },
  { name: "Bain", icon: "◉", color: "#CC0000" },
  { name: "Upwork", icon: null, color: "#14A800" },
  { name: "Twitter", icon: "𝕏", color: "#FFFFFF" },
];

function CompanyLogoItem({ company }: { company: typeof companyLogos[0] }) {
  return (
    <div className="flex items-center gap-1.5 flex-shrink-0">
      {company.icon && (
        <span 
          className="text-xl md:text-2xl font-bold"
          style={{ color: company.color }}
        >
          {company.icon}
        </span>
      )}
      <span 
        className="text-lg md:text-xl font-bold tracking-tight whitespace-nowrap"
        style={{ color: company.color }}
      >
        {company.icon === "∞" || company.icon === "in" ? "" : company.name}
        {company.icon === "∞" && "Meta"}
        {company.icon === "in" && (
          <>
            Linked<span className="bg-[#0A66C2] text-white px-0.5 rounded-sm">in</span>
          </>
        )}
      </span>
    </div>
  );
}

function ExperienceMarquee() {
  const doubled = [...companyLogos, ...companyLogos];
  
  return (
    <div className="relative overflow-hidden py-6">
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 md:w-32 bg-gradient-to-r from-slate-900 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 md:w-32 bg-gradient-to-l from-slate-900 to-transparent z-10" />
      
      <div className="flex w-[200%] animate-scroll-left items-center gap-10 md:gap-16 will-change-transform">
        {doubled.map((company, idx) => (
          <CompanyLogoItem key={`${company.name}-${idx}`} company={company} />
        ))}
      </div>
    </div>
  );
}

export function FounderSection() {
  return (
    <section id="founder" className="py-20 md:py-28 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Subtle background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-primary/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">
          {/* Left Column - Image */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative w-full max-w-md">
              {/* Outer glow frame */}
              <div className="absolute -inset-2 bg-gradient-to-br from-blue-500/30 via-slate-600/20 to-slate-800/30 rounded-3xl blur-xl" />
              
              {/* Image container with glass border */}
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border-2 border-slate-500/30 shadow-2xl shadow-blue-900/30 bg-gradient-to-br from-slate-700/30 to-slate-900/50 p-1.5">
                <img
                  src={malikHeadshot}
                  alt="Malik Mbaye - Founder"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div>
            {/* Headline */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
              Built by a Seven-Figure Consultant Who's Closed{" "}
              <span className="text-gradient">$1.5M+ with Fortune 500s & Venture-Backed Startups</span>
            </h2>

            {/* Stat Cards */}
            <div className="flex flex-wrap gap-4 mb-10">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="flex-1 min-w-[110px] max-w-[150px] px-6 py-5 rounded-xl border border-slate-600/50 bg-slate-800/50 backdrop-blur-sm text-center shadow-lg shadow-slate-900/50"
                >
                  <div className="text-3xl md:text-4xl font-black text-white">{stat.value}</div>
                  <div className="text-xs text-slate-400 mt-1.5 uppercase tracking-widest font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Main paragraph copy */}
            <div className="space-y-4 text-slate-300 mb-8">
              <p>
                I'm <strong className="text-white">Malik Mbaye</strong>. I started my first business at 16 and scaled it to 23 countries. Since then, I've spent nearly a decade writing proposals that actually close—for startups, agencies, and consultants.
              </p>
              
              <p>
                I was a Product Marketing Manager at <strong className="text-white">Facebook</strong>, launching features to 800M+ users. I've worked at LinkedIn, Lyft, and Upwork. I've helped startups raise $50M+ from Google Ventures, SoftBank, and Techstars—and raised money myself from Twitter and Google.
              </p>
              
              <p>
                Through my consultancy <strong className="text-white">Black Lotus</strong>, I've personally written 50+ proposals generating over $10M in client revenue.
              </p>
              
              <p className="text-white font-medium border-l-2 border-primary pl-4 bg-slate-800/50 py-3 pr-4 rounded-r-lg">
                This tool isn't built on theory. It's built on the exact system I use to close deals—now available to you.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                className="group bg-white text-[#0A66C2] hover:bg-slate-100 border border-slate-200"
                asChild
              >
                <a
                  href="https://www.linkedin.com/in/malikmbaye"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="mr-2 h-4 w-4" />
                  Add Me on LinkedIn
                  <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </Button>
              <Button
                className="group bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 border-0"
                asChild
              >
                <a
                  href="https://www.instagram.com/malikmbaye"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="mr-2 h-4 w-4" />
                  Follow Me on Instagram
                  <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Full-width Marquee Company Logos */}
        <div className="mt-16">
          <p className="text-xs text-slate-500 font-medium tracking-[0.25em] uppercase text-center mb-2">
            Experience At
          </p>
          <ExperienceMarquee />
        </div>
      </div>
    </section>
  );
}