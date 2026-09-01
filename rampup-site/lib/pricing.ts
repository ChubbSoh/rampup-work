// Centralised pricing for Restaurant RampUp packages.
//
// Change a price ONCE here and every page/component that imports it
// (PricingCard, any future pricing UI) picks it up automatically.
// See /docs/PRICING.md for the full list of places to check whenever
// pricing changes, including static HTML that can't read this file.

export const restaurantRampUp = {
  /** Monthly price in THB, as a number (no formatting). */
  price: 59990,
  billingPeriod: 'month' as const,
  /** Google Map Ads is bundled into the base package — do not sell separately. */
  includesGoogleMapAds: true,
}

/** One-time website design & build price, shown alongside the monthly package. */
export const websiteBuild = {
  price: 79990,
  billing: 'one-time' as const,
}

/**
 * Monthly add-on prices in THB.
 *
 * These same figures are still hardcoded as display strings in
 * components/PricingCard.tsx and (in Thai) lib/translations.ts — see
 * docs/PRICING.md. Changing a number here does NOT update those; they remain a
 * manual edit. This block exists so the onboarding price calculation has one
 * authoritative source rather than a fourth copy.
 */
export const addOns = {
  grab:    { price: 9990 },
  lineman: { price: 4990 },
  lineOa:  { price: 3990 },
}

/**
 * Formats a THB amount with thousands separators, e.g. 59990 -> "59,990".
 * Does not include the ฿ symbol so callers can control placement/spacing.
 */
export function formatTHB(amount: number): string {
  return amount.toLocaleString('en-US')
}
