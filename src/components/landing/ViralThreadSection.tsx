import { useState, useEffect, useRef } from "react";
import { Trophy, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import trophy3D from "@/assets/trophy-3d.png";

import thread1 from "@/assets/threads/thread-1.png";
import thread2 from "@/assets/threads/thread-2.png";
import thread3 from "@/assets/threads/thread-3.png";
import thread4 from "@/assets/threads/thread-4.png";
import thread5 from "@/assets/threads/thread-5.png";
import thread6 from "@/assets/threads/thread-6.png";
import thread7 from "@/assets/threads/thread-7.png";
import thread8 from "@/assets/threads/thread-8.png";
import thread9 from "@/assets/threads/thread-9.png";
import thread10 from "@/assets/threads/thread-10.png";
import thread11 from "@/assets/threads/thread-11.png";
import thread12 from "@/assets/threads/thread-12.png";
import thread13 from "@/assets/threads/thread-13.png";
import thread14 from "@/assets/threads/thread-14.png";
import thread15 from "@/assets/threads/thread-15.png";
import thread16 from "@/assets/threads/thread-16.png";

const threads = [
  { src: thread1, alt: "Thread 1/16 - Intro" },
  { src: thread2, alt: "Thread 2/16" },
  { src: thread3, alt: "Thread 3/16" },
  { src: thread4, alt: "Thread 4/16" },
  { src: thread5, alt: "Thread 5/16" },
  { src: thread6, alt: "Thread 6/16" },
  { src: thread7, alt: "Thread 7/16" },
  { src: thread8, alt: "Thread 8/16" },
  { src: thread9, alt: "Thread 9/16" },
  { src: thread10, alt: "Thread 10/16" },
  { src: thread11, alt: "Thread 11/16" },
  { src: thread12, alt: "Thread 12/16" },
  { src: thread13, alt: "Thread 13/16" },
  { src: thread14, alt: "Thread 14/16" },
  { src: thread15, alt: "Thread 15/16" },
  { src: thread16, alt: "Thread 16/16" },
];

// Confetti particle component
function ConfettiParticle({ delay, left, color }: { delay: number; left: number; color: string }) {
  return (
    <div
      className="absolute w-2 h-2 rounded-sm opacity-0"
      style={{
        left: `${left}%`,
        top: '-10px',
        background: color,
        animation: `confetti-fall 3s ease-out ${delay}s forwards`,
      }}
    />
  );
}

export function ViralThreadSection() {
  const [showConfetti, setShowConfetti] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  // Trigger confetti on scroll into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !showConfetti) {
            setShowConfetti(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [showConfetti]);

  // Generate confetti particles
  const confettiColors = [
    'hsl(48, 100%, 50%)',
    'hsl(45, 90%, 60%)',
    'hsl(38, 80%, 45%)',
    'hsl(30, 70%, 50%)',
    'hsl(0, 0%, 100%)',
  ];

  const confettiParticles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    delay: Math.random() * 0.8,
    left: Math.random() * 100,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
  }));

  return (
    <section ref={sectionRef} className="relative py-24 overflow-hidden">
      {/* Deep luxe near-black background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, hsl(0, 0%, 3%) 0%, hsl(30, 15%, 6%) 50%, hsl(0, 0%, 4%) 100%)'
        }}
      />
      
      {/* Dramatic gold spotlight from top-right */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 80% 20%, hsl(45, 100%, 40%) 0%, transparent 60%)'
        }}
      />
      
      {/* Secondary warm glow from bottom-left */}
      <div 
        className="absolute inset-0 opacity-25"
        style={{
          background: 'radial-gradient(ellipse 50% 40% at 20% 80%, hsl(35, 80%, 35%) 0%, transparent 55%)'
        }}
      />

      {/* 3D Trophy ambient motif */}
      <div className="absolute right-[-5%] top-[5%] opacity-[0.2] pointer-events-none blur-[2px]">
        <img 
          src={trophy3D} 
          alt=""
          className="w-48 h-48 md:w-64 md:h-64 object-contain"
          style={{ filter: 'saturate(1.2) brightness(0.8)' }}
        />
      </div>

      {/* Gold particle dust overlay */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, hsl(45, 100%, 50%) 1px, transparent 1px),
                           radial-gradient(circle at 80% 70%, hsl(45, 100%, 50%) 1px, transparent 1px)`,
          backgroundSize: '100px 100px, 150px 150px',
        }}
      />

      {/* Confetti animation */}
      {showConfetti && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
          {confettiParticles.map((particle) => (
            <ConfettiParticle
              key={particle.id}
              delay={particle.delay}
              left={particle.left}
              color={particle.color}
            />
          ))}
        </div>
      )}
      
      {/* Single Column Centered Content */}
      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center space-y-4 mb-10">
          {/* Trophy badge */}
          <div className="flex justify-center">
            <div 
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                background: 'linear-gradient(135deg, hsl(45, 70%, 20%) 0%, hsl(35, 60%, 15%) 100%)',
                border: '1px solid hsl(45, 60%, 35%)',
                boxShadow: '0 0 20px -5px hsl(45, 100%, 40%)'
              }}
            >
              <Trophy className="w-4 h-4" style={{ color: 'hsl(45, 100%, 55%)' }} />
              <span className="text-xs font-semibold" style={{ color: 'hsl(45, 100%, 60%)' }}>
                Viral Milestone
              </span>
            </div>
          </div>
          
          <h2 
            className="text-2xl md:text-3xl font-bold leading-tight"
            style={{ 
              background: 'linear-gradient(135deg, hsl(45, 100%, 60%) 0%, hsl(38, 100%, 50%) 50%, hsl(45, 100%, 55%) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            The Thread That Started It All
          </h2>
          
          <div className="flex items-center justify-center gap-3">
            <p 
              className="text-3xl md:text-4xl font-black tracking-tight"
              style={{ 
                background: 'linear-gradient(180deg, hsl(0, 0%, 100%) 0%, hsl(45, 30%, 85%) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              35,700+
            </p>
            <p 
              className="text-lg md:text-xl font-bold uppercase tracking-widest"
              style={{ 
                background: 'linear-gradient(90deg, hsl(45, 100%, 50%), hsl(38, 100%, 45%))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Views
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-4 pt-2">
            <p 
              className="text-sm font-medium"
              style={{ color: 'hsl(45, 30%, 70%)' }}
            >
              by Mālik Mbaye
            </p>
            
            {/* Social Icons - compact */}
            <div className="flex items-center gap-3">
              <a 
                href="https://x.com/malickio" 
                target="_blank" 
                rel="noopener noreferrer"
                className="transition-all duration-300 hover:scale-110"
                style={{ color: 'hsl(45, 60%, 50%)' }}
                aria-label="Follow on X"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              
              <a 
                href="https://www.threads.com/@malick.io" 
                target="_blank"
                rel="noopener noreferrer"
                className="transition-all duration-300 hover:scale-110"
                style={{ color: 'hsl(45, 60%, 50%)' }}
                aria-label="Follow on Threads"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.912 3.589 12c.027 3.086.718 5.494 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.182.408-2.256 1.33-3.022.88-.73 2.082-1.167 3.476-1.263 1.02-.07 2.045-.032 3.063.088l.031.004v-.001c-.003-.851-.088-1.56-.255-2.103-.223-.72-.59-1.243-1.133-1.606-.594-.397-1.395-.61-2.318-.617h-.026c-.9.006-1.728.196-2.392.547l-.928-1.788c.932-.492 2.07-.764 3.296-.772h.033c1.327.012 2.463.32 3.38.915.87.564 1.5 1.36 1.872 2.365.339.918.506 2.023.512 3.364v.067c0 .11-.002.218-.003.327-.014 1.13-.056 2.162-.78 3.196-.82 1.173-2.188 1.94-4.088 2.29-.39.072-.797.108-1.206.108-.193 0-.386-.007-.58-.02-1.25-.082-2.318-.425-3.085-.994-.847-.628-1.264-1.462-1.212-2.42.054-1.006.543-1.832 1.378-2.324.748-.44 1.72-.654 2.803-.617 1.017.035 2.086.217 3.172.543l.078.023c.107-.408.161-.86.161-1.347 0-.115-.003-.227-.01-.334-.818-.125-1.632-.19-2.439-.19-1.72 0-3.127.372-4.065 1.076-1.053.79-1.61 1.964-1.566 3.304.05 1.477.71 2.726 1.862 3.521.982.676 2.26 1.007 3.796.984 1.843-.04 3.304-.613 4.344-1.704.886-.93 1.413-2.172 1.579-3.73.798.442 1.45 1.035 1.932 1.76.72 1.086 1.004 2.446.823 3.937-.18 1.502-.882 2.846-2.025 3.894-1.555 1.427-3.676 2.18-6.319 2.242h-.07z"/>
                </svg>
              </a>
              
              <a 
                href="https://www.linkedin.com/in/letshiremalik/" 
                target="_blank"
                rel="noopener noreferrer"
                className="transition-all duration-300 hover:scale-110"
                style={{ color: 'hsl(45, 60%, 50%)' }}
                aria-label="Connect on LinkedIn"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Scrolling Thread Gallery with Connecting Line */}
      <div className="relative">
        {/* Scrollable container */}
        <div className="relative">
          {/* Navigation Arrow - Left */}
          <button
            onClick={scrollLeft}
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 rounded-full transition-all duration-300 hover:scale-110"
            style={{
              background: 'linear-gradient(135deg, hsl(45, 70%, 25%) 0%, hsl(35, 60%, 18%) 100%)',
              border: '1px solid hsl(45, 60%, 40%)',
              boxShadow: '0 4px 20px -5px hsl(45, 100%, 30%)'
            }}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" style={{ color: 'hsl(45, 100%, 60%)' }} />
          </button>

          {/* Navigation Arrow - Right */}
          <button
            onClick={scrollRight}
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 rounded-full transition-all duration-300 hover:scale-110"
            style={{
              background: 'linear-gradient(135deg, hsl(45, 70%, 25%) 0%, hsl(35, 60%, 18%) 100%)',
              border: '1px solid hsl(45, 60%, 40%)',
              boxShadow: '0 4px 20px -5px hsl(45, 100%, 30%)'
            }}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" style={{ color: 'hsl(45, 100%, 60%)' }} />
          </button>

          {/* Gradient fade on left edge */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-12 md:w-24 z-10 pointer-events-none"
            style={{
              background: 'linear-gradient(to right, hsl(0, 0%, 3%) 0%, transparent 100%)'
            }}
          />
          
          {/* Gradient fade on right edge */}
          <div 
            className="absolute right-0 top-0 bottom-0 w-12 md:w-24 z-10 pointer-events-none"
            style={{
              background: 'linear-gradient(to left, hsl(0, 0%, 3%) 0%, transparent 100%)'
            }}
          />
          
          {/* Scrollable container */}
          <div 
            ref={scrollContainerRef}
            className="flex items-center gap-0 overflow-x-auto px-16 md:px-24 scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              scrollSnapType: 'x mandatory',
            }}
          >
          {threads.map((thread, index) => (
            <div 
              key={index}
              className="flex items-center flex-shrink-0"
              style={{ scrollSnapAlign: 'center' }}
            >
              {/* Thread image - no hyperlink */}
              <div className="group flex-shrink-0">
                <div className="relative">
                  {/* Gold glow behind image on hover */}
                  <div 
                    className="absolute -inset-2 rounded-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300 blur-xl"
                    style={{ 
                      background: 'linear-gradient(135deg, hsl(45, 100%, 45%) 0%, hsl(35, 90%, 30%) 100%)',
                    }}
                  />
                  
                  <img 
                    src={thread.src} 
                    alt={thread.alt}
                    className="relative w-64 md:w-80 lg:w-96 h-auto rounded-xl shadow-xl transition-all duration-300 group-hover:scale-[1.02]"
                    style={{
                      boxShadow: '0 15px 40px -10px rgba(0,0,0,0.6), 0 0 20px -5px hsl(45, 100%, 30%)'
                    }}
                    draggable={false}
                  />
                </div>
              </div>
              
              {/* Connecting arrow between images (not after last) */}
              {index < threads.length - 1 && (
                <div className="flex items-center px-2 md:px-3 flex-shrink-0">
                  <div 
                    className="w-8 md:w-12 h-0.5 rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, hsl(45, 100%, 50%), hsl(45, 80%, 40%))'
                    }}
                  />
                  <div 
                    className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px]"
                    style={{
                      borderLeftColor: 'hsl(45, 80%, 40%)'
                    }}
                  />
                </div>
              )}
            </div>
          ))}
          </div>
        </div>
        
        {/* CTA Button */}
        <div className="flex justify-center mt-6">
          <Button
            asChild
            className="group px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, hsl(45, 100%, 50%) 0%, hsl(38, 90%, 45%) 100%)',
              color: 'hsl(0, 0%, 5%)',
              boxShadow: '0 8px 30px -5px hsl(45, 100%, 40%)'
            }}
          >
            <a 
              href="https://www.threads.com/@malick.io/post/DEwQ0atOqQO?xmt=AQF0LqK3RbasrYMcGWadZVP8beQBTP4y44FkxpUAfAtNJg"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View on Threads
            </a>
          </Button>
        </div>
      </div>

      {/* Confetti keyframes */}
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
