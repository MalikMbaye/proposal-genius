import viralThread from "@/assets/viral-thread.png";

export function ViralThreadSection() {
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
          background: 'radial-gradient(ellipse at 70% 50%, hsl(35, 60%, 25%) 0%, transparent 60%)'
        }}
      />
      
      <div className="container relative z-10 mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Thread Screenshot */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <img 
                src={viralThread} 
                alt="Viral Twitter thread by Malik about the difference between $10K and $100K contracts"
                className="w-full h-auto"
              />
            </div>
            {/* Subtle glow behind the card */}
            <div 
              className="absolute -inset-4 -z-10 opacity-30 blur-3xl"
              style={{ background: 'hsl(35, 50%, 30%)' }}
            />
          </div>
          
          {/* Right: Content */}
          <div className="text-center lg:text-left space-y-6">
            <h2 
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              style={{ color: 'hsl(40, 70%, 55%)' }}
            >
              The Thread That<br />Started It All
            </h2>
            
            <div className="space-y-1">
              <p 
                className="text-6xl md:text-7xl lg:text-8xl font-bold"
                style={{ color: 'hsl(35, 20%, 85%)' }}
              >
                35,700+
              </p>
              <p 
                className="text-3xl md:text-4xl font-semibold"
                style={{ color: 'hsl(30, 70%, 50%)' }}
              >
                Views
              </p>
            </div>
            
            <div className="pt-4 space-y-4">
              <p 
                className="text-xl font-medium"
                style={{ color: 'hsl(35, 30%, 70%)' }}
              >
                Built by Mālik Mbaye
              </p>
              
              {/* Social Icons */}
              <div className="flex items-center justify-center lg:justify-start gap-6">
                {/* X (Twitter) */}
                <a 
                  href="https://x.com/malickio" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-110"
                >
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="hsl(35, 15%, 60%)">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                
                {/* Meta */}
                <a 
                  href="#" 
                  className="transition-transform hover:scale-110"
                >
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="hsl(35, 15%, 60%)">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                </a>
                
                {/* LinkedIn */}
                <a 
                  href="https://www.linkedin.com/in/malikmbaye/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-110"
                >
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl font-bold"
                    style={{ 
                      backgroundColor: 'hsl(35, 15%, 60%)',
                      color: 'hsl(30, 20%, 12%)'
                    }}
                  >
                    in
                  </div>
                </a>
                
                {/* Upwork */}
                <a 
                  href="#" 
                  className="transition-transform hover:scale-110"
                >
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
                    style={{ 
                      backgroundColor: 'hsl(35, 15%, 60%)',
                      color: 'hsl(30, 20%, 12%)'
                    }}
                  >
                    up
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
