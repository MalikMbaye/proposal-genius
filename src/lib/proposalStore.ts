import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

export interface PricingTier {
  id: string;
  name: string;
  price: string;
}

interface Deliverables {
  proposal: string;
  deckPrompt: string;
  contract: string;
  contractEmail: string;
  invoiceDescription: string;
  proposalEmail: string;
}

interface DeckData {
  generationId: string | null;
  externalUrl: string | null;
  pdfUrl: string | null;
  pptxUrl: string | null;
  thumbnailUrl: string | null;
  status: 'idle' | 'generating' | 'completed' | 'error';
  error: string | null;
}

interface ProposalState {
  // Form data
  clientName: string;
  clientContext: string;
  background: string;
  selectedCaseStudies: string[];
  proposalLength: string;
  
  // Business type
  businessType: string;
  customBusinessType: string;
  
  // Pricing tiers (dynamic array)
  pricingTiers: PricingTier[];
  
  // Legacy pricing fields (kept for compatibility)
  pricingStrategy: string;
  pricingAI: string;
  pricingManaged: string;
  
  // Generated deliverables (can be partial)
  deliverables: Partial<Deliverables> | null;
  
  // Generated deck data
  deckData: DeckData;
  
  // Database proposal ID
  proposalId: string | null;
  
  // Actions
  setClientName: (name: string) => void;
  setClientContext: (context: string) => void;
  setBackground: (background: string) => void;
  toggleCaseStudy: (id: string) => void;
  setSelectedCaseStudies: (ids: string[]) => void;
  setProposalLength: (length: string) => void;
  setBusinessType: (type: string) => void;
  setCustomBusinessType: (type: string) => void;
  setPricingTiers: (tiers: PricingTier[]) => void;
  setPricingStrategy: (price: string) => void;
  setPricingAI: (price: string) => void;
  setPricingManaged: (price: string) => void;
  setDeliverables: (deliverables: Partial<Deliverables>) => void;
  updateDeliverable: (key: keyof Deliverables, content: string) => void;
  setProposalId: (id: string) => void;
  setDeckData: (data: Partial<DeckData>) => void;
  resetDeck: () => void;
  saveToDatabase: () => Promise<void>;
  reset: () => void;
}

const defaultBackground = `• 8 years in growth marketing & B2B SaaS
• Scaled 3 companies to 7-figures
• Built AI-powered lead generation systems
• Ex-LinkedIn, worked on Jobs product`;

const defaultDeckData: DeckData = {
  generationId: null,
  externalUrl: null,
  pdfUrl: null,
  pptxUrl: null,
  thumbnailUrl: null,
  status: 'idle',
  error: null,
};

const defaultPricingTier: PricingTier = {
  id: 'tier-default',
  name: '',
  price: '',
};

export const useProposalStore = create<ProposalState>((set, get) => ({
  clientName: '',
  clientContext: '',
  background: defaultBackground,
  selectedCaseStudies: [],
  proposalLength: 'medium',
  businessType: '',
  customBusinessType: '',
  pricingTiers: [{ ...defaultPricingTier }],
  pricingStrategy: '$7K-10K',
  pricingAI: '$15K-20K',
  pricingManaged: '$5K-8K/month',
  deliverables: null,
  deckData: defaultDeckData,
  proposalId: null,
  
  setClientName: (name) => set({ clientName: name }),
  setClientContext: (context) => set({ clientContext: context }),
  setBackground: (background) => set({ background }),
  toggleCaseStudy: (id) => set((state) => ({
    selectedCaseStudies: state.selectedCaseStudies.includes(id)
      ? state.selectedCaseStudies.filter((s) => s !== id)
      : [...state.selectedCaseStudies, id]
  })),
  setSelectedCaseStudies: (ids) => set({ selectedCaseStudies: ids }),
  setProposalLength: (length) => set({ proposalLength: length }),
  setBusinessType: (type) => set({ businessType: type }),
  setCustomBusinessType: (type) => set({ customBusinessType: type }),
  setPricingTiers: (tiers) => set({ pricingTiers: tiers }),
  setPricingStrategy: (price) => set({ pricingStrategy: price }),
  setPricingAI: (price) => set({ pricingAI: price }),
  setPricingManaged: (price) => set({ pricingManaged: price }),
  setDeliverables: (deliverables) => set({ deliverables }),
  updateDeliverable: (key, content) => set((state) => ({
    deliverables: {
      ...state.deliverables,
      [key]: content,
    }
  })),
  setProposalId: (id) => set({ proposalId: id }),
  
  setDeckData: (data) => set((state) => ({
    deckData: { ...state.deckData, ...data }
  })),
  
  resetDeck: () => set({ deckData: defaultDeckData }),
  
  saveToDatabase: async () => {
    const state = get();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;
    
    const proposalData = {
      user_id: user.id,
      client_name: state.clientName,
      project_context: state.clientContext,
      proposal: state.deliverables?.proposal || null,
      deck_prompt: state.deliverables?.deckPrompt || null,
      deck_url: state.deckData.pdfUrl || state.deckData.externalUrl || null,
      contract: state.deliverables?.contract || null,
      proposal_email: state.deliverables?.proposalEmail || null,
      contract_email: state.deliverables?.contractEmail || null,
      invoice_description: state.deliverables?.invoiceDescription || null,
      case_studies: state.selectedCaseStudies,
      proposal_length: state.proposalLength,
    };
    
    if (state.proposalId) {
      const { error } = await supabase
        .from('proposals')
        .update(proposalData)
        .eq('id', state.proposalId);
      
      if (error) {
        console.error('Error updating proposal:', error);
      }
    } else {
      const { data, error } = await supabase
        .from('proposals')
        .insert(proposalData)
        .select('id')
        .single();
      
      if (error) {
        console.error('Error creating proposal:', error);
      } else if (data) {
        set({ proposalId: data.id });
      }
    }
  },
  
  reset: () => set({
    clientName: '',
    clientContext: '',
    background: defaultBackground,
    selectedCaseStudies: [],
    proposalLength: 'medium',
    businessType: '',
    customBusinessType: '',
    pricingTiers: [{ ...defaultPricingTier }],
    pricingStrategy: '$7K-10K',
    pricingAI: '$15K-20K',
    pricingManaged: '$5K-8K/month',
    deliverables: null,
    deckData: defaultDeckData,
    proposalId: null,
  }),
}));

export const caseStudies = [
  {
    id: 'ripright',
    title: 'RipRight',
    description: 'Scaled from $15K/mo to $350K/mo in 8 months. 100M+ views, $1.7M ad spend.',
  },
  {
    id: 'pulse',
    title: 'Pulse',
    description: 'AI lead gen system generating 15+ meetings/week for B2B SaaS.',
  },
  {
    id: 'knac',
    title: 'Knac',
    description: 'Growth for HR tech startup backed by Google Black Founders Fund.',
  },
  {
    id: 'mogl',
    title: 'MOGL',
    description: 'B2B sports marketplace. Strategic partnerships, multi-channel acquisition.',
  },
];

export const proposalLengths = [
  { value: 'short', label: 'Short (5-7 pages)', description: 'Quick decisions, warm leads' },
  { value: 'medium', label: 'Medium (10-12 pages)', description: 'Balanced detail (Recommended)' },
  { value: 'long', label: 'Long (15-20 pages)', description: 'Enterprise, complex projects' },
  { value: 'detailed', label: 'Detailed (20-30+ pages)', description: 'RFPs, due diligence' },
];
