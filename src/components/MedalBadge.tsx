import { cn } from "@/lib/utils";

interface MedalBadgeProps {
  type: "gold" | "silver" | "bronze";
  count: number;
  size?: "sm" | "md";
}

export const MedalBadge = ({ type, count, size = "md" }: MedalBadgeProps) => {
  const gradientClass = {
    gold: "gradient-gold",
    silver: "gradient-silver",
    bronze: "gradient-bronze",
  };

  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
  };

  const glowClass = {
    gold: count > 0 ? "shadow-medal" : "",
    silver: "",
    bronze: "",
  };

  return (
    <div className="flex flex-col items-center gap-0.5">
      <div
        className={cn(
          "rounded-full flex items-center justify-center font-bold medal-shine relative",
          gradientClass[type],
          sizeClasses[size],
          glowClass[type],
          type === "gold" && "text-gold-foreground",
          type === "silver" && "text-silver-foreground",
          type === "bronze" && "text-bronze-foreground",
          count > 0 && "ring-2 ring-white/30"
        )}
      >
        {count}
      </div>
      <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
        {type.charAt(0)}
      </span>
    </div>
  );
};
