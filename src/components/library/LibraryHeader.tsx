import { Clock, BookOpen, Play, FileText, Trophy } from "lucide-react";
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
        <Badge 
          variant="outline" 
          className="mb-4 gap-1.5 px-3 py-1 text-sm font-medium bg-white text-slate-700 border-slate-200"
        >
          <FileText className="h-3.5 w-3.5" />
          Library
        </Badge>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          The Proposal Library
        </h1>
        <p className="text-slate-600 text-lg">
          Master the art of proposals with 50+ real examples from $1.5M+ in closed deals
        </p>
      </div>

      {/* Progress Card */}
      <div className="p-5 rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center">
            <Trophy className="h-6 w-6 text-slate-500" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-semibold text-slate-900">Your Progress</h3>
                <p className="text-sm text-slate-500">
                  {viewedCount} of {totalProposals} proposals reviewed
                </p>
              </div>
              <span className="text-2xl font-bold text-slate-900">{progressPercentage}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div 
            key={stat.label} 
            className="p-4 text-center rounded-xl border border-slate-200 bg-white"
          >
            <stat.icon className="h-5 w-5 mx-auto mb-2 text-slate-500" />
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-sm text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
