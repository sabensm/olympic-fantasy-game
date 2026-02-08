import { Team } from "@/types/fantasy";
import { MedalBadge } from "./MedalBadge";

interface StatsBarProps {
  teams: Team[];
}

export const StatsBar = ({ teams }: StatsBarProps) => {
  const totalMedals = teams.reduce(
    (acc, team) => ({
      gold: acc.gold + team.medals.gold,
      silver: acc.silver + team.medals.silver,
      bronze: acc.bronze + team.medals.bronze,
    }),
    { gold: 0, silver: 0, bronze: 0 }
  );

  const totalCountries = new Set(
    teams.flatMap((team) => team.countries.map((c) => c.code))
  ).size;

  return (
    <div className="bg-card rounded-xl p-4 shadow-card">
      <h2 className="text-sm font-medium text-muted-foreground mb-3">
        Draft Overview
      </h2>
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <MedalBadge type="gold" count={totalMedals.gold} />
          <MedalBadge type="silver" count={totalMedals.silver} />
          <MedalBadge type="bronze" count={totalMedals.bronze} />
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-foreground">{teams.length}</div>
          <div className="text-[10px] text-muted-foreground">Teams</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-foreground">{totalCountries}</div>
          <div className="text-[10px] text-muted-foreground">Countries</div>
        </div>
      </div>
    </div>
  );
};
