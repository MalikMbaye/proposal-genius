import { ExternalLink, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import malikHeadshot from "@/assets/malik-headshot.jpeg";

// Company logos as SVG paths/components
const CompanyLogo = ({ name }: { name: string }) => {
  const logos: Record<string, JSX.Element> = {
    Meta: (
      <svg viewBox="0 0 100 20" className="h-5 w-auto">
        <text x="0" y="15" className="fill-current font-bold text-[16px]" style={{ fontFamily: 'system-ui' }}>Meta</text>
      </svg>
    ),
    LinkedIn: (
      <svg viewBox="0 0 24 24" className="h-5 w-auto fill-current">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    Lyft: (
      <svg viewBox="0 0 100 20" className="h-5 w-auto">
        <text x="0" y="15" className="fill-current font-bold text-[16px]" style={{ fontFamily: 'system-ui' }}>Lyft</text>
      </svg>
    ),
    Google: (
      <svg viewBox="0 0 24 24" className="h-5 w-auto fill-current">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    ),
    Bain: (
      <svg viewBox="0 0 100 20" className="h-5 w-auto">
        <text x="0" y="15" className="fill-current font-bold text-[16px]" style={{ fontFamily: 'system-ui' }}>BAIN</text>
      </svg>
    ),
  };
  
  return (
    <div className="text-zinc-400 hover:text-zinc-200 transition-colors" title={name}>
      {logos[name]}
    </div>
  );
};

const PressLogo = ({ name }: { name: string }) => {
  const logos: Record<string, JSX.Element> = {
    Forbes: (
      <svg viewBox="0 0 100 24" className="h-4 w-auto">
        <text x="0" y="18" className="fill-current font-serif font-bold italic text-[20px]">Forbes</text>
      </svg>
    ),
    TechCrunch: (
      <svg viewBox="0 0 130 24" className="h-4 w-auto">
        <text x="0" y="18" className="fill-current font-bold text-[18px]" style={{ fontFamily: 'system-ui' }}>TechCrunch</text>
      </svg>
    ),
    FastCompany: (
      <svg viewBox="0 0 140 24" className="h-4 w-auto">
        <text x="0" y="18" className="fill-current font-bold text-[18px]" style={{ fontFamily: 'system-ui' }}>Fast Company</text>
      </svg>
    ),
  };
  
  return (
    <div className="text-zinc-500 hover:text-zinc-300 transition-colors" title={name}>
      {logos[name]}
    </div>
  );
};

const companyNames = ["Meta", "LinkedIn", "Lyft", "Google", "Bain"];
const pressNames = ["Forbes", "TechCrunch", "FastCompany"];

const achievements = [
  "Started first business at 16, scaled to 23 countries",
  "Helped 100+ people break into tech (100% free)",
  "Launched companies for founders from Microsoft, PayPal, Snap",
  "Built multiple 7-figure agencies",
];

export function FounderSection() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Subtle background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-primary/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
          {/* Left Column - Image & Logos */}
          <div className="lg:col-span-2 flex flex-col items-center">
            {/* Headshot - Smaller size */}
            <div className="relative mb-8">
              <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden border-2 border-slate-600/50 shadow-2xl shadow-blue-900/20">
                <img
                  src={malikHeadshot}
                  alt="Malik Mbaye - Founder"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              {/* Decorative glow that matches the blue jacket */}
              <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/20 to-slate-700/20 rounded-3xl blur-2xl -z-10" />
            </div>

            {/* Social Links */}
            <div className="flex gap-3 mb-6">
              <a
                href="https://www.linkedin.com/in/malikmbaye"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-slate-700/50 border border-slate-600/50 text-slate-300 hover:text-white hover:bg-blue-600/50 hover:border-blue-500/50 transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/malikmbaye"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-slate-700/50 border border-slate-600/50 text-slate-300 hover:text-white hover:bg-pink-600/50 hover:border-pink-500/50 transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>

            {/* Company Logos */}
            <p className="text-xs text-slate-400 mb-3 font-medium tracking-widest uppercase">
              Previously at
            </p>
            <div className="flex flex-wrap justify-center items-center gap-5">
              {companyNames.map((name) => (
                <CompanyLogo key={name} name={name} />
              ))}
            </div>

            {/* Press Logos */}
            <p className="text-xs text-slate-400 mt-6 mb-3 font-medium tracking-widest uppercase">
              Featured in
            </p>
            <div className="flex flex-wrap justify-center items-center gap-6">
              {pressNames.map((name) => (
                <PressLogo key={name} name={name} />
              ))}
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-3">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Built by a Proposal Writer Who's Closed{" "}
              <span className="text-gradient">$10M+ in Deals</span>
            </h2>
            
            <p className="text-lg text-slate-300 italic mb-6">
              Not another generic AI tool. This system was built from 8 years of real client work.
            </p>

            <div className="space-y-4 text-slate-300 mb-6">
              <p>
                I'm <strong className="text-white">Malik Mbaye</strong>. I started my first business at 16 and scaled it to 23 countries. Since then, I've spent nearly a decade writing proposals that actually close—for startups, agencies, and consultants.
              </p>
              
              <p>
                I was a Product Marketing Manager at <strong className="text-white">Meta</strong>, launching features to 800M+ users. I've worked at LinkedIn, Lyft, and Upwork. I've helped startups raise $50M+ from Google Ventures, SoftBank, and Techstars—and raised money myself from Twitter and Google.
              </p>
              
              <p>
                Through my consultancy <strong className="text-white">Black Lotus</strong>, I've personally written 50+ proposals generating over $10M in client revenue. The RipRight proposal? That client scaled from $15K/month to $350K/month. The MOGL proposal? They won SXSW and raised $2.6M.
              </p>
              
              <p className="text-white font-medium border-l-2 border-primary pl-4 bg-slate-800/50 py-3 pr-4 rounded-r-lg">
                This tool isn't built on theory. It's built on the exact system I use to close deals—now available to you.
              </p>
            </div>

            {/* Achievement badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 text-sm text-slate-300"
                >
                  <span className="text-primary mt-0.5">✓</span>
                  <span>{achievement}</span>
                </div>
              ))}
            </div>

            {/* Extra credentials */}
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="px-3 py-1.5 bg-slate-700/60 border border-slate-600/50 rounded-full text-sm text-slate-300">
                Howard University alum
              </span>
              <span className="px-3 py-1.5 bg-slate-700/60 border border-slate-600/50 rounded-full text-sm text-slate-300">
                100+ career placements at McKinsey, Goldman, Deloitte
              </span>
            </div>

            {/* CTA Button */}
            <Button
              variant="outline"
              className="group border-slate-500 text-slate-200 hover:border-primary hover:bg-primary/10"
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
