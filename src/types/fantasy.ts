import { TierLevel, getCountryTier, TIER_CONFIG } from "@/data/countryTiers";

export interface Country {
  code: string;
  name: string;
  flag: string;
}

export interface TieredCountry extends Country {
  tier: TierLevel;
}

export interface MedalCount {
  gold: number;
  silver: number;
  bronze: number;
}

export interface CountryMedalData {
  country: TieredCountry;
  medals: MedalCount;
  points: number;
}

export interface TierMedalBreakdown {
  tier: TierLevel;
  countries: CountryMedalData[];
  totalMedals: MedalCount;
  totalPoints: number;
}

export interface Team {
  id: string;
  name: string;
  avatar: string;
  members: string[];
  countries: TieredCountry[];
  medals: MedalCount;
  tierBreakdown: TierMedalBreakdown[];
  totalPoints: number;
}

// Legacy flat points (kept for reference)
export const POINTS = {
  gold: 3,
  silver: 2,
  bronze: 1,
} as const;

/**
 * Calculate points for a single country's medals using tiered scoring
 */
export const calculateCountryPoints = (
  countryCode: string,
  medals: MedalCount
): number => {
  const tier = getCountryTier(countryCode);
  const config = TIER_CONFIG[tier];
  return (
    medals.gold * config.gold +
    medals.silver * config.silver +
    medals.bronze * config.bronze
  );
};

/**
 * Calculate total tiered points for a team
 */
export const calculateTieredPoints = (tierBreakdown: TierMedalBreakdown[]): number => {
  return tierBreakdown.reduce((total, tier) => total + tier.totalPoints, 0);
};

/**
 * Legacy flat point calculation (kept for backward compatibility)
 */
export const calculatePoints = (medals: MedalCount): number => {
  return medals.gold * POINTS.gold + medals.silver * POINTS.silver + medals.bronze * POINTS.bronze;
};

export const calculateTotalMedals = (medals: MedalCount): number => {
  return medals.gold + medals.silver + medals.bronze;
};
