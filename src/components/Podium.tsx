import { Team } from "@/types/fantasy";
import { cn } from "@/lib/utils";

interface PodiumProps {
  teams: Team[];
}

interface PodiumBlockProps {
  team: Team | null;
  position: 1 | 2 | 3;
}

const PodiumBlock = ({ team, position }: PodiumBlockProps) => {
  const positionConfig = {
    1: {
      height: "h-28",
      order: "order-2",
      bg: "gradient-gold",
      delay: "0.2s",
      label: "🥇",
    },
    2: {
      height: "h-20",
      order: "order-1",
      bg: "gradient-silver",
      delay: "0.1s",
      label: "🥈",
    },
    3: {
      height: "h-16",
      order: "order-3",
      bg: "gradient-bronze",
      delay: "0.3s",
      label: "🥉",
    },
  };

  const config = positionConfig[position];

  return (
    <div
      className={cn("flex flex-col items-center animate-podium-rise", config.order)}
      style={{ animationDelay: config.delay }}
    >
      {/* Team indicator on top of podium */}
      {team ? (
        <div className="flex flex-col items-center mb-2">
          <span className="text-2xl mb-0.5">{config.label}</span>
          <span className="text-3xl">{team.avatar}</span>
          <span className="text-xs font-medium text-foreground truncate max-w-[80px] text-center">
            {team.name}
          </span>
        </div>
      ) : (
        <div className="flex flex-col items-center mb-2 opacity-40">
          <span className="text-2xl mb-0.5">{config.label}</span>
          <span className="text-2xl">❓</span>
          <span className="text-xs text-muted-foreground">Waiting...</span>
        </div>
      )}

      {/* Podium Block */}
      <div
        className={cn(
          "w-20 md:w-24 rounded-t-lg flex items-end justify-center pb-2",
          config.height,
          config.bg,
          !team && "opacity-50"
        )}
      >
        <span className="text-xl font-black text-white/90">{position}</span>
      </div>
    </div>
  );
};

export const Podium = ({ teams }: PodiumProps) => {
  const sortedTeams = [...teams].sort(
    (a, b) => b.totalPoints - a.totalPoints
  );

  // Need at least 1 team to show anything
  if (teams.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="flex justify-center items-end gap-3 md:gap-6">
        <PodiumBlock team={sortedTeams[1] || null} position={2} />
        <PodiumBlock team={sortedTeams[0] || null} position={1} />
        <PodiumBlock team={sortedTeams[2] || null} position={3} />
      </div>
    </div>
  );
};
