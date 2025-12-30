import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import viralThread from "@/assets/viral-thread.png";
import thread1 from "@/assets/threads/thread-1.png";
import thread2 from "@/assets/threads/thread-2.png";
import thread3 from "@/assets/threads/thread-3.png";
import thread4 from "@/assets/threads/thread-4.png";
import thread5 from "@/assets/threads/thread-5.png";
import thread6 from "@/assets/threads/thread-6.png";
import thread7 from "@/assets/threads/thread-7.png";
import thread8 from "@/assets/threads/thread-8.png";

const threads = [
  { src: viralThread, alt: "Viral thread intro - What's the difference between $10K and $100K" },
  { src: thread1, alt: "Thread 1/18 - A friend texted about the difference between $10K and $100K projects" },
  { src: thread2, alt: "Thread 2-3/18 - First project $250, then scaled to $3K" },
  { src: thread3, alt: "Thread 4-5/18 - $300K WordPress site comparison" },
  { src: thread4, alt: "Thread 6-7/18 - Who is the client and risk factors" },
  { src: thread5, alt: "Thread 8-9/18 - The process behind the work" },
  { src: thread6, alt: "Thread 10-11/18 - Risk and reputation" },
  { src: thread7, alt: "Thread 12-13/18 - A-list teams and scaling" },
  { src: thread8, alt: "Thread 14-16/18 - Path to six-figure contracts" },
];

export function ViralThreadSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: "center",
    skipSnaps: false
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Warm gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, hsl(30, 20%, 12%) 0%, hsl(35, 25%, 18%) 50%, hsl(25, 15%, 10%) 100%)'
        }}
      />
      
      {/* Subtle radial glow */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, hsl(35, 60%, 25%) 0%, transparent 60%)'
        }}
      />
      
      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            style={{ color: 'hsl(40, 70%, 55%)' }}
          >
            The Thread That Started It All
          </h2>
          
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <p 
                className="text-5xl md:text-6xl lg:text-7xl font-bold"
                style={{ color: 'hsl(35, 20%, 85%)' }}
              >
                35,700+
              </p>
              <p 
                className="text-2xl md:text-3xl font-semibold"
                style={{ color: 'hsl(30, 70%, 50%)' }}
              >
                Views
              </p>
            </div>
          </div>
          
          <p 
            className="text-xl font-medium"
            style={{ color: 'hsl(35, 30%, 70%)' }}
          >
            Built by Mālik Mbaye
          </p>
        </div>

        {/* Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Arrows */}
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-16 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
            }}
            aria-label="Previous thread"
          >
            <ChevronLeft className="w-6 h-6" style={{ color: 'hsl(40, 70%, 60%)' }} />
          </button>
          
          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-16 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
            }}
            aria-label="Next thread"
          >
            <ChevronRight className="w-6 h-6" style={{ color: 'hsl(40, 70%, 60%)' }} />
          </button>

          {/* Carousel Container */}
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex">
              {threads.map((thread, index) => (
                <div 
                  key={index} 
                  className="flex-[0_0_100%] min-w-0 px-4"
                >
                  <div className="relative group">
                    {/* Animated glow behind */}
                    <div 
                      className="absolute -inset-4 rounded-3xl opacity-60 blur-2xl animate-pulse"
                      style={{ 
                        background: 'linear-gradient(135deg, hsl(35, 60%, 40%) 0%, hsl(25, 50%, 30%) 100%)',
                        animationDuration: '3s'
                      }}
                    />
                    
                    {/* Glassmorphic container */}
                    <div 
                      className="relative rounded-2xl overflow-hidden"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1)'
                      }}
                    >
                      {/* Shimmer effect overlay */}
                      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                        <div 
                          className="absolute -inset-full animate-[shimmer_3s_ease-in-out_infinite]"
                          style={{
                            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
                            transform: 'translateX(-100%) rotate(12deg)'
                          }}
                        />
                      </div>
                      
                      {/* Top reflection line */}
                      <div 
                        className="absolute top-0 left-0 right-0 h-px z-10"
                        style={{
                          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)'
                        }}
                      />
                      
                      {/* Uniform aspect ratio container */}
                      <a 
                        href="https://www.threads.com/@malick.io/post/DEwQ0atOqQO?xmt=AQGzXlX8yUYcbOJixlBXYuoC7XOxHNASHjsQkmXIAKNYog"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <div 
                          className="relative w-full flex items-center justify-center p-4"
                          style={{ aspectRatio: '4/5' }}
                        >
                          <img 
                            src={thread.src} 
                            alt={thread.alt}
                            className="max-w-full max-h-full w-auto h-auto object-contain relative z-0 transition-transform duration-500 group-hover:scale-[1.02]"
                          />
                        </div>
                      </a>
                    </div>
                    
                    {/* Corner accent glow */}
                    <div 
                      className="absolute -top-2 -right-2 w-24 h-24 rounded-full blur-2xl opacity-40"
                      style={{ background: 'hsl(40, 70%, 50%)' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {threads.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === selectedIndex ? 'w-8' : ''
                }`}
                style={{
                  background: index === selectedIndex 
                    ? 'hsl(40, 70%, 55%)' 
                    : 'rgba(255,255,255,0.3)'
                }}
                aria-label={`Go to thread ${index + 1}`}
              />
            ))}
          </div>

          {/* Slide counter */}
          <p 
            className="text-center mt-4 font-medium"
            style={{ color: 'hsl(35, 30%, 60%)' }}
          >
            {selectedIndex + 1} / {threads.length}
          </p>
        </div>

        {/* Social Icons */}
        <div className="flex items-center justify-center gap-6 mt-10">
          {/* X (Twitter) */}
          <a 
            href="https://x.com/malickio" 
            target="_blank" 
            rel="noopener noreferrer"
            className="transition-all duration-300 hover:scale-110 hover:opacity-80"
            aria-label="Follow on X"
          >
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="hsl(35, 15%, 60%)">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          
          {/* Instagram */}
          <a 
            href="https://www.instagram.com/malick.io/" 
            target="_blank"
            rel="noopener noreferrer"
            className="transition-all duration-300 hover:scale-110 hover:opacity-80"
            aria-label="Follow on Instagram"
          >
            <svg className="w-9 h-9" viewBox="0 0 24 24" fill="hsl(35, 15%, 60%)">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          
          {/* LinkedIn */}
          <a 
            href="https://www.linkedin.com/in/letshiremalik/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="transition-all duration-300 hover:scale-110 hover:opacity-80"
            aria-label="Connect on LinkedIn"
          >
            <svg className="w-9 h-9" viewBox="0 0 24 24" fill="hsl(35, 15%, 60%)">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
          
          {/* Upwork */}
          <a 
            href="#" 
            className="transition-all duration-300 hover:scale-110 hover:opacity-80"
            aria-label="Hire on Upwork"
          >
            <svg className="w-9 h-9" viewBox="0 0 24 24" fill="hsl(35, 15%, 60%)">
              <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.548-1.405-.002-2.543-1.143-2.545-2.548V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z"/>
            </svg>
          </a>
        </div>
      </div>
      
      {/* Shimmer keyframes */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) rotate(12deg); }
          100% { transform: translateX(200%) rotate(12deg); }
        }
      `}</style>
    </section>
  );
}
