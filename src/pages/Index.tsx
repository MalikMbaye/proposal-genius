import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { FeatureCard } from "@/components/FeatureCard";
import { Logo } from "@/components/Logo";
import {
  FileText,
  Presentation,
  FileCheck,
  Mail,
  Receipt,
  Send,
  Sparkles,
  Clock,
  Shield,
  ArrowRight,
  Clipboard,
  Settings,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Full Proposal",
    description: "Comprehensive document with executive summary, scope, timeline, and pricing.",
  },
  {
    icon: Presentation,
    title: "Presentation Deck",
    description: "GenSpark-ready prompt to generate beautiful slides instantly.",
  },
  {
    icon: FileCheck,
    title: "Contract Template",
    description: "Professional agreement with scope, terms, and risk mitigation.",
  },
  {
    icon: Mail,
    title: "Proposal Email",
    description: "Complete email ready to send with your proposal attached.",
  },
  {
    icon: Send,
    title: "Contract Message",
    description: "Professional email to accompany your contract delivery.",
  },
  {
    icon: Receipt,
    title: "Invoice Description",
    description: "Ready-to-use line items for your accounting system.",
  },
];

const steps = [
  {
    icon: Clipboard,
    title: "Paste Your Context",
    description: "Drop in meeting notes, call transcripts, or describe the project opportunity.",
  },
  {
    icon: Settings,
    title: "Select Your Options",
    description: "Choose case studies, proposal length, and set your pricing ranges.",
  },
  {
    icon: Zap,
    title: "Generate & Send",
    description: "Get all 6 deliverables instantly. Copy, customize, and close the deal.",
  },
];

const stats = [
  { value: "$1M+", label: "Contracts Won" },
  { value: "50+", label: "Proven Proposals" },
  { value: "8+", label: "Years Experience" },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient" />
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center animate-fade-in">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
              <Sparkles className="h-4 w-4" />
              Built on a $1M+ winning methodology
            </div>
            
            <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Generate 7-Figure
              <br />
              <span className="text-gradient">Proposals in Seconds</span>
            </h1>
            
            <p className="mb-10 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
              AI-powered proposal packages for consultants and agencies.
              Get a complete proposal, contract, deck prompt, emails, and invoice.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/generate">
                  Start Generating
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="#how-it-works">
                  See How It Works
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 flex flex-wrap justify-center gap-8 md:gap-16">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-primary">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold md:text-4xl">
              What You Get
            </h2>
            <p className="mt-4 text-muted-foreground">
              One input. Six professional deliverables. Everything you need to close the deal.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 border-t border-border/50 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold md:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-muted-foreground">
              Three simple steps to your complete proposal package.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.title} className="relative text-center">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="absolute -top-2 -left-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {index + 1}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="relative mx-auto max-w-3xl rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-8 md:p-12 text-center overflow-hidden">
            <div className="absolute inset-0 glow-primary opacity-20" />
            <div className="relative">
              <h2 className="text-3xl font-bold md:text-4xl mb-4">
                Ready to Close More Deals?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Stop spending hours on proposals. Generate complete packages in seconds
                and focus on what matters - growing your business.
              </p>
              <Button variant="hero" size="xl" asChild>
                <Link to="/generate">
                  Start Generating Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Logo />
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="#" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link to="#" className="hover:text-foreground transition-colors">Terms</Link>
              <Link to="#" className="hover:text-foreground transition-colors">Contact</Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 ProposalAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
