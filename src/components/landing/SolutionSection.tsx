import { 
  FileText, 
  Presentation, 
  FileCheck, 
  Mail, 
  Send, 
  Receipt,
  GraduationCap,
  Check,
  Users
} from "lucide-react";

const mainFeatures = [
  "Executive Summary",
  "Problem Assessment",
  "Strategic Approach",
  "Execution Plan (phases)",
  "Investment & Pricing (multiple scenarios)",
  "Why Us (credentials)",
  "Risk Mitigation",
  "Next Steps",
];

const secondaryDeliverables = [
  {
    icon: Presentation,
    title: "Presentation Deck",
    description: "GenSpark-ready prompt",
    detail: "Beautiful slides instantly",
  },
  {
    icon: FileCheck,
    title: "Contract Template",
    description: "Professional agreement",
    detail: "Scope, terms, risk mitigation",
  },
  {
    icon: Mail,
    title: "Proposal Email",
    description: "Complete email ready to send",
    detail: "Proposal attached",
  },
  {
    icon: Send,
    title: "Contract Message",
    description: "Professional delivery email",
    detail: "Contract accompaniment",
  },
  {
    icon: Receipt,
    title: "Invoice Description",
    description: "Ready-to-use line items",
    detail: "Accounting system ready",
  },
  {
    icon: Users,
    title: "Community Access",
    description: "Get async proposal reviews",
    detail: "Expert feedback on your work",
  },
];

export function SolutionSection() {
  return (
    <section id="solution" className="py-24 border-t border-border/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            One Input. <span className="text-gradient">Six Professional Deliverables.</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to close the deal.
          </p>
        </div>
        
        {/* Asymmetric Grid */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Large Featured Card - Full Proposal */}
          <div className="relative group lg:row-span-2">
            <div className="absolute -inset-px bg-gradient-to-br from-primary/50 to-accent-secondary/30 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity" />
            <div className="relative h-full bg-card border border-primary/30 rounded-2xl p-8 flex flex-col">
              {/* Icon and title */}
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <FileText className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">Full Proposal</h3>
                  <p className="text-muted-foreground">15-20 page comprehensive document</p>
                </div>
              </div>
              
              {/* Features list */}
              <div className="flex-1">
                <div className="grid gap-3">
                  {mainFeatures.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Sample link */}
              <div className="mt-8 pt-6 border-t border-border/30">
                <a 
                  href="#" 
                  className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  View sample proposal →
                </a>
              </div>
            </div>
          </div>
          
          {/* Right Side - 2x3 Grid of smaller cards */}
          <div className="grid grid-cols-2 gap-4">
            {secondaryDeliverables.map((item) => (
              <div 
                key={item.title}
                className="group bg-card/50 border border-border/50 rounded-xl p-5 hover:border-primary/30 hover:bg-card transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <h4 className="font-semibold mb-1 text-sm">{item.title}</h4>
                <p className="text-xs text-muted-foreground mb-1">{item.description}</p>
                <p className="text-xs text-primary/70">→ {item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
