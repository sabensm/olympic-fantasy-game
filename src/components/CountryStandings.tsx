import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { getCountryTier, TIER_CONFIG, TierLevel } from "@/data/countryTiers";
import { cn } from "@/lib/utils";

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

  const tierBadgeColors: Record<TierLevel, string> = {
    1: "bg-gold/20 text-gold border-gold/30",
    2: "bg-primary/20 text-primary border-primary/30",
    3: "bg-accent/20 text-accent-foreground border-accent/30",
  };

  return (
    <div className="space-y-2">
      {/* === MOBILE LAYOUT === */}
      <div className="md:hidden space-y-2">
        {medals.map((country, index) => {
          const tier = getCountryTier(country.countryCode);
          const tierConfig = TIER_CONFIG[tier];

          return (
            <div
              key={country.countryCode}
              className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-2.5"
            >
              {/* Row 1: Rank + Flag + Name ... Tier + Total */}
              <div className="flex items-center gap-2">
                <span className="w-7 text-center text-sm font-bold text-muted-foreground shrink-0">
                  {index + 1}
                </span>
                <span className="text-lg">{country.countryFlag || ""}</span>
                <span className="font-medium text-sm truncate flex-1">
                  {country.country}
                </span>
                <span
                  className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0",
                    tierBadgeColors[tier]
                  )}
                >
                  T{tier}
                </span>
                <span className="font-bold text-base w-7 text-right shrink-0 tabular-nums">
                  {country.total || 0}
                </span>
              </div>

              {/* Row 2: Medal breakdown + multiplier hint */}
              <div className="flex items-center gap-4 mt-1.5 ml-9">
                <span className="text-sm font-semibold text-gold tabular-nums">
                  🥇 {country.gold || 0}
                </span>
                <span className="text-sm font-semibold text-silver tabular-nums">
                  🥈 {country.silver || 0}
                </span>
                <span className="text-sm font-semibold text-bronze tabular-nums">
                  🥉 {country.bronze || 0}
                </span>
                <span className="text-[11px] text-muted-foreground ml-auto">
                  {tierConfig.gold}/{tierConfig.silver}/{tierConfig.bronze} pts
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* === DESKTOP LAYOUT === */}
      <div className="hidden md:block space-y-2">
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
                    {tierConfig.name} · {tierConfig.gold}/{tierConfig.silver}/{tierConfig.bronze}pts
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
    </div>
  );
};
