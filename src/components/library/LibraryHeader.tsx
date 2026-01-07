import { DollarSign, FileText, Building2, BarChart3, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

const stats = [
  { label: "Deal Value", value: "$1.5M+", icon: DollarSign },
  { label: "Proposals", value: "50+", icon: FileText },
  { label: "Industries", value: "12", icon: Building2 },
  { label: "Deal Range", value: "$2K-$200K", icon: BarChart3 },
  { label: "Win Rate", value: "85%+", icon: CheckCircle },
];

export function LibraryHeader() {
  return (
    <div className="mb-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          The Proposal Library
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          50+ real proposals from $1.5M+ in closed deals. Learn from winning strategies across every industry.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Card 
            key={stat.label} 
            className="p-4 text-center bg-card/50 border-border/50 hover:border-primary/30 transition-colors"
          >
            <stat.icon className="h-5 w-5 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
