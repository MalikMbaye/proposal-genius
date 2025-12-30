import { useState, useCallback, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Trophy } from "lucide-react";
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
  { src: thread1, alt: "Thread 1/18 - Intro: What's the difference between $10K and $100K projects" },
  { src: thread2, alt: "Thread 2/18 - First project $250, scaling journey" },
  { src: thread3, alt: "Thread 3/18 - $3K fintech project at Meta" },
  { src: thread4, alt: "Thread 4/18 - $300K WordPress site wasn't more complex" },
  { src: thread5, alt: "Thread 5/18 - Three factors: client, process, risk" },
  { src: thread6, alt: "Thread 6/18 - Who is the client: risk tolerance" },
  { src: thread7, alt: "Thread 7/18 - Certainty and minimizing brand risk" },
  { src: thread8, alt: "Thread 8/18 - The process behind the work" },
  { src: thread9, alt: "Thread 9/18 - Process > product at large companies" },
  { src: thread10, alt: "Thread 10/18 - Reputation and credibility" },
  { src: thread11, alt: "Thread 11/18 - Big resume opens doors to $100K+ projects" },
  { src: thread12, alt: "Thread 12/18 - A-list teams and elite credentials" },
  { src: thread13, alt: "Thread 13/18 - Scaling from $250 to $250K+" },
  { src: thread14, alt: "Thread 14/18 - Path to six-figure contracts" },
  { src: thread15, alt: "Thread 15/18 - Scalable systems are the future" },
  { src: thread16, alt: "Thread 16/18 - The leap from $10K to $100K" },
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
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: "center",
    skipSnaps: false
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
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
    'hsl(48, 100%, 50%)',  // Bright gold
    'hsl(45, 90%, 60%)',   // Light gold
    'hsl(38, 80%, 45%)',   // Deep gold
    'hsl(30, 70%, 50%)',   // Bronze
    'hsl(0, 0%, 100%)',    // White sparkle
  ];

  const confettiParticles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    delay: Math.random() * 0.8,
    left: Math.random() * 100,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
  }));

  return (
    <section ref={sectionRef} className="relative pt-28 pb-12 overflow-hidden">
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

      {/* 3D Trophy ambient motif - blended into background */}
      <div className="absolute right-[-5%] top-[5%] opacity-[0.25] pointer-events-none blur-[2px]">
        <img 
          src={trophy3D} 
          alt=""
          className="w-72 h-72 md:w-96 md:h-96 object-contain"
          style={{ filter: 'saturate(1.2) brightness(0.8)' }}
        />
      </div>
      
      {/* Secondary 3D trophy accent bottom-left */}
      <div className="absolute left-[-3%] bottom-[10%] opacity-[0.15] pointer-events-none rotate-[-15deg] blur-[1px]">
        <img 
          src={trophy3D} 
          alt=""
          className="w-40 h-40 md:w-52 md:h-52 object-contain"
          style={{ filter: 'saturate(1.1) brightness(0.7)' }}
        />
      </div>

      {/* Gold particle dust overlay */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, hsl(45, 100%, 50%) 1px, transparent 1px),
                           radial-gradient(circle at 80% 70%, hsl(45, 100%, 50%) 1px, transparent 1px),
                           radial-gradient(circle at 40% 80%, hsl(45, 100%, 50%) 0.5px, transparent 0.5px),
                           radial-gradient(circle at 60% 20%, hsl(45, 100%, 50%) 0.5px, transparent 0.5px)`,
          backgroundSize: '100px 100px, 150px 150px, 80px 80px, 120px 120px',
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
      
      <div className="container relative z-10 mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left: Thread Screenshot Carousel */}
          <div className="space-y-4">
            <div className="relative group">
              {/* Intense gold glow behind carousel */}
              <div 
                className="absolute -inset-4 rounded-2xl opacity-60 blur-3xl"
                style={{ 
                  background: 'linear-gradient(135deg, hsl(45, 100%, 45%) 0%, hsl(35, 90%, 30%) 100%)',
                }}
              />
              
              {/* Navigation Arrows - positioned outside the carousel */}
              <button
                onClick={scrollPrev}
                className="absolute -left-14 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                style={{
                  background: 'linear-gradient(135deg, hsl(45, 80%, 25%) 0%, hsl(35, 70%, 20%) 100%)',
                  border: '1px solid hsl(45, 60%, 40%)',
                  boxShadow: '0 4px 15px -3px hsl(45, 100%, 30%)'
                }}
                aria-label="Previous thread"
              >
                <ChevronLeft className="w-5 h-5" style={{ color: 'hsl(45, 100%, 65%)' }} />
              </button>
              
              <button
                onClick={scrollNext}
                className="absolute -right-14 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                style={{
                  background: 'linear-gradient(135deg, hsl(45, 80%, 25%) 0%, hsl(35, 70%, 20%) 100%)',
                  border: '1px solid hsl(45, 60%, 40%)',
                  boxShadow: '0 4px 15px -3px hsl(45, 100%, 30%)'
                }}
                aria-label="Next thread"
              >
                <ChevronRight className="w-5 h-5" style={{ color: 'hsl(45, 100%, 65%)' }} />
              </button>
              
              {/* Carousel - images directly displayed */}
              <div ref={emblaRef} className="overflow-hidden relative rounded-xl">
                <div className="flex items-center">
                  {threads.map((thread, index) => (
                    <div key={index} className="flex-[0_0_100%] min-w-0 flex items-center justify-center">
                      <a 
                        href="https://www.threads.com/@malick.io/post/DEwQ0atOqQO?xmt=AQGzXlX8yUYcbOJixlBXYuoC7XOxHNASHjsQkmXIAKNYog"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <img 
                          src={thread.src} 
                          alt={thread.alt}
                          className="w-full h-auto rounded-xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.01]"
                          style={{
                            boxShadow: '0 25px 60px -12px rgba(0,0,0,0.7), 0 0 40px -10px hsl(45, 100%, 40%)'
                          }}
                        />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Thumbnail previews */}
            <div className="flex gap-2 justify-center">
              {threads.slice(0, 5).map((thread, index) => (
              <button
                  key={index}
                  onClick={() => emblaApi?.scrollTo(index)}
                  className={`relative rounded-md overflow-hidden transition-all duration-300 w-[50px] h-[62px] ${
                    index === selectedIndex 
                      ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-transparent scale-105' 
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <img 
                    src={thread.src}
                    alt={`Thread ${index + 1}`}
                    className="w-full h-full object-cover object-top rounded-md"
                  />
                </button>
              ))}
              {threads.length > 5 && (
                <div 
                  className="flex items-center justify-center rounded-md"
                  style={{
                    width: '50px',
                    height: '62px',
                    background: 'linear-gradient(135deg, hsl(45, 50%, 15%) 0%, hsl(35, 40%, 10%) 100%)',
                    border: '1px solid hsl(45, 40%, 25%)',
                  }}
                >
                  <span style={{ color: 'hsl(45, 100%, 60%)' }} className="text-sm font-bold">
                    +{threads.length - 5}
                  </span>
                </div>
              )}
            </div>

            {/* Dots & counter */}
            <div className="flex items-center justify-center gap-3">
              <div className="flex gap-1">
                {threads.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => emblaApi?.scrollTo(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === selectedIndex ? 'w-5' : 'w-1.5'
                    }`}
                    style={{
                      background: index === selectedIndex 
                        ? 'linear-gradient(90deg, hsl(45, 100%, 50%), hsl(38, 100%, 45%))' 
                        : 'hsl(45, 20%, 25%)'
                    }}
                    aria-label={`Go to thread ${index + 1}`}
                  />
                ))}
              </div>
              <span 
                className="text-xs font-bold tracking-wide"
                style={{ color: 'hsl(45, 100%, 55%)' }}
              >
                {selectedIndex + 1}/{threads.length}
              </span>
            </div>
          </div>
          
          {/* Right: Content */}
          <div className="text-center lg:text-left space-y-6">
            {/* Trophy badge */}
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                background: 'linear-gradient(135deg, hsl(45, 70%, 20%) 0%, hsl(35, 60%, 15%) 100%)',
                border: '1px solid hsl(45, 60%, 35%)',
                boxShadow: '0 0 20px -5px hsl(45, 100%, 40%)'
              }}
            >
              <Trophy className="w-5 h-5" style={{ color: 'hsl(45, 100%, 55%)' }} />
              <span className="text-sm font-semibold" style={{ color: 'hsl(45, 100%, 60%)' }}>
                Viral Milestone
              </span>
            </div>
            
            <h2 
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              style={{ 
                background: 'linear-gradient(135deg, hsl(45, 100%, 60%) 0%, hsl(38, 100%, 50%) 50%, hsl(45, 100%, 55%) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              The Thread That<br />Started It All
            </h2>
            
            <div className="space-y-1">
              <p 
                className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight"
                style={{ 
                  background: 'linear-gradient(180deg, hsl(0, 0%, 100%) 0%, hsl(45, 30%, 85%) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '0 0 60px hsl(45, 100%, 50%)'
                }}
              >
                35,700+
              </p>
              <p 
                className="text-3xl md:text-4xl font-bold uppercase tracking-widest"
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
            
            <div className="pt-4 space-y-4">
              <p 
                className="text-xl font-medium"
                style={{ color: 'hsl(45, 30%, 70%)' }}
              >
                Built by Mālik Mbaye
              </p>
              
              {/* Social Icons - gold themed */}
              <div className="flex items-center justify-center lg:justify-start gap-6">
                {/* X (Twitter) */}
                <a 
                  href="https://x.com/malickio" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="transition-all duration-300 hover:scale-110"
                  style={{ color: 'hsl(45, 60%, 50%)' }}
                  aria-label="Follow on X"
                >
                  <svg className="w-8 h-8 hover:drop-shadow-[0_0_8px_hsl(45,100%,50%)]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                
                {/* Instagram */}
                <a 
                  href="https://www.instagram.com/malick.io/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-all duration-300 hover:scale-110"
                  style={{ color: 'hsl(45, 60%, 50%)' }}
                  aria-label="Follow on Instagram"
                >
                  <svg className="w-9 h-9 hover:drop-shadow-[0_0_8px_hsl(45,100%,50%)]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                
                {/* LinkedIn */}
                <a 
                  href="https://www.linkedin.com/in/letshiremalik/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="transition-all duration-300 hover:scale-110"
                  style={{ color: 'hsl(45, 60%, 50%)' }}
                  aria-label="Connect on LinkedIn"
                >
                  <svg className="w-9 h-9 hover:drop-shadow-[0_0_8px_hsl(45,100%,50%)]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                
                {/* Upwork */}
                <a 
                  href="#" 
                  className="transition-all duration-300 hover:scale-110"
                  style={{ color: 'hsl(45, 60%, 50%)' }}
                  aria-label="Hire on Upwork"
                >
                  <svg className="w-9 h-9 hover:drop-shadow-[0_0_8px_hsl(45,100%,50%)]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.548-1.405-.002-2.543-1.143-2.545-2.548V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Confetti animation keyframes */}
      <style>{`
        @keyframes confetti-fall {
          0% {
            opacity: 1;
            transform: translateY(0) rotate(0deg) scale(1);
          }
          25% {
            opacity: 1;
            transform: translateY(25vh) rotate(180deg) scale(0.9);
          }
          50% {
            opacity: 0.8;
            transform: translateY(50vh) rotate(360deg) scale(0.8);
          }
          75% {
            opacity: 0.5;
            transform: translateY(75vh) rotate(540deg) scale(0.6);
          }
          100% {
            opacity: 0;
            transform: translateY(100vh) rotate(720deg) scale(0.4);
          }
        }
      `}</style>
    </section>
  );
}
