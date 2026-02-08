import { Team, TieredCountry, TierMedalBreakdown, MedalCount, calculateTotalMedals } from "@/types/fantasy";
import { TIER_CONFIG, TierLevel } from "@/data/countryTiers";
import { MedalBadge } from "./MedalBadge";
import { ScrollArea } from "./ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { cn } from "@/lib/utils";

interface TeamDetailSheetProps {
  team: Team | null;
  open: boolean;
  onClose: () => void;
}

interface TierSectionProps {
  breakdown: TierMedalBreakdown;
}

const TierSection = ({ breakdown }: TierSectionProps) => {
  const config = TIER_CONFIG[breakdown.tier];
  
  const tierColors: Record<TierLevel, string> = {
    1: "border-gold/30 bg-gold/5",
    2: "border-primary/30 bg-primary/5",
    3: "border-accent/30 bg-accent/5",
  };

  const tierBadgeColors: Record<TierLevel, string> = {
    1: "bg-gold text-gold-foreground",
    2: "bg-primary text-primary-foreground",
    3: "bg-accent text-accent-foreground",
  };

  return (
    <div className={cn("rounded-xl border p-4", tierColors[breakdown.tier])}>
      {/* Tier Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={cn("px-2 py-0.5 rounded text-xs font-bold", tierBadgeColors[breakdown.tier])}>
            T{breakdown.tier}
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            {config.description}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          🥇{config.gold} • 🥈{config.silver} • 🥉{config.bronze}
        </span>
      </div>

      {/* Countries */}
      <div className="space-y-2">
        {breakdown.countries.map(({ country, medals, points }) => (
          <div
            key={country.code}
            className="flex items-center justify-between bg-card/50 rounded-lg px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{country.flag}</span>
              <span className="text-sm font-medium">{country.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                {medals.gold > 0 && (
                  <span className="text-xs">🥇{medals.gold}</span>
                )}
                {medals.silver > 0 && (
                  <span className="text-xs">🥈{medals.silver}</span>
                )}
                {medals.bronze > 0 && (
                  <span className="text-xs">🥉{medals.bronze}</span>
                )}
                {calculateTotalMedals(medals) === 0 && (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </div>
              <span className="text-sm font-bold text-primary min-w-[50px] text-right">
                {points} pts
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Tier Total */}
      <div className="mt-3 pt-3 border-t border-border/50 flex justify-between items-center">
        <div className="flex gap-2">
          <MedalBadge type="gold" count={breakdown.totalMedals.gold} size="sm" />
          <MedalBadge type="silver" count={breakdown.totalMedals.silver} size="sm" />
          <MedalBadge type="bronze" count={breakdown.totalMedals.bronze} size="sm" />
        </div>
        <span className="font-bold text-foreground">
          Tier {breakdown.tier} Total: {breakdown.totalPoints} pts
        </span>
      </div>
    </div>
  );
};

export const TeamDetailSheet = ({ team, open, onClose }: TeamDetailSheetProps) => {
  if (!team) return null;

  // Group countries by tier for display
  const tierBreakdown = team.tierBreakdown;
  
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
        <SheetHeader className="pb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{team.avatar}</span>
            <div>
              <SheetTitle className="text-xl">{team.name}</SheetTitle>
              {team.members && team.members.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {team.members.join(", ")}
                </p>
              )}
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(85vh-140px)] pr-4">
          <div className="space-y-4">
            {/* Tier Sections */}
            {tierBreakdown.map((breakdown) => (
              <TierSection key={breakdown.tier} breakdown={breakdown} />
            ))}

            {/* No countries message */}
            {tierBreakdown.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No countries assigned to this team yet
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Grand Total */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent pt-8">
          <div className="bg-card rounded-xl p-4 shadow-elevated flex items-center justify-between">
            <div className="flex gap-2">
              <MedalBadge type="gold" count={team.medals.gold} />
              <MedalBadge type="silver" count={team.medals.silver} />
              <MedalBadge type="bronze" count={team.medals.bronze} />
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground uppercase">Grand Total</div>
              <div className="text-2xl font-black text-gradient-gold">
                {team.totalPoints} pts
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
