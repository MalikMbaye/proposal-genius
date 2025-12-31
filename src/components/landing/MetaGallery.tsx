import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Import all gallery images
import facebooklifeFeature from "@/assets/meta-gallery/facebooklife-feature.jpeg";
import hackerWay from "@/assets/meta-gallery/hacker-way.png";
import oprahCampaign from "@/assets/meta-gallery/oprah-campaign.png";
import techcrunch1 from "@/assets/meta-gallery/techcrunch-1.png";
import techcrunch2 from "@/assets/meta-gallery/techcrunch-2.png";
import teamMeeting from "@/assets/meta-gallery/team-meeting.png";
import blackAtEvent from "@/assets/meta-gallery/black-at-event.png";
import workSession from "@/assets/meta-gallery/work-session.png";
import instagramHq from "@/assets/meta-gallery/instagram-hq.png";
import facebookVideo from "@/assets/meta-gallery/facebook-video.mp4";

const galleryItems = [
  {
    type: "image" as const,
    src: facebooklifeFeature,
    alt: "Featured on Facebook Life for Black History Month",
    caption: "Featured on @facebooklife",
  },
  {
    type: "image" as const,
    src: hackerWay,
    alt: "At Facebook HQ - 1 Hacker Way",
    caption: "1 Hacker Way, Menlo Park",
  },
  {
    type: "image" as const,
    src: oprahCampaign,
    alt: "Marketing campaign with Oprah that reached millions",
    caption: "Campaign with Oprah",
  },
  {
    type: "video" as const,
    src: facebookVideo,
    alt: "Facebook graduation campaign video",
    caption: "Class of 2020 Campaign",
  },
  {
    type: "image" as const,
    src: techcrunch1,
    alt: "Featured in TechCrunch article",
    caption: "TechCrunch Feature",
  },
  {
    type: "image" as const,
    src: techcrunch2,
    alt: "AR Filter featured in TechCrunch",
    caption: "AR Filter Launch",
  },
  {
    type: "image" as const,
    src: teamMeeting,
    alt: "Team meeting at Meta",
    caption: "Team Collaboration",
  },
  {
    type: "image" as const,
    src: blackAtEvent,
    alt: "Black@ Facebook event",
    caption: "Black@ Bay Area",
  },
  {
    type: "image" as const,
    src: workSession,
    alt: "Working session at Meta",
    caption: "Product Sessions",
  },
  {
    type: "image" as const,
    src: instagramHq,
    alt: "Hosting students at Instagram HQ",
    caption: "Instagram HQ Tour",
  },
];

export function MetaGallery() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % galleryItems.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
  };

  return (
    <div className="mt-16 max-w-5xl mx-auto">
      {/* Section label */}
      <div className="text-center mb-6">
        <span className="text-xs uppercase tracking-widest text-primary/70 font-medium">
          Moments from Meta
        </span>
      </div>

      {/* Main gallery container */}
      <div className="relative">
        {/* Desktop: Show 3 items with center focus */}
        <div className="hidden md:flex items-center justify-center gap-4 px-12">
          {/* Left arrow */}
          <button
            onClick={prevSlide}
            className="absolute left-0 z-10 p-2 rounded-full bg-card/80 border border-border/50 hover:bg-card transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>

          {/* Previous item (faded) */}
          <div className="w-48 h-48 flex-shrink-0 opacity-40 scale-90 transition-all duration-300">
            <GalleryItem
              item={galleryItems[(activeIndex - 1 + galleryItems.length) % galleryItems.length]}
              isActive={false}
            />
          </div>

          {/* Active item (center, larger) */}
          <div className="w-80 h-80 flex-shrink-0 transition-all duration-300">
            <GalleryItem item={galleryItems[activeIndex]} isActive={true} />
          </div>

          {/* Next item (faded) */}
          <div className="w-48 h-48 flex-shrink-0 opacity-40 scale-90 transition-all duration-300">
            <GalleryItem
              item={galleryItems[(activeIndex + 1) % galleryItems.length]}
              isActive={false}
            />
          </div>

          {/* Right arrow */}
          <button
            onClick={nextSlide}
            className="absolute right-0 z-10 p-2 rounded-full bg-card/80 border border-border/50 hover:bg-card transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Mobile: Single item with swipe-like experience */}
        <div className="md:hidden relative px-12">
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-card/80 border border-border/50"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4 text-foreground" />
          </button>

          <div className="w-full aspect-square max-w-72 mx-auto">
            <GalleryItem item={galleryItems[activeIndex]} isActive={true} />
          </div>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-card/80 border border-border/50"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4 text-foreground" />
          </button>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {galleryItems.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === activeIndex
                  ? "bg-primary w-6"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Caption */}
        <p className="text-center text-sm text-muted-foreground mt-4">
          {galleryItems[activeIndex].caption}
        </p>
      </div>
    </div>
  );
}

function GalleryItem({
  item,
  isActive,
}: {
  item: (typeof galleryItems)[0];
  isActive: boolean;
}) {
  return (
    <div
      className={`w-full h-full rounded-xl overflow-hidden border transition-all duration-300 ${
        isActive
          ? "border-primary/30 shadow-lg shadow-primary/10"
          : "border-border/30"
      }`}
    >
      {item.type === "video" ? (
        <video
          src={item.src}
          className="w-full h-full object-cover"
          autoPlay={isActive}
          muted
          loop
          playsInline
        />
      ) : (
        <img
          src={item.src}
          alt={item.alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      )}
    </div>
  );
}
