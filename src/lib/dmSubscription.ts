// DM Closer Subscription Tiers and Products
export const DM_TIERS = {
  free: {
    name: "Free",
    monthly: {
      price: 0,
      priceDisplay: "$0",
      product_id: null,
      price_id: null,
    },
    annual: {
      price: 0,
      priceDisplay: "$0",
      monthlyEquivalent: "$0",
      product_id: null,
      price_id: null,
    },
    analyses_limit: 5,
    leads_limit: 3,
    features: [
      "5 DM analyses/month",
      "3 active leads tracked",
      "1 response option per message",
    ],
  },
  starter: {
    name: "Starter",
    monthly: {
      price: 9,
      priceDisplay: "$9",
      product_id: "prod_TkMy6rPwq8SHFq",
      price_id: "price_1SmsEYAIOyHZaZ4i1EsxcRgz",
    },
    annual: {
      price: 79,
      priceDisplay: "$79",
      monthlyEquivalent: "$6.58",
      savings: "Save $29/yr",
      product_id: "prod_TlftkCRhng6I0w",
      price_id: "price_1So8XnAIOyHZaZ4iXY3G4FSo",
    },
    analyses_limit: 50,
    leads_limit: 10,
    features: [
      "50 DM analyses/month",
      "10 active leads tracked",
      "3 response options per message",
      "Lead scoring",
    ],
  },
  growth: {
    name: "Growth",
    monthly: {
      price: 29,
      priceDisplay: "$29",
      pitchgeniusPrice: 19,
      pitchgeniusPriceDisplay: "$19",
      product_id: "prod_TkMyPJgltjMy3Y",
      price_id: "price_1SmsElAIOyHZaZ4ixyzkwJXg",
    },
    annual: {
      price: 259,
      priceDisplay: "$259",
      monthlyEquivalent: "$21.58",
      savings: "Save $89/yr",
      product_id: "prod_TlfuEz5dySJX9d",
      price_id: "price_1So8YHAIOyHZaZ4i2rxcC84i",
    },
    analyses_limit: 200,
    leads_limit: 25,
    features: [
      "200 DM analyses/month",
      "25 active leads tracked",
      "3 response options per message",
      "Lead scoring",
      "Context export",
      "Priority AI processing",
    ],
  },
  unlimited: {
    name: "Unlimited",
    monthly: {
      price: 49,
      priceDisplay: "$49",
      product_id: "prod_TkMysm8u0ORj04",
      price_id: "price_1SmsExAIOyHZaZ4iBXeLRvLG",
    },
    annual: {
      price: 449,
      priceDisplay: "$449",
      monthlyEquivalent: "$37.42",
      savings: "Save $139/yr",
      product_id: "prod_TlfuvJXS6Ekgdy",
      price_id: "price_1So8YVAIOyHZaZ4i6Il7oTgf",
    },
    analyses_limit: 999999,
    leads_limit: 999999,
    features: [
      "Unlimited DM analyses",
      "Unlimited leads tracked",
      "3 response options per message",
      "Lead scoring",
      "Context export",
      "Priority AI processing",
      "All future features",
    ],
  },
} as const;

export type DMTier = keyof typeof DM_TIERS;
export type BillingInterval = 'monthly' | 'annual';

export function getDMTierByProductId(productId: string): DMTier | null {
  for (const [tier, config] of Object.entries(DM_TIERS)) {
    if (config.monthly.product_id === productId || config.annual.product_id === productId) {
      return tier as DMTier;
    }
  }
  return null;
}

export function getDMTierLimits(tier: DMTier | null) {
  if (!tier || !DM_TIERS[tier]) {
    return DM_TIERS.free;
  }
  return DM_TIERS[tier];
}

export function getDMCheckoutKey(tier: 'starter' | 'growth' | 'unlimited', interval: BillingInterval): string {
  return interval === 'annual' ? `dm_${tier}_annual` : `dm_${tier}`;
}
