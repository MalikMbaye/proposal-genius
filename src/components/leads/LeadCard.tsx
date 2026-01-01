import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export interface Lead {
  id: string;
  name: string;
  status: string;
  qualification_score: number | null;
  current_stage: string | null;
  last_activity: string;
  platform: string;
  goals: string | null;
  pain_points: string[] | null;
  budget_range: string | null;
  timeline: string | null;
  proposal_id: string | null;
  created_at: string;
}

interface LeadCardProps {
  lead: Lead;
  onClick: () => void;
}

const statusConfig: Record<string, { emoji: string; label: string; bgClass: string; textClass: string }> = {
  cold: { emoji: '❄️', label: 'Cold', bgClass: 'bg-blue-500/10', textClass: 'text-blue-400' },
  warm: { emoji: '🟡', label: 'Warm', bgClass: 'bg-yellow-500/10', textClass: 'text-yellow-400' },
  hot: { emoji: '🔥', label: 'Hot', bgClass: 'bg-orange-500/10', textClass: 'text-orange-400' },
  qualified: { emoji: '✅', label: 'Qualified', bgClass: 'bg-green-500/10', textClass: 'text-green-400' },
  proposal_sent: { emoji: '📝', label: 'Proposal Sent', bgClass: 'bg-purple-500/10', textClass: 'text-purple-400' },
  closed: { emoji: '🎉', label: 'Closed', bgClass: 'bg-green-500/10', textClass: 'text-green-400' },
  lost: { emoji: '❌', label: 'Lost', bgClass: 'bg-muted', textClass: 'text-muted-foreground' },
};

export function LeadCard({ lead, onClick }: LeadCardProps) {
  const config = statusConfig[lead.status] || statusConfig.cold;
  const timeAgo = formatDistanceToNow(new Date(lead.last_activity), { addSuffix: true });

  return (
    <div
      onClick={onClick}
      className="p-4 bg-card rounded-xl border border-border cursor-pointer
                 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold truncate text-foreground group-hover:text-primary transition-colors">
          {lead.name}
        </h3>
        <span className="text-xl flex-shrink-0">{config.emoji}</span>
      </div>
      
      <span className={cn(
        'inline-block px-2 py-0.5 rounded-full text-xs font-medium',
        config.bgClass,
        config.textClass
      )}>
        {config.label}
      </span>
      
      <div className="mt-3 space-y-1 text-xs text-muted-foreground">
        <p className="font-medium">{lead.current_stage || 'Opening'}</p>
        <p>{timeAgo}</p>
        {lead.qualification_score && (
          <div className="flex items-center gap-1 mt-2">
            <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full transition-all",
                  lead.qualification_score >= 7 ? 'bg-green-500' :
                  lead.qualification_score >= 4 ? 'bg-yellow-500' : 'bg-blue-500'
                )}
                style={{ width: `${lead.qualification_score * 10}%` }}
              />
            </div>
            <span className="text-[10px] font-mono">{lead.qualification_score}/10</span>
          </div>
        )}
      </div>
    </div>
  );
}
