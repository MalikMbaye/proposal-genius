import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Users, Sparkles, TrendingUp, CheckCircle, Zap } from "lucide-react";

// Social proof message templates with variety
// Social proof message templates - realistic claims only
const proofMessages = [
  {
    type: "purchase",
    templates: [
      { name: "Sarah", location: "Los Angeles, CA", action: "just signed up" },
      { name: "Marcus", location: "Atlanta, GA", action: "upgraded to Pro" },
      { name: "Jennifer", location: "Austin, TX", action: "just joined" },
      { name: "David", location: "Seattle, WA", action: "started their free trial" },
      { name: "Michelle", location: "Miami, FL", action: "joined PitchGenius" },
      { name: "James", location: "Denver, CO", action: "upgraded their plan" },
      { name: "Ashley", location: "Chicago, IL", action: "just signed up" },
    ],
    icon: Users,
  },
  {
    type: "proposal",
    templates: [
      { role: "Marketing Consultant", location: "Kansas City", action: "just generated a proposal" },
      { role: "Brand Strategist", location: "Nashville", action: "created a new proposal" },
      { role: "Creative Director", location: "Portland", action: "just finished a pitch" },
      { role: "Business Coach", location: "San Diego", action: "generated a proposal" },
      { role: "UX Designer", location: "Brooklyn", action: "just created a proposal" },
      { role: "Freelance Developer", location: "Boston", action: "finished a proposal" },
    ],
    icon: Sparkles,
  },
  {
    type: "activity",
    templates: [
      { stat: "12", action: "proposals generated in the last hour" },
      { stat: "8", action: "users currently creating proposals" },
      { stat: "3", action: "slide decks being generated now" },
    ],
    icon: Zap,
  },
  {
    type: "success",
    templates: [
      { name: "A freelancer", location: "Minneapolis", action: "landed a new client" },
      { name: "An agency", location: "New York", action: "closed a deal this week" },
      { name: "A consultant", location: "Charlotte", action: "improved their close rate" },
      { name: "A coach", location: "Las Vegas", action: "landed their biggest client yet" },
      { name: "A designer", location: "San Francisco", action: "grew their average deal size" },
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
