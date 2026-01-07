import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Users, Sparkles, TrendingUp, CheckCircle, Zap } from "lucide-react";

// Social proof message templates with variety
const proofMessages = [
  {
    type: "purchase",
    templates: [
      { name: "Sarah", location: "Los Angeles, CA", action: "just signed up for Pro Annual" },
      { name: "Marcus", location: "Atlanta, GA", action: "upgraded to Lifetime Access" },
      { name: "Jennifer", location: "Austin, TX", action: "just got Pro Annual" },
      { name: "David", location: "Seattle, WA", action: "started their free trial" },
      { name: "Michelle", location: "Miami, FL", action: "joined PitchGenius" },
      { name: "James", location: "Denver, CO", action: "upgraded to Lifetime" },
      { name: "Ashley", location: "Chicago, IL", action: "just signed up" },
      { name: "Robert", location: "Phoenix, AZ", action: "got Pro Annual" },
    ],
    icon: Users,
  },
  {
    type: "proposal",
    templates: [
      { role: "Marketing Consultant", location: "Kansas City", action: "generated a $15K proposal in 38 seconds" },
      { role: "Brand Strategist", location: "Nashville", action: "created a Fortune 500 proposal in 45 seconds" },
      { role: "Creative Director", location: "Portland", action: "generated a $25K proposal in 41 seconds" },
      { role: "Business Coach", location: "San Diego", action: "created a proposal in 36 seconds" },
      { role: "UX Designer", location: "Brooklyn", action: "generated an $8K proposal in 42 seconds" },
      { role: "Content Creator", location: "Dallas", action: "created a $12K brand deal proposal in 39 seconds" },
      { role: "Freelance Developer", location: "Boston", action: "generated a proposal in 34 seconds" },
      { role: "Agency Owner", location: "Toronto", action: "created 3 proposals in under 2 minutes" },
    ],
    icon: Sparkles,
  },
  {
    type: "speed",
    templates: [
      { stat: "34 sec", action: "average proposal generation time today" },
      { stat: "47 sec", action: "for the last $50K proposal generated" },
      { stat: "2 min", action: "to generate a full pitch deck" },
      { stat: "38 sec", action: "average time to close-ready proposal" },
    ],
    icon: Zap,
  },
  {
    type: "milestone",
    templates: [
      { stat: "1,247", action: "proposals generated today" },
      { stat: "89", action: "consultants signed up this week" },
      { stat: "$2.3M", action: "in proposals generated this month" },
      { stat: "156", action: "deals closed using PitchGenius this week" },
      { stat: "4,821", action: "proposals generated this week" },
      { stat: "$847K", action: "in deals closed today" },
    ],
    icon: TrendingUp,
  },
  {
    type: "success",
    templates: [
      { name: "A freelancer", location: "Minneapolis", action: "just won a $20K contract" },
      { name: "An agency", location: "New York", action: "closed 3 deals this week" },
      { name: "A consultant", location: "Charlotte", action: "10x'd their close rate" },
      { name: "A coach", location: "Las Vegas", action: "landed their biggest client yet" },
      { name: "A designer", location: "San Francisco", action: "doubled their average deal size" },
      { name: "A strategist", location: "Chicago", action: "closed a $35K retainer" },
    ],
    icon: CheckCircle,
  },
];

function getRandomMessage() {
  const category = proofMessages[Math.floor(Math.random() * proofMessages.length)];
  const template = category.templates[Math.floor(Math.random() * category.templates.length)];
  
  let message = "";
  
  if ("name" in template && "location" in template) {
    message = `${template.name} from ${template.location} ${template.action}`;
  } else if ("role" in template && "location" in template) {
    message = `${template.role} in ${template.location} ${template.action}`;
  } else if ("stat" in template) {
    message = `${template.stat} ${template.action}`;
  }
  
  return { message, Icon: category.icon, type: category.type };
}

// Time since indicators
function getTimeSince(): string {
  const times = ["just now", "2 min ago", "5 min ago", "10 min ago", "15 min ago"];
  return times[Math.floor(Math.random() * times.length)];
}

export function SocialProofToast() {
  const [hasShownInitial, setHasShownInitial] = useState(false);

  const showProofToast = useCallback(() => {
    const { message, Icon, type } = getRandomMessage();
    const timeSince = getTimeSince();
    
    toast.custom(
      (t) => (
        <div
          className="bg-card border border-border/50 rounded-lg shadow-lg p-4 max-w-sm animate-in slide-in-from-right-5 duration-300"
          onClick={() => toast.dismiss(t)}
        >
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-full ${
              type === "purchase" ? "bg-primary/20 text-primary" :
              type === "proposal" ? "bg-amber-500/20 text-amber-500" :
              type === "milestone" ? "bg-blue-500/20 text-blue-500" :
              "bg-green-500/20 text-green-500"
            }`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground leading-tight">
                {message}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {timeSince}
              </p>
            </div>
          </div>
        </div>
      ),
      {
        duration: 5000,
        position: "bottom-left",
      }
    );
  }, []);

  useEffect(() => {
    // Show first toast after 8 seconds
    const initialTimer = setTimeout(() => {
      showProofToast();
      setHasShownInitial(true);
    }, 8000);

    return () => clearTimeout(initialTimer);
  }, [showProofToast]);

  useEffect(() => {
    if (!hasShownInitial) return;

    // Show subsequent toasts every 25-45 seconds (randomized)
    const showNextToast = () => {
      const delay = 25000 + Math.random() * 20000; // 25-45 seconds
      return setTimeout(() => {
        showProofToast();
        // Schedule next one
        intervalRef = showNextToast();
      }, delay);
    };

    let intervalRef = showNextToast();

    return () => clearTimeout(intervalRef);
  }, [hasShownInitial, showProofToast]);

  return null; // This component only manages toasts
}
