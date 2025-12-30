import { ExternalLink, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import malikHeadshot from "@/assets/malik-headshot.jpeg";

const companyNames = ["Facebook", "LinkedIn", "Lyft", "Google", "Bain & Company"];
const pressNames = ["Forbes", "TechCrunch", "Fast Company"];

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
            {/* Headshot */}
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
            <div className="flex flex-wrap justify-center items-center gap-4">
              {companyNames.map((name) => (
                <span 
                  key={name} 
                  className="text-slate-400 hover:text-slate-200 transition-colors font-semibold text-sm tracking-wide"
                >
                  {name}
                </span>
              ))}
            </div>

            {/* Press Logos */}
            <p className="text-xs text-slate-400 mt-6 mb-3 font-medium tracking-widest uppercase">
              Featured in
            </p>
            <div className="flex flex-wrap justify-center items-center gap-5">
              {pressNames.map((name) => (
                <span 
                  key={name} 
                  className="text-slate-500 hover:text-slate-300 transition-colors font-semibold text-sm"
                >
                  {name}
                </span>
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
                I was a Product Marketing Manager at <strong className="text-white">Facebook</strong>, launching features to 800M+ users. I've worked at LinkedIn, Lyft, and Upwork. I've helped startups raise $50M+ from Google Ventures, SoftBank, and Techstars—and raised money myself from Twitter and Google.
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
