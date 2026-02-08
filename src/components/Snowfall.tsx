import { useMemo } from "react";

interface SnowflakeProps {
  style: React.CSSProperties;
  slow?: boolean;
}

const Snowflake = ({ style, slow }: SnowflakeProps) => (
  <div
    className={`absolute text-white/20 select-none pointer-events-none ${slow ? 'snowflake-slow' : 'snowflake'}`}
    style={style}
  >
    ❄
  </div>
);

export const Snowfall = () => {
  const snowflakes = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${8 + Math.random() * 12}s`,
      animationDelay: `${Math.random() * 10}s`,
      fontSize: `${8 + Math.random() * 12}px`,
      opacity: 0.1 + Math.random() * 0.15,
      slow: Math.random() > 0.5,
    }));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {snowflakes.map((flake) => (
        <Snowflake
          key={flake.id}
          slow={flake.slow}
          style={{
            left: flake.left,
            animationDuration: flake.animationDuration,
            animationDelay: flake.animationDelay,
            fontSize: flake.fontSize,
            opacity: flake.opacity,
          }}
        />
      ))}
    </div>
  );
};
