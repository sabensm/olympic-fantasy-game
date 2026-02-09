// Valid IOC country codes for the 2026 Milan Cortina Winter Olympics.
// Used server-side to validate team country assignments.
export const VALID_COUNTRY_CODES = new Set([
  "AFG", "ALB", "ALG", "AND", "ANG", "ARG", "ARM", "AUS", "AUT", "AZE",
  "BEL", "BIH", "BLR", "BOL", "BRA", "BUL", "CAN", "CHI", "CHN", "COL",
  "CRC", "CRO", "CYP", "CZE", "DEN", "ECU", "EGY", "ERI", "ESP", "EST",
  "ETH", "FAR", "FIN", "FRA", "GBR", "GEO", "GER", "GHA", "GRE", "HKG",
  "HUN", "INA", "IND", "IRI", "IRL", "ISL", "ISR", "ISV", "ITA", "JAM",
  "JPN", "KAZ", "KEN", "KGZ", "KOR", "KUW", "LAT", "LBN", "LIE", "LTU",
  "LUX", "MAD", "MAR", "MAS", "MDA", "MEX", "MGL", "MKD", "MLT", "MNE",
  "MON", "NED", "NGR", "NOR", "NZL", "PAK", "PER", "PHI", "POL", "POR",
  "PRK", "PUR", "QAT", "ROU", "RSA", "SAU", "SGP", "SLO", "SMR", "SRB",
  "SUI", "SVK", "SWE", "THA", "TJK", "TKM", "TPE", "TTO", "TUR", "UAE",
  "UKR", "USA", "UZB", "AIN", "ROC",
]);

const MAX_TEAM_NAME_LENGTH = 100;
const MAX_LEAGUE_NAME_LENGTH = 100;
const MAX_MEMBER_NAME_LENGTH = 100;
const MAX_MEMBERS_PER_TEAM = 20;
const MAX_COUNTRIES_PER_TEAM = 30;
const MAX_AVATAR_LENGTH = 50;

export function validateLeagueName(name: string): void {
  const trimmed = name.trim();
  if (trimmed.length === 0) {
    throw new Error("League name cannot be empty");
  }
  if (trimmed.length > MAX_LEAGUE_NAME_LENGTH) {
    throw new Error(
      `League name must be ${MAX_LEAGUE_NAME_LENGTH} characters or fewer`
    );
  }
}

export function validateTeamName(name: string): void {
  const trimmed = name.trim();
  if (trimmed.length === 0) {
    throw new Error("Team name cannot be empty");
  }
  if (trimmed.length > MAX_TEAM_NAME_LENGTH) {
    throw new Error(
      `Team name must be ${MAX_TEAM_NAME_LENGTH} characters or fewer`
    );
  }
}

export function validateAvatar(avatar: string): void {
  if (avatar.length > MAX_AVATAR_LENGTH) {
    throw new Error(`Avatar must be ${MAX_AVATAR_LENGTH} characters or fewer`);
  }
}

export function validateMembers(members: string[]): void {
  if (members.length > MAX_MEMBERS_PER_TEAM) {
    throw new Error(`A team can have at most ${MAX_MEMBERS_PER_TEAM} members`);
  }
  for (const member of members) {
    if (member.trim().length === 0) {
      throw new Error("Member name cannot be empty");
    }
    if (member.length > MAX_MEMBER_NAME_LENGTH) {
      throw new Error(
        `Member name must be ${MAX_MEMBER_NAME_LENGTH} characters or fewer`
      );
    }
  }
}

export function validateCountries(
  countries: { countryCode: string; countryName: string; countryFlag: string }[]
): void {
  if (countries.length > MAX_COUNTRIES_PER_TEAM) {
    throw new Error(
      `A team can draft at most ${MAX_COUNTRIES_PER_TEAM} countries`
    );
  }
  for (const country of countries) {
    if (!VALID_COUNTRY_CODES.has(country.countryCode)) {
      throw new Error(`Invalid country code: ${country.countryCode}`);
    }
    if (country.countryName.length > 100) {
      throw new Error("Country name too long");
    }
    if (country.countryFlag.length > 50) {
      throw new Error("Country flag too long");
    }
  }
}
