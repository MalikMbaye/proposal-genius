import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'pitchgenius_visited_tabs';

export interface TourContent {
  title: string;
  description: string;
  pitchKitRole: string;
  whyYouNeedIt: string;
  proTip?: string;
}

// Tour content for each tab
export const tourContent: Record<string, TourContent> = {
  proposal: {
    title: "Your Written Proposal",
    description: "This is your AI-generated proposal document — a comprehensive pitch customized to your client's needs, goals, and budget.",
    pitchKitRole: "The proposal is the foundation of your pitch kit. It's the document you'll send to clients to outline scope, pricing, and why you're the right choice.",
    whyYouNeedIt: "Written proposals close deals 2-3x faster than verbal quotes. They establish professionalism and give clients something tangible to review and share with decision-makers.",
    proTip: "Copy this into Google Docs or Word, add your logo, and export as PDF before sending.",
  },
  deck: {
    title: "Slide Deck Presentation",
    description: "Transform your proposal into a stunning visual presentation — perfect for pitching in meetings, video calls, or leaving behind after a presentation.",
    pitchKitRole: "Your deck is the visual companion to your written proposal. Use it for live pitches, discovery calls, or as a follow-up that's easier to skim than a full proposal.",
    whyYouNeedIt: "Visual presentations increase message retention by 65%. Clients who see a deck are more likely to remember your key points and share them internally.",
    proTip: "Takes 5-7 minutes to generate. You can switch tabs while it builds — we'll keep working in the background.",
  },
  contract: {
    title: "Service Contract",
    description: "A legally-structured contract generated from your proposal — with payment terms, scope of work, and project milestones ready to customize.",
    pitchKitRole: "The contract seals the deal. Once the client says yes to your proposal, the contract formalizes the agreement and protects both parties.",
    whyYouNeedIt: "Clients take you more seriously when you have professional contracts ready. It also protects you from scope creep and payment disputes.",
    proTip: "Fill in the [BRACKETED] fields with your specific details, then use Square Contracts or DocuSign to collect signatures.",
  },
  contractEmail: {
    title: "Contract Delivery Email",
    description: "A professionally written email to accompany your contract — explains what's attached, sets expectations, and includes a clear call-to-action.",
    pitchKitRole: "This email bridges the gap between 'yes' and signature. It makes sending your contract feel polished and reduces friction in the signing process.",
    whyYouNeedIt: "A good delivery email can reduce time-to-signature by days. It answers common questions upfront and makes it easy for clients to take action.",
    proTip: "Send this within 24 hours of verbal agreement — momentum matters.",
  },
  invoiceDescription: {
    title: "Invoice Line Items",
    description: "Pre-formatted invoice descriptions and line items you can paste directly into your invoicing tool — Stripe, QuickBooks, FreshBooks, or whatever you use.",
    pitchKitRole: "This completes the money side of your pitch kit. When it's time to get paid, you won't have to write invoice copy from scratch.",
    whyYouNeedIt: "Professional, clear invoice descriptions reduce payment disputes and questions. Clients understand exactly what they're paying for.",
    proTip: "Copy these directly into your invoicing software. Adjust quantities or line items as needed.",
  },
  proposalEmail: {
    title: "Proposal Delivery Email",
    description: "A compelling email to send with your proposal — summarizes the key value, creates urgency, and guides the client to review and respond.",
    pitchKitRole: "This is your proposal's 'cover letter.' It's what the client reads first and determines whether they'll actually open and review your proposal.",
    whyYouNeedIt: "Proposals sent with a strong email get 40% more responses. The email primes the client for what they're about to read and sets the tone.",
    proTip: "Personalize the opening line with something specific from your conversation with the client.",
  },
  library: {
    title: "Proposal Library",
    description: "Access 50+ real proposals that closed real deals — from agencies, consultants, and freelancers across industries. Study what works and adapt it.",
    pitchKitRole: "This is your reference library. Use these as templates, inspiration, or proof of what winning proposals look like.",
    whyYouNeedIt: "Learning from successful proposals accelerates your growth. See real pricing, real structure, and real language that's won real business.",
    proTip: "Start with proposals in your industry, then expand to see how others structure pricing and deliverables.",
  },
};

export function useFirstVisitTour() {
  const [visitedTabs, setVisitedTabs] = useState<Set<string>>(new Set());
  const [currentTour, setCurrentTour] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load visited tabs from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setVisitedTabs(new Set(parsed));
      }
    } catch (e) {
      console.error('Failed to load visited tabs:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever visitedTabs changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...visitedTabs]));
      } catch (e) {
        console.error('Failed to save visited tabs:', e);
      }
    }
  }, [visitedTabs, isLoaded]);

  const hasVisitedTab = useCallback((tabId: string) => {
    return visitedTabs.has(tabId);
  }, [visitedTabs]);

  const markTabVisited = useCallback((tabId: string) => {
    setVisitedTabs(prev => new Set([...prev, tabId]));
    setCurrentTour(null);
  }, []);

  const checkAndShowTour = useCallback((tabId: string) => {
    // Don't show tour for home tab
    if (tabId === 'home') return;
    
    // Only show if not visited and tour content exists
    if (!visitedTabs.has(tabId) && tourContent[tabId] && isLoaded) {
      setCurrentTour(tabId);
    }
  }, [visitedTabs, isLoaded]);

  const dismissTour = useCallback(() => {
    if (currentTour) {
      markTabVisited(currentTour);
    }
  }, [currentTour, markTabVisited]);

  const resetAllTours = useCallback(() => {
    setVisitedTabs(new Set());
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const getTourContent = useCallback((tabId: string): TourContent | null => {
    return tourContent[tabId] || null;
  }, []);

  return {
    currentTour,
    hasVisitedTab,
    markTabVisited,
    checkAndShowTour,
    dismissTour,
    resetAllTours,
    getTourContent,
    isLoaded,
  };
}
