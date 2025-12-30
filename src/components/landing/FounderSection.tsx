import { ExternalLink, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompanyLogo } from "./CompanyLogo";
import malikHeadshot from "@/assets/malik-headshot.jpeg";

const companies = ["Meta", "LinkedIn", "Lyft", "Google", "Bain & Company", "Morgan Stanley"];

const stats = [
  { value: "$50M+", label: "Raised" },
  { value: "$10M+", label: "Revenue" },
  { value: "100+", label: "Coached" },
];

export function FounderSection() {
  return (
    <section id="founder" className="py-20 md:py-28 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Subtle background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-primary/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
          {/* Left Column - Image */}
          <div className="lg:col-span-2 flex flex-col items-center lg:items-start">
            {/* Headshot Card */}
            <div className="relative w-full max-w-sm">
              <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden border border-slate-600/30 shadow-2xl shadow-blue-900/20 bg-gradient-to-br from-slate-700/20 to-slate-800/20 p-1">
                <img
                  src={malikHeadshot}
                  alt="Malik Mbaye - Founder"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/20 to-slate-700/20 rounded-3xl blur-2xl -z-10" />
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-3">
            {/* Name and Title */}
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
              MĀLIK MBAYE
            </h2>
            <p className="text-lg md:text-xl text-slate-400 mb-6">
              Ex-Meta | AI Growth Operator | Startup Advisor
            </p>

            {/* Stat Cards */}
            <div className="flex flex-wrap gap-3 mb-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="flex-1 min-w-[100px] max-w-[140px] px-5 py-4 rounded-xl border border-slate-600/40 bg-slate-800/40 backdrop-blur-sm text-center"
                >
                  <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Main copy */}
            <div className="space-y-4 text-slate-300 mb-8">
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

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 mb-10">
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

        {/* Full-width Company Logos Row */}
        <div className="mt-12 pt-10 border-t border-slate-700/50">
          <p className="text-[10px] text-slate-500 mb-5 font-medium tracking-[0.2em] uppercase text-center">
            Experience At
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4">
            {companies.map((name) => (
              <CompanyLogo key={name} name={name} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
