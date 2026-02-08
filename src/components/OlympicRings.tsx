import { cn } from "@/lib/utils";

interface OlympicRingsProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const OlympicRings = ({ className, size = "md" }: OlympicRingsProps) => {
  const sizeConfig = {
    sm: { ring: "w-4 h-4", border: "2px", gap: 2, offset: 6 },
    md: { ring: "w-6 h-6", border: "2.5px", gap: 3, offset: 8 },
    lg: { ring: "w-10 h-10", border: "3px", gap: 5, offset: 14 },
  };

  const config = sizeConfig[size];

  const ringStyle = (color: string) => ({
    borderWidth: config.border,
    borderColor: `hsl(var(--olympic-${color}))`,
    borderStyle: "solid" as const,
  });

  return (
    <div className={cn("relative inline-block", className)}>
      {/* Top row: Blue, Black, Red */}
      <div className="flex">
        <div className={cn("rounded-full bg-transparent", config.ring)} style={ringStyle("blue")} />
        <div className={cn("rounded-full bg-transparent", config.ring)} style={{ ...ringStyle("black"), marginLeft: `-${config.gap}px` }} />
        <div className={cn("rounded-full bg-transparent", config.ring)} style={{ ...ringStyle("red"), marginLeft: `-${config.gap}px` }} />
      </div>
      {/* Bottom row: Yellow, Green - positioned between top rings */}
      <div 
        className="flex absolute"
        style={{ 
          top: `${config.offset}px`, 
          left: `${config.offset}px` 
        }}
      >
        <div className={cn("rounded-full bg-transparent", config.ring)} style={ringStyle("yellow")} />
        <div className={cn("rounded-full bg-transparent", config.ring)} style={{ ...ringStyle("green"), marginLeft: `-${config.gap}px` }} />
      </div>
      {/* Spacer for proper sizing */}
      <div style={{ height: `${config.offset + 4}px` }} />
    </div>
  );
};
