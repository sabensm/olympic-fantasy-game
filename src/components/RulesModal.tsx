import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { TIER_CONFIG } from "@/data/countryTiers";

export const RulesModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <HelpCircle className="w-4 h-4" />
          Rules
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Fantasy Scoring Rules</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-2">
          <p className="text-sm text-muted-foreground">
            Countries are grouped into tiers based on their winter sports strength. 
            Underdog nations earn more points per medal!
          </p>

          <div className="space-y-3">
            {/* Tier 1 */}
            <div className="rounded-lg border bg-card p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-foreground">Tier 1</span>
                <span className="text-xs text-muted-foreground">Top Nations</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Norway, Canada, Germany, USA, etc.
              </p>
              <div className="flex gap-3 text-sm">
                <span>🥇 {TIER_CONFIG[1].gold} pts</span>
                <span>🥈 {TIER_CONFIG[1].silver} pts</span>
                <span>🥉 {TIER_CONFIG[1].bronze} pt</span>
              </div>
            </div>

            {/* Tier 2 */}
            <div className="rounded-lg border bg-card p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-foreground">Tier 2</span>
                <span className="text-xs text-muted-foreground">Strong Contenders</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Japan, Finland, Australia, Great Britain, etc.
              </p>
              <div className="flex gap-3 text-sm">
                <span>🥇 {TIER_CONFIG[2].gold} pts</span>
                <span>🥈 {TIER_CONFIG[2].silver} pts</span>
                <span>🥉 {TIER_CONFIG[2].bronze} pts</span>
              </div>
            </div>

            {/* Tier 3 */}
            <div className="rounded-lg border bg-card p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-foreground">Tier 3</span>
                <span className="text-xs text-muted-foreground">Underdogs</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Jamaica, Brazil, Mexico, and all other nations
              </p>
              <div className="flex gap-3 text-sm">
                <span>🥇 {TIER_CONFIG[3].gold} pts</span>
                <span>🥈 {TIER_CONFIG[3].silver} pts</span>
                <span>🥉 {TIER_CONFIG[3].bronze} pts</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center pt-2">
            Tap any team card to see their detailed scoring breakdown
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
