// Country tier definitions for the 2026 Milan Cortina Winter Olympics
// Tier determines point multipliers for medals

export type TierLevel = 1 | 2 | 3;

export interface TierConfig {
  level: TierLevel;
  name: string;
  gold: number;
  silver: number;
  bronze: number;
  description: string;
}

export const TIER_CONFIG: Record<TierLevel, TierConfig> = {
  1: {
    level: 1,
    name: "Tier 1",
    gold: 3,
    silver: 2,
    bronze: 1,
    description: "Top winter sports nations",
  },
  2: {
    level: 2,
    name: "Tier 2",
    gold: 30,
    silver: 20,
    bronze: 10,
    description: "Strong contenders",
  },
  3: {
    level: 3,
    name: "Tier 3",
    gold: 300,
    silver: 200,
    bronze: 100,
    description: "Underdog nations",
  },
};

// IOC codes for Tier 1 countries (12 nations)
const TIER_1_COUNTRIES = new Set([
  "AUT", // Austria
  "CAN", // Canada
  "CHN", // China
  "FRA", // France
  "GER", // Germany
  "AIN", // Individual Neutral Athletes
  "ITA", // Italy
  "NED", // Netherlands
  "NOR", // Norway
  "KOR", // South Korea
  "SWE", // Sweden
  "SUI", // Switzerland
  "USA", // United States
]);

// IOC codes for Tier 2 countries (19 nations)
const TIER_2_COUNTRIES = new Set([
  "AUS", // Australia
  "BEL", // Belgium
  "BUL", // Bulgaria
  "CRO", // Croatia
  "CZE", // Czech Republic
  "EST", // Estonia
  "FIN", // Finland
  "GBR", // Great Britain
  "HUN", // Hungary
  "JPN", // Japan
  "KAZ", // Kazakhstan
  "LAT", // Latvia
  "LIE", // Liechtenstein
  "NZL", // New Zealand
  "POL", // Poland
  "SVK", // Slovakia
  "SLO", // Slovenia
  "ESP", // Spain
  "UKR", // Ukraine
]);

/**
 * Get the tier level for a country by IOC code
 * Countries not in Tier 1 or 2 default to Tier 3
 */
export const getCountryTier = (iocCode: string): TierLevel => {
  if (TIER_1_COUNTRIES.has(iocCode)) return 1;
  if (TIER_2_COUNTRIES.has(iocCode)) return 2;
  return 3;
};

/**
 * Get the tier configuration for a country
 */
export const getCountryTierConfig = (iocCode: string): TierConfig => {
  return TIER_CONFIG[getCountryTier(iocCode)];
};

/**
 * Get all tier 1 country codes
 */
export const getTier1Countries = (): string[] => Array.from(TIER_1_COUNTRIES);

/**
 * Get all tier 2 country codes
 */
export const getTier2Countries = (): string[] => Array.from(TIER_2_COUNTRIES);
