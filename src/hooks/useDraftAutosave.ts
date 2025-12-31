import { useEffect, useCallback, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProposalStore } from '@/lib/proposalStore';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

const AUTOSAVE_DELAY_MS = 2000; // 2 second debounce

interface DraftData {
  client_name: string | null;
  client_context: string | null;
  background: string | null;
  business_type: string | null;
  custom_business_type: string | null;
  pricing_tiers: unknown;
  selected_case_studies: string[] | null;
  proposal_length: string | null;
  last_saved_at: string;
}

export function useDraftAutosave() {
  const { user } = useAuth();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [draftLoaded, setDraftLoaded] = useState(false);

  const {
    clientName,
    clientContext,
    background,
    businessType,
    customBusinessType,
    pricingTiers,
    selectedCaseStudies,
    proposalLength,
    setClientName,
    setClientContext,
    setBackground,
    setBusinessType,
    setCustomBusinessType,
    setPricingTiers,
    setSelectedCaseStudies,
    setProposalLength,
  } = useProposalStore();

  // Load draft on mount
  const loadDraft = useCallback(async () => {
    if (!user || draftLoaded) return;

    try {
      const { data, error } = await supabase
        .from('proposal_drafts')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading draft:', error);
        return;
      }

      if (data) {
        console.log('[AUTOSAVE] Loaded draft from', data.last_saved_at);
        
        // Only restore if there's meaningful content
        const hasContent = data.client_name || data.client_context || data.business_type;
        
        if (hasContent) {
          if (data.client_name) setClientName(data.client_name);
          if (data.client_context) setClientContext(data.client_context);
          if (data.background) setBackground(data.background);
          if (data.business_type) setBusinessType(data.business_type);
          if (data.custom_business_type) setCustomBusinessType(data.custom_business_type);
          if (data.pricing_tiers && Array.isArray(data.pricing_tiers)) {
            setPricingTiers(data.pricing_tiers as { id: string; name: string; price: string }[]);
          }
          if (data.selected_case_studies) setSelectedCaseStudies(data.selected_case_studies);
          if (data.proposal_length) setProposalLength(data.proposal_length);
          
          setLastSaved(new Date(data.last_saved_at));
          
          toast({
            title: "Draft restored",
            description: `Your previous work from ${new Date(data.last_saved_at).toLocaleString()} has been restored.`,
          });
        }
      }

      setDraftLoaded(true);
    } catch (err) {
      console.error('[AUTOSAVE] Error loading draft:', err);
      setDraftLoaded(true);
    }
  }, [user, draftLoaded, setClientName, setClientContext, setBackground, setBusinessType, setCustomBusinessType, setPricingTiers, setSelectedCaseStudies, setProposalLength]);

  // Save draft
  const saveDraft = useCallback(async () => {
    if (!user) return;

    // Don't save if no meaningful content
    const hasContent = clientName || clientContext || businessType;
    if (!hasContent) return;

    setIsSaving(true);

    try {
      // Check if draft exists
      const { data: existing } = await supabase
        .from('proposal_drafts')
        .select('id')
        .eq('user_id', user.id)
        .single();

      const draftPayload = {
        client_name: clientName || null,
        client_context: clientContext || null,
        background: background || null,
        business_type: businessType || null,
        custom_business_type: customBusinessType || null,
        pricing_tiers: JSON.parse(JSON.stringify(pricingTiers)),
        selected_case_studies: selectedCaseStudies.length > 0 ? selectedCaseStudies : null,
        proposal_length: proposalLength || null,
        last_saved_at: new Date().toISOString(),
      };

      let error;
      if (existing) {
        // Update existing draft
        const result = await supabase
          .from('proposal_drafts')
          .update(draftPayload)
          .eq('user_id', user.id);
        error = result.error;
      } else {
        // Insert new draft
        const result = await supabase
          .from('proposal_drafts')
          .insert({
            user_id: user.id,
            ...draftPayload,
          });
        error = result.error;
      }

      if (error) {
        console.error('[AUTOSAVE] Error saving draft:', error);
      } else {
        console.log('[AUTOSAVE] Draft saved successfully');
        setLastSaved(new Date());
      }
    } catch (err) {
      console.error('[AUTOSAVE] Error saving draft:', err);
    } finally {
      setIsSaving(false);
    }
  }, [user, clientName, clientContext, background, businessType, customBusinessType, pricingTiers, selectedCaseStudies, proposalLength]);

  // Debounced save on changes
  useEffect(() => {
    if (!user || !draftLoaded) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for debounced save
    timeoutRef.current = setTimeout(() => {
      saveDraft();
    }, AUTOSAVE_DELAY_MS);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [clientName, clientContext, background, businessType, customBusinessType, pricingTiers, selectedCaseStudies, proposalLength, saveDraft, user, draftLoaded]);

  // Load draft on mount
  useEffect(() => {
    loadDraft();
  }, [loadDraft]);

  // Clear draft (call after successful proposal generation)
  const clearDraft = useCallback(async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('proposal_drafts')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('[AUTOSAVE] Error clearing draft:', error);
      } else {
        console.log('[AUTOSAVE] Draft cleared');
        setLastSaved(null);
      }
    } catch (err) {
      console.error('[AUTOSAVE] Error clearing draft:', err);
    }
  }, [user]);

  return {
    isSaving,
    lastSaved,
    draftLoaded,
    clearDraft,
    saveDraft,
  };
}
