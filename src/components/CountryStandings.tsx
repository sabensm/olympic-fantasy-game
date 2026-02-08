import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { getCountryTier, TIER_CONFIG } from "@/data/countryTiers";

export const CountryStandings = () => {
  const medals = useQuery(api.medals.getMedalTable);

  const isLoading = medals === undefined;

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-3 animate-float">🏅</div>
        <p className="text-muted-foreground">Loading medal table...</p>
      </div>
    );
  }

  if (medals.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">🏔️</div>
        <p className="text-muted-foreground">No medal data available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="grid grid-cols-[auto_1fr_repeat(4,48px)] gap-2 px-3 py-2 text-xs font-medium text-muted-foreground">
        <span className="w-8 text-center">#</span>
        <span>Country</span>
        <span className="text-center">🥇</span>
        <span className="text-center">🥈</span>
        <span className="text-center">🥉</span>
        <span className="text-center">Total</span>
      </div>

      {/* Country rows */}
      {medals.map((country, index) => {
        const tier = getCountryTier(country.countryCode);
        const tierConfig = TIER_CONFIG[tier];

        return (
          <div
            key={country.countryCode}
            className="grid grid-cols-[auto_1fr_repeat(4,48px)] gap-2 items-center px-3 py-3 rounded-lg bg-card/60 backdrop-blur-sm border border-border/50 hover:bg-card/80 transition-colors"
          >
            <span className="w-8 text-center text-sm font-semibold text-muted-foreground">
              {index + 1}
            </span>
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xl">{country.countryFlag || ""}</span>
              <div className="min-w-0">
                <span className="font-medium text-sm truncate block">{country.country}</span>
                <span className="text-xs text-muted-foreground">
                  {tierConfig.name} • {tierConfig.gold}/{tierConfig.silver}/{tierConfig.bronze}pts
                </span>
              </div>
            </div>
            <span className="text-center font-semibold text-gold">{country.gold || "-"}</span>
            <span className="text-center font-semibold text-silver">{country.silver || "-"}</span>
            <span className="text-center font-semibold text-bronze">{country.bronze || "-"}</span>
            <span className="text-center font-bold">{country.total || "-"}</span>
          </div>
        );
      })}
    </div>
  );
};
