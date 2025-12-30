import espnLogo from "@/assets/logos/press/espn.png";
import fastCompanyLogo from "@/assets/logos/press/fast-company.png";
import gmaLogo from "@/assets/logos/press/gma.png";
import revoltLogo from "@/assets/logos/press/revolt.png";
import nbcNewsLogo from "@/assets/logos/press/nbc-news.png";
import yahooLogo from "@/assets/logos/press/yahoo.png";
import viceLogo from "@/assets/logos/press/vice.png";
import betLogo from "@/assets/logos/press/bet.svg";
import cnbcLogo from "@/assets/logos/press/cnbc.png";

const logos = [
  { src: nbcNewsLogo, alt: "NBC News", className: "h-6 md:h-8" },
  { src: cnbcLogo, alt: "CNBC", className: "h-6 md:h-8" },
  { src: yahooLogo, alt: "Yahoo", className: "h-6 md:h-8" },
  { src: fastCompanyLogo, alt: "Fast Company", className: "h-5 md:h-7" },
  { src: espnLogo, alt: "ESPN", className: "h-5 md:h-7" },
  { src: gmaLogo, alt: "Good Morning America", className: "h-8 md:h-10" },
  { src: viceLogo, alt: "Vice", className: "h-5 md:h-7" },
  { src: revoltLogo, alt: "Revolt", className: "h-5 md:h-6" },
  { src: betLogo, alt: "BET", className: "h-5 md:h-6" },
];

export function AsSeenInSection() {
  return (
    <section className="py-8 md:py-12 bg-background border-t border-border/20">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-muted-foreground mb-6 uppercase tracking-widest">
          As Seen In
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
          {logos.map((logo) => (
            <img
              key={logo.alt}
              src={logo.src}
              alt={logo.alt}
              className={`${logo.className} w-auto object-contain opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
