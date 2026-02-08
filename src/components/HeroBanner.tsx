import { OlympicRings } from "./OlympicRings";

export const HeroBanner = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl mx-4 mb-6">
      {/* Background with gradient */}
      <div className="absolute inset-0 gradient-hero opacity-95" />
      
      {/* Alpine Mountain Silhouette */}
      <div className="absolute inset-0 overflow-hidden">
        <svg
          viewBox="0 0 1200 200"
          className="absolute bottom-0 w-full h-auto"
          preserveAspectRatio="xMidYMax slice"
        >
          {/* Back mountains - lighter */}
          <path
            d="M0,200 L0,120 L150,80 L300,110 L400,60 L500,100 L600,40 L750,90 L850,50 L950,85 L1050,45 L1150,75 L1200,55 L1200,200 Z"
            fill="hsl(220 30% 25% / 0.4)"
          />
          {/* Front mountains - darker */}
          <path
            d="M0,200 L0,140 L100,100 L200,130 L350,80 L450,120 L550,70 L700,110 L800,75 L900,105 L1000,65 L1100,95 L1200,80 L1200,200 Z"
            fill="hsl(220 35% 18% / 0.6)"
          />
          {/* Snow caps */}
          <path
            d="M350,80 L370,85 L380,75 L400,82 L390,70 L350,80 Z"
            fill="hsl(0 0% 100% / 0.8)"
          />
          <path
            d="M550,70 L575,78 L585,65 L600,73 L590,60 L550,70 Z"
            fill="hsl(0 0% 100% / 0.8)"
          />
          <path
            d="M1000,65 L1020,72 L1030,62 L1045,68 L1035,58 L1000,65 Z"
            fill="hsl(0 0% 100% / 0.8)"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 py-8 px-6 text-center">
        <div className="flex justify-center mb-3">
          <OlympicRings size="lg" />
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
          The Race for Gold
        </h1>
        
        <p className="text-white/80 text-sm md:text-base">
          Milan Cortina 2026 • Fantasy Draft
        </p>

        {/* Decorative elements */}
        <div className="flex justify-center gap-2 mt-4">
          <span className="text-2xl animate-float" style={{ animationDelay: '0s' }}>⛷️</span>
          <span className="text-2xl animate-float" style={{ animationDelay: '0.5s' }}>🏂</span>
          <span className="text-2xl animate-float" style={{ animationDelay: '1s' }}>⛸️</span>
        </div>
      </div>

      {/* Warm gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-warm/20 to-transparent" />
    </div>
  );
};
