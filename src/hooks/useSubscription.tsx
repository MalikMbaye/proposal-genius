import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface SubscriptionStatus {
  subscribed: boolean;
  subscription_type: 'pro_monthly' | 'pro_annual' | 'lifetime' | null;
  has_lifetime: boolean;
  has_pro_library: boolean;
  subscription_end: string | null;
  proposals_this_month: number;
  proposals_limit: number;
  extra_proposals_purchased: number;
  lifetime_available: boolean;
  lifetime_spots_remaining: number;
  loading: boolean;
  error: string | null;
}

interface SubscriptionContextType extends SubscriptionStatus {
  checkSubscription: () => Promise<void>;
  checkIpUsage: () => Promise<{ can_generate: boolean; remaining: number; proposals_used: number }>;
  checkLifetimeAvailability: () => Promise<{ available: boolean; spots_remaining: number }>;
  recordUsage: () => Promise<void>;
  openCheckout: (productType: 'pro_monthly' | 'pro_annual' | 'lifetime' | 'extra_proposals' | 'pro_library') => Promise<void>;
  openCustomerPortal: () => Promise<void>;
}

const defaultStatus: SubscriptionStatus = {
  subscribed: false,
  subscription_type: null,
  has_lifetime: false,
  has_pro_library: false,
  subscription_end: null,
  proposals_this_month: 0,
  proposals_limit: 2, // Free tier - 2 proposals
  extra_proposals_purchased: 0,
  lifetime_available: true,
  lifetime_spots_remaining: 9,
  loading: true,
  error: null,
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user, session } = useAuth();
  const [status, setStatus] = useState<SubscriptionStatus>(defaultStatus);

  const checkSubscription = useCallback(async () => {
    if (!user || !session) {
      setStatus({ ...defaultStatus, loading: false });
      return;
    }

    try {
      setStatus(prev => ({ ...prev, loading: true, error: null }));
      
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      setStatus(prev => ({
        ...prev,
        subscribed: data.subscribed,
        subscription_type: data.subscription_type,
        has_lifetime: data.has_lifetime,
        has_pro_library: data.has_pro_library,
        subscription_end: data.subscription_end,
        proposals_this_month: data.proposals_this_month,
        proposals_limit: data.proposals_limit,
        extra_proposals_purchased: data.extra_proposals_purchased || 0,
        loading: false,
        error: null,
      }));
    } catch (error) {
      console.error('Error checking subscription:', error);
      setStatus(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to check subscription',
      }));
    }
  }, [user, session]);

  const checkIpUsage = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('check-ip-usage');
      if (error) throw error;
      return {
        can_generate: data.can_generate,
        remaining: data.remaining,
        proposals_used: data.proposals_used,
      };
    } catch (error) {
      console.error('Error checking IP usage:', error);
      return { can_generate: false, remaining: 0, proposals_used: 0 };
    }
  }, []);

  const checkLifetimeAvailability = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('check-lifetime-availability');
      if (error) throw error;
      
      setStatus(prev => ({
        ...prev,
        lifetime_available: data.available,
        lifetime_spots_remaining: data.spots_remaining,
      }));
      
      return {
        available: data.available,
        spots_remaining: data.spots_remaining,
      };
    } catch (error) {
      console.error('Error checking lifetime availability:', error);
      return { available: true, spots_remaining: 27 };
    }
  }, []);

  const recordUsage = useCallback(async () => {
    try {
      const headers: Record<string, string> = {};
      if (session?.access_token) {
        headers.Authorization = `Bearer ${session.access_token}`;
      }
      await supabase.functions.invoke('record-usage', { headers });
    } catch (error) {
      console.error('Error recording usage:', error);
    }
  }, [session]);

  const openCheckout = useCallback(async (productType: 'pro_monthly' | 'pro_annual' | 'lifetime' | 'extra_proposals' | 'pro_library') => {
    if (!session) {
      throw new Error('Must be logged in to checkout');
    }

    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: { product_type: productType },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) throw error;
    if (data?.url) {
      window.open(data.url, '_blank');
    }
  }, [session]);

  const openCustomerPortal = useCallback(async () => {
    if (!session) {
      throw new Error('Must be logged in to manage subscription');
    }

    const { data, error } = await supabase.functions.invoke('customer-portal', {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) throw error;
    if (data?.url) {
      window.open(data.url, '_blank');
    }
  }, [session]);

  // Check subscription on auth change
  useEffect(() => {
    if (user && session) {
      checkSubscription();
    } else {
      setStatus({ ...defaultStatus, loading: false });
    }
  }, [user, session, checkSubscription]);

  // Periodic refresh every minute
  useEffect(() => {
    if (!user || !session) return;

    const interval = setInterval(() => {
      checkSubscription();
    }, 60000);

    return () => clearInterval(interval);
  }, [user, session, checkSubscription]);

  return (
    <SubscriptionContext.Provider
      value={{
        ...status,
        checkSubscription,
        checkIpUsage,
        checkLifetimeAvailability,
        recordUsage,
        openCheckout,
        openCustomerPortal,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}