// Analytics tracking utility for key user actions
// Simple, lightweight tracking that logs events to console in dev and can be extended

type AnalyticsEvent = 
  | 'proposal_started'
  | 'proposal_generated'
  | 'proposal_failed'
  | 'dm_analysis_started'
  | 'dm_analysis_completed'
  | 'dm_analysis_failed'
  | 'subscription_checkout_started'
  | 'subscription_paywall_shown'
  | 'user_signup'
  | 'user_login'
  | 'deck_generation_started'
  | 'deck_generation_completed'
  | 'file_uploaded';

interface EventProperties {
  [key: string]: string | number | boolean | null | undefined;
}

class Analytics {
  private isDevMode = import.meta.env.DEV;

  track(event: AnalyticsEvent, properties?: EventProperties) {
    const timestamp = new Date().toISOString();
    const eventData = {
      event,
      properties: properties || {},
      timestamp,
    };

    // Always log in dev mode
    if (this.isDevMode) {
      console.log('[Analytics]', event, properties || {});
    }

    // Store in sessionStorage for debugging
    try {
      const existing = JSON.parse(sessionStorage.getItem('analytics_events') || '[]');
      existing.push(eventData);
      // Keep last 100 events
      if (existing.length > 100) existing.shift();
      sessionStorage.setItem('analytics_events', JSON.stringify(existing));
    } catch {
      // Ignore storage errors
    }

    // Here you can add integrations with external analytics services:
    // - Google Analytics: gtag('event', event, properties)
    // - Mixpanel: mixpanel.track(event, properties)
    // - PostHog: posthog.capture(event, properties)
    // - Amplitude: amplitude.track(event, properties)
  }

  // Convenience methods for common events
  proposalStarted(businessType: string, hasBackground: boolean) {
    this.track('proposal_started', { businessType, hasBackground });
  }

  proposalGenerated(proposalLength: string, hasPricing: boolean) {
    this.track('proposal_generated', { proposalLength, hasPricing });
  }

  proposalFailed(error: string) {
    this.track('proposal_failed', { error });
  }

  dmAnalysisStarted(hasExistingLead: boolean) {
    this.track('dm_analysis_started', { hasExistingLead });
  }

  dmAnalysisCompleted(platform: string, qualificationScore: number, isNewLead: boolean) {
    this.track('dm_analysis_completed', { platform, qualificationScore, isNewLead });
  }

  dmAnalysisFailed(error: string) {
    this.track('dm_analysis_failed', { error });
  }

  subscriptionCheckoutStarted(productType: string) {
    this.track('subscription_checkout_started', { productType });
  }

  paywallShown(trigger: string) {
    this.track('subscription_paywall_shown', { trigger });
  }

  userSignup(method: string) {
    this.track('user_signup', { method });
  }

  userLogin(method: string) {
    this.track('user_login', { method });
  }

  deckGenerationStarted(clientName: string) {
    this.track('deck_generation_started', { clientName });
  }

  deckGenerationCompleted(slideCount: number) {
    this.track('deck_generation_completed', { slideCount });
  }

  fileUploaded(fileType: string, purpose: string) {
    this.track('file_uploaded', { fileType, purpose });
  }
}

export const analytics = new Analytics();
