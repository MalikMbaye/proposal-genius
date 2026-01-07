// DM Closer Subscription Tiers and Products
export const DM_TIERS = {
  free: {
    name: "Free",
    price: 0,
    priceDisplay: "$0",
    period: "/month",
    analyses_limit: 5,
    leads_limit: 3,
    features: [
      "5 DM analyses/month",
      "3 active leads tracked",
      "1 response option per message",
    ],
    product_id: null,
    price_id: null,
  },
  starter: {
    name: "Starter",
    price: 9,
    priceDisplay: "$9",
    period: "/month",
    analyses_limit: 50,
    leads_limit: 10,
    features: [
      "50 DM analyses/month",
      "10 active leads tracked",
      "3 response options per message",
      "Lead scoring",
    ],
    product_id: "prod_TkMy6rPwq8SHFq",
    price_id: "price_1SmsEYAIOyHZaZ4i1EsxcRgz",
  },
  growth: {
    name: "Growth",
    price: 29,
    priceDisplay: "$29",
    pitchgeniusPrice: 19,
    pitchgeniusPriceDisplay: "$19",
    period: "/month",
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
    product_id: "prod_TkMyPJgltjMy3Y",
    price_id: "price_1SmsElAIOyHZaZ4ixyzkwJXg",
  },
  unlimited: {
    name: "Unlimited",
    price: 49,
    priceDisplay: "$49",
    period: "/month",
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
    product_id: "prod_TkMysm8u0ORj04",
    price_id: "price_1SmsExAIOyHZaZ4iBXeLRvLG",
  },
} as const;

export type DMTier = keyof typeof DM_TIERS;

export function getDMTierByProductId(productId: string): DMTier | null {
  for (const [tier, config] of Object.entries(DM_TIERS)) {
    if (config.product_id === productId) {
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
