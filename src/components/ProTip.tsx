import { Lightbulb, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export interface ProTipData {
  condition: string;
  title: string;
  body: string;
  learnMoreLink?: string;
}

interface ProTipProps {
  tip: ProTipData;
  className?: string;
}

export function ProTip({ tip, className = "" }: ProTipProps) {
  return (
    <div className={`bg-amber-50 border border-amber-200 rounded-xl p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
          <Lightbulb className="w-4 h-4 text-amber-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-amber-900 text-sm">{tip.title}</h4>
          <p className="text-amber-800 text-sm mt-1 leading-relaxed">{tip.body}</p>
          {tip.learnMoreLink && (
            <Link 
              to={tip.learnMoreLink}
              className="inline-flex items-center gap-1 text-amber-700 hover:text-amber-900 text-sm font-medium mt-2 group"
            >
              Learn more
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// PitchGenius Pro Tips
export const pitchGeniusProTips: ProTipData[] = [
  {
    condition: "default",
    title: "Most deals close on 1-3 pages",
    body: "The conversation closes the deal — the proposal just documents it. Use what you need, delete the rest.",
    learnMoreLink: "/learn/the-3-page-rule"
  },
  {
    condition: "long_context",
    title: "Detailed context = detailed proposal",
    body: "You gave us a lot to work with. For simpler clients, use pages 1-2. For complex deals, send the full package.",
  },
  {
    condition: "first_proposal",
    title: "Your first proposal package is ready",
    body: "Pro tip: Don't send the whole thing. Match the length to your client's sophistication level.",
    learnMoreLink: "/learn/how-to-present"
  },
  {
    condition: "high_value",
    title: "Enterprise clients expect detail",
    body: "For $25K+ deals with multiple stakeholders, the full package helps your champion sell internally.",
    learnMoreLink: "/learn/the-3-page-rule"
  },
  {
    condition: "solopreneur",
    title: "Keep it simple for solopreneurs",
    body: "Solo buyers make fast decisions. A 1-2 page summary often closes faster than a full proposal.",
  }
];

// Select the right pro tip based on conditions
export function getProTip(conditions: {
  isFirstProposal?: boolean;
  contextLength?: number;
  estimatedValue?: number;
  clientType?: string;
}): ProTipData {
  const { isFirstProposal, contextLength = 0, estimatedValue = 0, clientType } = conditions;
  
  if (isFirstProposal) {
    return pitchGeniusProTips.find(t => t.condition === 'first_proposal')!;
  }
  
  if (contextLength > 500) {
    return pitchGeniusProTips.find(t => t.condition === 'long_context')!;
  }
  
  if (estimatedValue >= 25000) {
    return pitchGeniusProTips.find(t => t.condition === 'high_value')!;
  }
  
  if (clientType === 'solopreneur' || clientType === 'coach') {
    return pitchGeniusProTips.find(t => t.condition === 'solopreneur')!;
  }
  
  return pitchGeniusProTips.find(t => t.condition === 'default')!;
}
