import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

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

const galleryItems = [
  {
    src: facebooklifeFeature,
    alt: "Featured on Facebook Life for Black History Month",
    caption: "Featured on @facebooklife",
  },
  {
    src: hackerWay,
    alt: "At Facebook HQ - 1 Hacker Way",
    caption: "1 Hacker Way, Menlo Park",
  },
  {
    src: oprahCampaign,
    alt: "Marketing campaign with Oprah that reached millions",
    caption: "Campaign with Oprah",
  },
  {
    src: techcrunch1,
    alt: "Featured in TechCrunch article",
    caption: "TechCrunch Feature",
  },
  {
    src: techcrunch2,
    alt: "AR Filter featured in TechCrunch",
    caption: "AR Filter Launch",
  },
  {
    src: teamMeeting,
    alt: "Team meeting at Meta",
    caption: "Team Collaboration",
  },
  {
    src: blackAtEvent,
    alt: "Black@ Facebook event",
    caption: "Black@ Bay Area",
  },
  {
    src: workSession,
    alt: "Working session at Meta",
    caption: "Product Sessions",
  },
  {
    src: instagramHq,
    alt: "Hosting students at Instagram HQ",
    caption: "Instagram HQ Tour",
  },
];

export function MetaGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % galleryItems.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const nextLightbox = () => {
    setLightboxIndex((prev) => (prev + 1) % galleryItems.length);
  };

  const prevLightbox = () => {
    setLightboxIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
  };

  return (
    <>
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
                onClick={() => openLightbox((activeIndex - 1 + galleryItems.length) % galleryItems.length)}
              />
            </div>

            {/* Active item (center, larger) */}
            <div className="w-80 h-80 flex-shrink-0 transition-all duration-300">
              <GalleryItem
                item={galleryItems[activeIndex]}
                isActive={true}
                onClick={() => openLightbox(activeIndex)}
              />
            </div>

            {/* Next item (faded) */}
            <div className="w-48 h-48 flex-shrink-0 opacity-40 scale-90 transition-all duration-300">
              <GalleryItem
                item={galleryItems[(activeIndex + 1) % galleryItems.length]}
                isActive={false}
                onClick={() => openLightbox((activeIndex + 1) % galleryItems.length)}
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
              <GalleryItem
                item={galleryItems[activeIndex]}
                isActive={true}
                onClick={() => openLightbox(activeIndex)}
              />
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

      {/* Lightbox Modal */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-black/95 overflow-hidden">
          <div className="relative w-full h-full flex items-center justify-center min-h-[50vh]">
            {/* Close button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Navigation arrows */}
            <button
              onClick={prevLightbox}
              className="absolute left-4 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={nextLightbox}
              className="absolute right-4 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Image */}
            <img
              src={galleryItems[lightboxIndex].src}
              alt={galleryItems[lightboxIndex].alt}
              className="max-w-full max-h-[85vh] object-contain"
            />

            {/* Caption */}
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <p className="text-white/80 text-sm">
                {galleryItems[lightboxIndex].caption}
              </p>
              <p className="text-white/50 text-xs mt-1">
                {lightboxIndex + 1} / {galleryItems.length}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function GalleryItem({
  item,
  isActive,
  onClick,
}: {
  item: (typeof galleryItems)[0];
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full h-full rounded-xl overflow-hidden border bg-black/20 transition-all duration-300 flex items-center justify-center cursor-pointer hover:scale-105 ${
        isActive
          ? "border-primary/30 shadow-lg shadow-primary/10"
          : "border-border/30"
      }`}
    >
      <img
        src={item.src}
        alt={item.alt}
        className="max-w-full max-h-full object-contain"
        loading="lazy"
      />
    </button>
  );
}
