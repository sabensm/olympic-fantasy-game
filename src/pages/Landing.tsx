import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { OlympicRings } from "@/components/OlympicRings";
import { Snowfall } from "@/components/Snowfall";
import { Button } from "@/components/ui/button";
import { TIER_CONFIG } from "@/data/countryTiers";
import { useEffect } from "react";

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="min-h-screen gradient-alpine relative">
      <Snowfall />

      <div className="relative z-10">
        {/* Hero */}
        <div className="container mx-auto px-4 pt-16 pb-12 text-center">
          <div className="flex justify-center mb-6">
            <OlympicRings size="lg" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 tracking-tight">
            Milan Cortina 2026
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            Fantasy Draft Tracker
          </p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-8">
            Draft countries, earn points from their medals, and compete with friends.
            Create a league and share the link!
          </p>

          <div className="flex gap-3 justify-center mb-16">
            <Button size="lg" onClick={() => navigate("/sign-up")}>
              Create a League
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/sign-in")}>
              Sign In
            </Button>
          </div>
        </div>

        {/* How it Works */}
        <div className="container mx-auto px-4 pb-12">
          <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-16">
            <div className="text-center p-6 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50">
              <div className="text-4xl mb-3">1</div>
              <h3 className="font-semibold mb-2">Create a League</h3>
              <p className="text-sm text-muted-foreground">
                Sign up, name your league, and get a shareable link.
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50">
              <div className="text-4xl mb-3">2</div>
              <h3 className="font-semibold mb-2">Draft Countries</h3>
              <p className="text-sm text-muted-foreground">
                Add teams and assign countries. Each country can only belong to one team.
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50">
              <div className="text-4xl mb-3">3</div>
              <h3 className="font-semibold mb-2">Watch & Win</h3>
              <p className="text-sm text-muted-foreground">
                Medal data updates automatically. Underdogs earn more points!
              </p>
            </div>
          </div>
        </div>

        {/* Scoring Tiers */}
        <div className="container mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Scoring Tiers</h2>
          <p className="text-sm text-muted-foreground text-center mb-6 max-w-md mx-auto">
            Countries are grouped into tiers based on their winter sports strength.
            Underdog nations earn more points per medal!
          </p>

          <div className="max-w-lg mx-auto space-y-3">
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Tier 1 - Top Nations</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Norway, Canada, Germany, USA, etc.
              </p>
              <div className="flex gap-4 text-sm">
                <span>Gold: {TIER_CONFIG[1].gold} pts</span>
                <span>Silver: {TIER_CONFIG[1].silver} pts</span>
                <span>Bronze: {TIER_CONFIG[1].bronze} pt</span>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Tier 2 - Strong Contenders</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Japan, Finland, Australia, Great Britain, etc.
              </p>
              <div className="flex gap-4 text-sm">
                <span>Gold: {TIER_CONFIG[2].gold} pts</span>
                <span>Silver: {TIER_CONFIG[2].silver} pts</span>
                <span>Bronze: {TIER_CONFIG[2].bronze} pts</span>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Tier 3 - Underdogs</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Jamaica, Brazil, Mexico, and all other nations
              </p>
              <div className="flex gap-4 text-sm">
                <span>Gold: {TIER_CONFIG[3].gold} pts</span>
                <span>Silver: {TIER_CONFIG[3].silver} pts</span>
                <span>Bronze: {TIER_CONFIG[3].bronze} pts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
