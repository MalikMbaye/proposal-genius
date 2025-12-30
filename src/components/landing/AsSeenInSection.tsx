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

function LogoRow({ className = "" }: { className?: string }) {
  const repeated = [...logos, ...logos];

  return (
    <div className={`group relative overflow-hidden ${className}`} aria-label="As seen in logos">
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 md:w-16 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 md:w-16 bg-gradient-to-l from-background to-transparent" />

      <div className="flex w-[200%] animate-scroll-left items-center gap-10 md:gap-14 py-3 will-change-transform group-hover:[animation-play-state:paused]">
        {repeated.map((logo, idx) => (
          <img
            key={`${logo.alt}-${idx}`}
            src={logo.src}
            alt={logo.alt}
            loading={idx < logos.length ? "eager" : "lazy"}
            className={`${logo.className} w-auto object-contain`}
          />
        ))}
      </div>
    </div>
  );
}

export function AsSeenInMarquee({ label = true }: { label?: boolean }) {
  return (
    <div className="mt-5">
      {label && (
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">
          As seen in
        </p>
      )}
      <LogoRow />
    </div>
  );
}

// Kept for non-hero placements (optional)
export function AsSeenInSection() {
  return (
    <section className="py-10 md:py-14 bg-background">
      <div className="container mx-auto px-4">
        <AsSeenInMarquee />
      </div>
    </section>
  );
}
