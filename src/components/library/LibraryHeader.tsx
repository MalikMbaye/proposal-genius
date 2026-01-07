import { Clock, BookOpen, Play, FileText, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface LibraryHeaderProps {
  totalProposals: number;
  viewedCount: number;
}

const stats = [
  { label: "Deal Value", value: "$1.5M+", icon: Clock },
  { label: "Modules", value: "6", icon: BookOpen },
  { label: "Proposals", value: "50+", icon: Play },
  { label: "Templates", value: "50+", icon: FileText },
];

export function LibraryHeader({ totalProposals, viewedCount }: LibraryHeaderProps) {
  const progressPercentage = totalProposals > 0 
    ? Math.round((viewedCount / totalProposals) * 100) 
    : 0;

  return (
    <div className="mb-8 space-y-6">
      {/* Badge + Title */}
      <div>
        <Badge variant="outline" className="mb-4 gap-1.5 px-3 py-1 text-sm font-medium border-border bg-background">
          <FileText className="h-3.5 w-3.5" />
          Library
        </Badge>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          The Proposal Library
        </h1>
        <p className="text-muted-foreground text-lg">
          50+ real proposals from $1.5M+ in closed deals
        </p>
      </div>

      {/* Progress Card */}
      <Card className="p-5 border-border bg-card">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
            <Trophy className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-semibold text-foreground">Your Progress</h3>
                <p className="text-sm text-muted-foreground">
                  {viewedCount} of {totalProposals} proposals reviewed
                </p>
              </div>
              <span className="text-2xl font-bold text-foreground">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card 
            key={stat.label} 
            className="p-4 text-center border-border bg-card"
          >
            <stat.icon className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
