import { Team, calculateTotalMedals } from "@/types/fantasy";
import { TierLevel } from "@/data/countryTiers";
import { MedalBadge } from "./MedalBadge";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronRight } from "lucide-react";

interface TeamCardProps {
  team: Team;
  rank: number;
  onEdit?: () => void;
  onViewDetail?: () => void;
  isAdmin?: boolean;
}

const TierBadge = ({ tier }: { tier: TierLevel }) => {
  const colors: Record<TierLevel, string> = {
    1: "bg-gold/20 text-gold border-gold/30",
    2: "bg-primary/20 text-primary border-primary/30",
    3: "bg-accent/20 text-accent-foreground border-accent/30",
  };

  return (
    <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded border", colors[tier])}>
      T{tier}
    </span>
  );
};

export const TeamCard = ({ team, rank, onEdit, onViewDetail, isAdmin }: TeamCardProps) => {
  const totalMedals = calculateTotalMedals(team.medals);

  const getRankStyle = () => {
    if (rank === 1) return "bg-gold/20 text-gold border-gold/30";
    if (rank === 2) return "bg-silver/20 text-silver border-silver/30";
    if (rank === 3) return "bg-bronze/20 text-bronze border-bronze/30";
    if (rank === 4) return "bg-warm/20 text-warm border-warm/30";
    if (rank === 5) return "bg-primary/10 text-primary border-primary/20";
    return "bg-secondary text-secondary-foreground border-border";
  };

  // Group countries by tier for display
  const countriesByTier = team.countries.reduce((acc, country) => {
    if (!acc[country.tier]) acc[country.tier] = [];
    acc[country.tier].push(country);
    return acc;
  }, {} as Record<TierLevel, typeof team.countries>);

  const handleCardClick = () => {
    if (onViewDetail) {
      onViewDetail();
    }
  };

  // Shared rank badge
  const rankBadge = (
    <div className="relative shrink-0">
      <div
        className={cn(
          "w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center font-bold text-base md:text-lg border",
          getRankStyle()
        )}
      >
        {rank}
      </div>
      {rank <= 5 && (
        <>
          <div className={cn(
            "absolute -bottom-1 left-1 w-2 h-3 rounded-b-sm opacity-60",
            rank === 4 ? "bg-warm" : "bg-primary"
          )} style={{ transform: "skewX(-10deg)" }} />
          <div className={cn(
            "absolute -bottom-1 right-1 w-2 h-3 rounded-b-sm opacity-60",
            rank === 4 ? "bg-warm" : "bg-primary"
          )} style={{ transform: "skewX(10deg)" }} />
        </>
      )}
    </div>
  );

  // Country flags grouped by tier
  const countryFlags = (
    <TooltipProvider delayDuration={100}>
      {([1, 2, 3] as TierLevel[]).map((tier) => {
        const tierCountries = countriesByTier[tier];
        if (!tierCountries || tierCountries.length === 0) return null;
        return (
          <div key={tier} className="flex items-center gap-0.5">
            <TierBadge tier={tier} />
            {tierCountries.map((country) => (
              <Tooltip key={country.code}>
                <TooltipTrigger asChild>
                  <span className="text-sm cursor-default">
                    {country.flag}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  {country.name}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        );
      })}
    </TooltipProvider>
  );

  return (
    <div
      className={cn(
        "bg-card rounded-xl shadow-card transition-all duration-300 hover:shadow-elevated hover:-translate-y-0.5 animate-slide-up group cursor-pointer relative",
        rank === 4 && "ring-1 ring-warm/20"
      )}
      style={{ animationDelay: `${(rank - 4) * 50}ms` }}
      onClick={handleCardClick}
    >
      {/* === MOBILE LAYOUT === */}
      <div className="md:hidden p-4">
        {/* Admin edit button - always visible on mobile (no hover state on touch) */}
        {isAdmin && onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="absolute top-3 right-3 p-1.5 text-muted-foreground hover:text-primary transition-colors z-10"
          >
            ✏️
          </button>
        )}

        {/* Row 1: Rank + Avatar + Name/Members + Points */}
        <div className="flex items-start gap-2.5">
          {rankBadge}
          <span className="text-2xl mt-0.5">{team.avatar}</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate text-[15px] leading-tight">
              {team.name}
            </h3>
            {team.members && team.members.length > 0 && (
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {team.members.join(", ")}
              </p>
            )}
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl font-bold text-primary leading-none animate-count-up">
              {team.totalPoints}
            </div>
            <div className="text-[10px] text-muted-foreground uppercase font-medium mt-0.5">
              pts
            </div>
          </div>
        </div>

        {/* Row 2: Medals */}
        <div className="flex items-center gap-3 mt-3">
          <MedalBadge type="gold" count={team.medals.gold} size="sm" />
          <MedalBadge type="silver" count={team.medals.silver} size="sm" />
          <MedalBadge type="bronze" count={team.medals.bronze} size="sm" />
        </div>

        {/* Row 3: Country Flags by Tier */}
        <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
          {countryFlags}
        </div>

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            🏅 {totalMedals} medals · {team.countries.length} countries
          </span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      {/* === DESKTOP LAYOUT === */}
      <div className="hidden md:block p-4">
        <div className="flex items-center gap-3">
          {/* Rank Badge */}
          {rankBadge}

          {/* Avatar & Name */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-3xl">{team.avatar}</span>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-foreground truncate">
                {team.name}
              </h3>
              {team.members && team.members.length > 0 && (
                <p className="text-xs text-muted-foreground truncate">
                  {team.members.join(", ")}
                </p>
              )}
              {/* Country flags grouped by tier */}
              <div className="flex flex-wrap items-center gap-2 mt-1">
                {countryFlags}
              </div>
            </div>
          </div>

          {/* Medals */}
          <div className="flex gap-2">
            <MedalBadge type="gold" count={team.medals.gold} size="sm" />
            <MedalBadge type="silver" count={team.medals.silver} size="sm" />
            <MedalBadge type="bronze" count={team.medals.bronze} size="sm" />
          </div>

          {/* Points & Chevron */}
          <div className="text-right pl-2 border-l border-border flex items-center gap-2">
            <div>
              <div className="text-2xl font-bold text-primary animate-count-up">
                {team.totalPoints}
              </div>
              <div className="text-[10px] text-muted-foreground uppercase font-medium">
                pts
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>

          {/* Edit Button (Admin Only) */}
          {isAdmin && onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="ml-1 p-2 text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
            >
              ✏️
            </button>
          )}
        </div>

        {/* Stats Row */}
        <div className="mt-3 pt-3 border-t border-border flex justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="text-gold">🏅</span> {totalMedals} total medals
          </span>
          <span className="flex items-center gap-1">
            {team.countries.length} countries • Tap for breakdown
          </span>
        </div>
      </div>
    </div>
  );
};
