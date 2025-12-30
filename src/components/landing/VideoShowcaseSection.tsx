import { useEffect, useState, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { loadingVideos } from '@/lib/loadingContent';

export function VideoShowcaseSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-rotate videos
  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % loadingVideos.length);
        setIsTransitioning(false);
      }, 400);
    }, 8000);

    return () => clearInterval(interval);
  }, [isVisible]);

  const currentVideo = loadingVideos[currentIndex];
  const currentHeadline = currentVideo.headlines[0];

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container relative mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary mb-4">
            While You Wait
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our AI Army Works{' '}
            <span className="text-gradient">Overtime</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            When you generate a proposal, this is what happens behind the scenes.
            Quality takes time—but not much of yours.
          </p>
        </div>

        {/* Main Video Display */}
        <div className="max-w-4xl mx-auto">
          <div className={`relative transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent-secondary/10 to-primary/20 rounded-3xl blur-2xl opacity-50" />
            
            {/* Video Container */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50 aspect-video bg-card">
              {isVisible && (
                <video
                  key={currentVideo.videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className={`w-full h-full object-cover transition-opacity duration-400 ${
                    isTransitioning ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  <source src={currentVideo.videoUrl} type="video/mp4" />
                </video>
              )}
              
              {/* Headline Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent flex flex-col justify-end p-6 md:p-8">
                <p 
                  className={`text-xl md:text-2xl font-bold text-foreground leading-tight max-w-lg transition-all duration-400 ${
                    isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                  }`}
                >
                  "{currentHeadline}"
                </p>
              </div>
            </div>
          </div>

          {/* Video Selector Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {loadingVideos.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsTransitioning(true);
                  setTimeout(() => {
                    setCurrentIndex(index);
                    setIsTransitioning(false);
                  }, 300);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'w-8 bg-primary' 
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-10">
            <Button variant="hero" size="lg" asChild className="group">
              <Link to="/generate">
                Try It Yourself
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
