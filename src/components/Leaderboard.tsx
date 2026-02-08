import { Team } from "@/types/fantasy";
import { TeamCard } from "./TeamCard";
import { Podium } from "./Podium";

interface LeaderboardProps {
  teams: Team[];
  isAdmin: boolean;
  onEditTeam: (team: Team) => void;
  onViewDetail: (team: Team) => void;
}

export const Leaderboard = ({ teams, isAdmin, onEditTeam, onViewDetail }: LeaderboardProps) => {
  // Sort by totalPoints (tiered scoring)
  const sortedTeams = [...teams].sort(
    (a, b) => b.totalPoints - a.totalPoints
  );

  if (teams.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">🏔️</div>
        <p className="text-muted-foreground">No teams yet. Add your first team!</p>
      </div>
    );
  }

  // Show podium if we have at least 1 team
  const showPodium = teams.length >= 1;

  return (
    <div className="space-y-4">
      {/* Podium visualization */}
      {showPodium && <Podium teams={teams} />}

      {/* All teams as cards */}
      <div className="space-y-3">
        {sortedTeams.map((team, index) => (
          <TeamCard
            key={team.id}
            team={team}
            rank={index + 1}
            isAdmin={isAdmin}
            onEdit={() => onEditTeam(team)}
            onViewDetail={() => onViewDetail(team)}
          />
        ))}
      </div>
    </div>
  );
};
