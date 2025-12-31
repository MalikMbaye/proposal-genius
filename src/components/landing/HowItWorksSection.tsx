import { Folder, Settings, Zap } from "lucide-react";

const steps = [
  {
    icon: Folder,
    number: "01",
    title: "Paste Your Context",
    description: "Drop in meeting notes, call transcripts, or describe the project opportunity.",
    visual: (
      <div className="bg-secondary/50 rounded-lg p-4 border border-border/50 mt-4">
        <div className="space-y-2">
          <div className="h-2 w-3/4 bg-muted rounded animate-pulse" />
          <div className="h-2 w-full bg-muted rounded animate-pulse" style={{ animationDelay: '0.1s' }} />
          <div className="h-2 w-5/6 bg-muted rounded animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="h-2 w-2/3 bg-muted rounded animate-pulse" style={{ animationDelay: '0.3s' }} />
        </div>
      </div>
    ),
  },
  {
    icon: Settings,
    number: "02",
    title: "Select Your Options",
    description: "Choose case studies, proposal length, pricing ranges, and customization preferences.",
    visual: (
      <div className="bg-secondary/50 rounded-lg p-4 border border-border/50 mt-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Proposal Length</span>
          <div className="flex gap-2">
            <div className="px-2 py-1 text-xs bg-primary/20 text-primary rounded">Standard</div>
            <div className="px-2 py-1 text-xs bg-muted rounded text-muted-foreground">Detailed</div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Case Studies</span>
          <div className="flex gap-1">
            <div className="w-6 h-6 rounded bg-primary/20 border border-primary/30" />
            <div className="w-6 h-6 rounded bg-primary/20 border border-primary/30" />
            <div className="w-6 h-6 rounded bg-muted border border-border" />
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: Zap,
    number: "03",
    title: "Generate & Send",
    description: "Get all 6 deliverables instantly. Copy, customize, and close the deal.",
    visual: (
      <div className="flex gap-2 mt-4 flex-wrap">
        {['Proposal', 'Contract', 'Deck', 'Email'].map((item, i) => (
          <div 
            key={item}
            className="px-3 py-2 text-xs bg-success/20 text-success rounded-lg border border-success/30 animate-fade-in"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            ✓ {item}
          </div>
        ))}
      </div>
    ),
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 border-t border-border/20 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-slate-900 dark:text-foreground">
            From Meeting Notes to Signed Contract
          </h2>
          <p className="text-xl text-slate-600 dark:text-muted-foreground">
            in Under <span className="text-primary font-semibold">5 Minutes</span>
          </p>
        </div>
        
        {/* Steps Timeline */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden md:block absolute top-20 left-[16.67%] right-[16.67%] h-0.5 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
            
            {steps.map((step, index) => (
              <div key={step.title} className="relative">
                {/* Step card */}
                <div className="bg-white dark:bg-card border border-slate-200 dark:border-border/50 rounded-2xl p-6 hover:border-primary/30 transition-colors h-full shadow-sm">
                  {/* Number badge */}
                  <div className="absolute -top-4 left-6 px-3 py-1 bg-primary text-primary-foreground text-sm font-bold rounded-full">
                    {step.number}
                  </div>
                  
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 mt-2">
                    <step.icon className="h-7 w-7 text-primary" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-foreground">{step.title}</h3>
                  <p className="text-slate-600 dark:text-muted-foreground text-sm">{step.description}</p>
                  
                  {/* Visual representation */}
                  {step.visual}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
