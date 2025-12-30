import { ExternalLink, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompanyLogo } from "./CompanyLogo";
import malikHeadshot from "@/assets/malik-headshot.jpeg";

const companies = ["Facebook", "LinkedIn", "Lyft", "Google", "Bain & Company"];
const pressOutlets = ["Forbes", "TechCrunch", "Fast Company"];

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
          {/* Left Column - Image & Logo Wall */}
          <div className="lg:col-span-2 flex flex-col">
            {/* Headshot Card */}
            <div className="relative mb-4 w-full">
              <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden border-2 border-slate-600/50 shadow-2xl shadow-blue-900/20">
                <img
                  src={malikHeadshot}
                  alt="Malik Mbaye - Founder"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/20 to-slate-700/20 rounded-3xl blur-2xl -z-10" />
            </div>

            {/* Bento Logo Wall */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {/* Previously At - Large tile */}
              <div className="col-span-2 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
                <p className="text-[10px] text-slate-500 mb-3 font-medium tracking-widest uppercase">
                  Previously at
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  {companies.map((name) => (
                    <CompanyLogo key={name} name={name} />
                  ))}
                </div>
              </div>

              {/* Featured In - Tile */}
              <div className="col-span-2 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
                <p className="text-[10px] text-slate-500 mb-3 font-medium tracking-widest uppercase">
                  Featured in
                </p>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                  {pressOutlets.map((name) => (
                    <CompanyLogo key={name} name={name} />
                  ))}
                </div>
              </div>
            </div>

            {/* Social Links - At Bottom */}
            <div className="flex items-center justify-center gap-3 mt-auto pt-2">
              <a
                href="https://www.linkedin.com/in/malikmbaye"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0A66C2]/20 border border-[#0A66C2]/30 text-[#0A66C2] hover:bg-[#0A66C2]/30 transition-all text-sm font-medium"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://www.instagram.com/malikmbaye"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-400 hover:bg-pink-500/30 transition-all text-sm font-medium"
              >
                <Instagram className="w-4 h-4" />
                <span>Instagram</span>
              </a>
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

            {/* CTA Button */}
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
          </div>
        </div>

      </div>
    </section>
  );
}
