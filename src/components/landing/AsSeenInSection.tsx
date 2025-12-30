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
  { src: nbcNewsLogo, alt: "NBC News" },
  { src: cnbcLogo, alt: "CNBC" },
  { src: yahooLogo, alt: "Yahoo" },
  { src: fastCompanyLogo, alt: "Fast Company" },
  { src: espnLogo, alt: "ESPN" },
  { src: gmaLogo, alt: "Good Morning America" },
  { src: viceLogo, alt: "Vice" },
  { src: revoltLogo, alt: "Revolt" },
  { src: betLogo, alt: "BET" },
];

export function AsSeenInMarquee() {
  const repeated = [...logos, ...logos];

  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-white py-4 mt-6">
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-24 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-24 bg-gradient-to-l from-white to-transparent z-10" />

      <div className="flex w-[200%] animate-scroll-left items-center gap-12 md:gap-16 will-change-transform">
        {repeated.map((logo, idx) => (
          <img
            key={`${logo.alt}-${idx}`}
            src={logo.src}
            alt={logo.alt}
            loading={idx < logos.length ? "eager" : "lazy"}
            className="h-6 md:h-8 w-auto object-contain flex-shrink-0"
          />
        ))}
      </div>
    </div>
  );
}

// Standalone section version
export function AsSeenInSection() {
  return (
    <section className="py-10 md:py-14 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3 text-center">
          As seen in
        </p>
      </div>
      <AsSeenInMarquee />
    </section>
  );
}
