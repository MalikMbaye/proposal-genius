import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Calendar, ArrowRight, Sparkles, BookOpen, MessageSquare } from "lucide-react";
import { Logo } from "@/components/Logo";
import { DeckRevealConfetti } from "@/components/DeckRevealConfetti";

const productContent = {
  lifetime: {
    title: "Welcome to the Inner Circle! 🎉",
    subtitle: "Your lifetime access is confirmed. You now have unlimited proposals, decks, and all future features forever.",
    features: [
      "Unlimited AI proposals & slide decks forever",
      "DM Sales Assistant with unlimited analyses",
      "Proposal Library with 50+ winning templates (coming soon)",
      "All future features at no extra cost",
      "Priority support directly from Malik"
    ]
  },
  pro_library: {
    title: "Welcome to the Proposal Library! 📚",
    subtitle: "Your access is confirmed. You now have full access to 50+ proven proposal templates and the complete methodology.",
    features: [
      "50+ winning proposal templates",
      "Industry-specific examples across tech, consulting, creative & more",
      "Detailed breakdown methodology videos",
      "New proposals added monthly",
      "Priority support directly from Malik"
    ]
  }
};

export default function LifetimeSuccess() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [searchParams] = useSearchParams();
  const product = searchParams.get('product') as keyof typeof productContent || 'lifetime';
  
  const content = productContent[product] || productContent.lifetime;

  useEffect(() => {
    // Trigger confetti on mount
    const timer = setTimeout(() => {
      setShowConfetti(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <DeckRevealConfetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      <div className="min-h-screen bg-background">
        <div className="absolute inset-0 bg-radial-gradient" />
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />

        <div className="relative">
          {/* Header */}
          <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-4">
              <Link to="/">
                <Logo />
              </Link>
            </div>
          </header>

          <main className="container mx-auto px-4 py-12 md:py-20">
            <div className="max-w-2xl mx-auto text-center">
              {/* Success Icon */}
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/20 mb-6">
                <CheckCircle className="h-10 w-10 text-success" />
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {content.title}
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8">
                {content.subtitle}
              </p>

              {/* What's Included */}
              <Card className="mb-8 text-left">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    What You Get
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {content.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Onboarding CTA - Main Action */}
              <Card className="mb-8 border-primary/50 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Next Step: Book Your Onboarding Call
                  </CardTitle>
                  <CardDescription className="text-base">
                    Schedule a 1-on-1 call with Malik to get set up, ask questions, and maximize your results.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <a
                    href="https://calendly.com/malikxmbaye/consultation"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="lg" className="w-full md:w-auto group">
                      Book Your Onboarding Call
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </a>
                  <p className="text-sm text-muted-foreground mt-3">
                    This is your personal strategy session — come with questions!
                  </p>
                </CardContent>
              </Card>

              {/* Secondary Actions */}
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <Card>
                  <CardContent className="pt-6">
                    <BookOpen className="h-8 w-8 text-primary mb-3 mx-auto" />
                    <h3 className="font-semibold mb-2">Explore the Help Center</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Learn the methodology and master every tool.
                    </p>
                    <Link to="/help">
                      <Button variant="outline" size="sm" className="w-full">
                        View Help Center
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <MessageSquare className="h-8 w-8 text-primary mb-3 mx-auto" />
                    <h3 className="font-semibold mb-2">Get Updates</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Be first to know about new features and tips.
                    </p>
                    <a
                      href="https://malikmbaye.substack.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm" className="w-full">
                        Subscribe to Updates
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              </div>

              {/* Go to Dashboard */}
              <Link to="/dashboard">
                <Button variant="ghost" size="lg">
                  Skip to Dashboard →
                </Button>
              </Link>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
