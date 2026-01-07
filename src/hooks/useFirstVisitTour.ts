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
    description: "Your proposal document — customized to your client's needs, goals, and budget.",
    pitchKitRole: "The proposal is the foundation of your pitch kit. It's the document you'll send to clients to outline scope, pricing, and why you're the right choice.",
    whyYouNeedIt: "Written proposals close deals faster than verbal quotes. They give clients something tangible to review and share with decision-makers.",
    proTip: "Copy this into Google Docs or Word, add your logo, and export as PDF before sending.",
  },
  deck: {
    title: "Slide Deck Presentation",
    description: "Transform your proposal into a visual presentation — perfect for pitching in meetings or video calls.",
    pitchKitRole: "Your deck is the visual companion to your written proposal. Use it for live pitches, discovery calls, or as a follow-up.",
    whyYouNeedIt: "Visual presentations increase message retention. Clients who see a deck are more likely to remember your key points.",
    proTip: "You can switch tabs while it builds — we'll keep working in the background.",
  },
  contract: {
    title: "Service Contract",
    description: "A contract structure generated from your proposal — with payment terms, scope of work, and milestones ready to customize.",
    pitchKitRole: "The contract seals the deal. It formalizes the agreement and protects both parties.",
    whyYouNeedIt: "Clients take you more seriously when you have professional contracts ready.",
    proTip: "Fill in the [BRACKETED] fields with your specific details, then use your preferred signing tool.",
  },
  contractEmail: {
    title: "Contract Delivery Email",
    description: "An email to accompany your contract — explains what's attached and includes a clear call-to-action.",
    pitchKitRole: "This email bridges the gap between 'yes' and signature. It reduces friction in the signing process.",
    whyYouNeedIt: "A good delivery email can reduce time-to-signature. It answers common questions upfront.",
    proTip: "Send this within 24 hours of verbal agreement — momentum matters.",
  },
  invoiceDescription: {
    title: "Invoice Line Items",
    description: "Pre-formatted invoice descriptions you can paste directly into your invoicing tool.",
    pitchKitRole: "This completes the money side of your pitch kit. When it's time to get paid, you won't have to write invoice copy from scratch.",
    whyYouNeedIt: "Clear invoice descriptions reduce payment questions. Clients understand exactly what they're paying for.",
    proTip: "Copy these directly into your invoicing software. Adjust as needed.",
  },
  proposalEmail: {
    title: "Proposal Delivery Email",
    description: "An email to send with your proposal — summarizes the key value and guides the client to review.",
    pitchKitRole: "This is your proposal's 'cover letter.' It's what the client reads first.",
    whyYouNeedIt: "Proposals sent with a strong email get more responses. The email sets the tone for what they're about to read.",
    proTip: "Personalize the opening line with something specific from your conversation.",
  },
  library: {
    title: "Proposal Library",
    description: "Access real proposals that have won real deals. Study what works and adapt it to your business.",
    pitchKitRole: "This is your reference library. Use these as templates, inspiration, or proof of what works.",
    whyYouNeedIt: "Learning from successful proposals accelerates your growth.",
    proTip: "Start with proposals in your industry, then expand to see how others structure pricing.",
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
