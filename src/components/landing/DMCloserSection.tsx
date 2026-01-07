import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  MessageSquare, 
  Target, 
  Shield, 
  Zap, 
  ArrowRight,
  Check,
  Sparkles,
  Chrome
} from "lucide-react";

export function DMCloserSection() {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const features = [
    {
      icon: Zap,
      title: "Instant Lead Scoring",
      description: "Drop a screenshot, get a score. Know instantly if they're cold, warm, or ready to buy—so you never waste time on tire-kickers."
    },
    {
      icon: Target,
      title: "AI Response Coaching",
      description: "Get 3 tailored responses for every message: qualify their budget, build value, or go for the close. Pick the one that fits."
    },
    {
      icon: Shield,
      title: "100% Privacy-First",
      description: "Works entirely from screenshots. No login sharing, no API access, no risk to your accounts. Your DMs stay yours."
    }
  ];

  const responseTypes = [
    "\"What timeline are you working with?\" — Qualify the opportunity",
    "\"Here's how we've solved this before...\" — Build credibility", 
    "\"Let's jump on a quick call this week\" — Go for the close"
  ];

  return (
    <section className="py-24 border-t border-border/50 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
            <Chrome className="h-4 w-4" />
            NEW: DM Sales Assistant
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Stop Wasting Proposals on <span className="text-gradient">Unqualified Leads</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            Know exactly what to say—before you ever send a proposal. 
            AI that scores your leads, suggests the perfect response, and tells you when they're ready to close.
          </p>
          
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            The same qualification framework behind $1.5M in closed deals—now analyzing your DMs in real-time from a simple screenshot.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto mb-16">
          
          {/* Left: Feature Cards */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <Card 
                key={feature.title}
                className="p-6 border-border/50 bg-card/50 hover:bg-card/80 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Right: Mockup/Demo */}
          <div 
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="bg-card border border-border rounded-2xl p-6 shadow-2xl shadow-primary/5">
              {/* Browser Chrome Header */}
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 bg-muted/50 rounded-md text-xs text-muted-foreground flex items-center gap-2">
                    <MessageSquare className="h-3 w-3" />
                    DM Closer AI
                  </div>
                </div>
              </div>

              {/* Conversation Preview */}
              <div className="space-y-4 mb-6">
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="text-xs text-muted-foreground mb-1">Prospect says:</div>
                  <p className="text-sm">"Yeah we've been looking for help with our brand strategy but not sure if it's the right time..."</p>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <div className="px-2 py-1 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-md text-xs font-medium">
                    WARM LEAD
                  </div>
                  <div className="px-2 py-1 bg-primary/20 text-primary rounded-md text-xs font-medium">
                    Budget Signal Detected
                  </div>
                </div>
              </div>

              {/* Response Options */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Sparkles className="h-4 w-4 text-primary" />
                  AI Response Options
                </div>
                
                {responseTypes.map((response, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg border transition-all duration-300 ${
                      isHovered && index === 0 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border/50 bg-muted/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium ${
                        isHovered && index === 0 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="text-sm">{response}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Typing indicator */}
              {isHovered && (
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground animate-pulse">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  Generating perfect response...
                </div>
              )}
            </div>

            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-full text-sm font-bold shadow-lg">
              Works on Instagram, LinkedIn, Twitter
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4">
            <Button 
              size="lg" 
              variant="hero"
              className="group text-lg px-8"
              onClick={() => navigate('/generate')}
            >
              Try It Free
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-4 flex items-center justify-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            Included with your PitchGenius account
          </p>
        </div>
      </div>
    </section>
  );
}
