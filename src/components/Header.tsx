import { useState } from "react";
import { Link } from "react-router-dom";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ShareButton } from "./ShareButton";
import { Button } from "./ui/button";
import { Shield, RefreshCw, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";
import milanCortinaLogo from "@/assets/milan-cortina-2026-logo.svg";

interface HeaderProps {
  leagueName?: string;
  slug?: string;
  isAdmin: boolean;
  isAuthenticated: boolean;
}

export const Header = ({ leagueName, slug, isAdmin, isAuthenticated }: HeaderProps) => {
  const scrapeWikipedia = useAction(api.scrape.scrapeWikipedia);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await scrapeWikipedia();
      toast.success("Medals synced!", {
        description: "Medal data updated from Wikipedia.",
      });
    } catch (error) {
      console.error("Sync failed:", error);
      toast.error("Sync failed", {
        description: "Could not fetch medal data - please try again",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <header className="bg-gradient-to-r from-olympic-blue via-primary to-olympic-blue text-white relative overflow-hidden">
      {/* Subtle animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-white rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 py-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={milanCortinaLogo}
              alt="Milan Cortina 2026"
              className="h-12 w-auto drop-shadow-lg"
            />
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                {leagueName || "Milan Cortina 2026"}
              </h1>
              <p className="text-xs text-white/70">
                {leagueName ? "Milan Cortina 2026 Fantasy" : "Fantasy Draft Tracker"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Share button - admin only */}
            {isAdmin && slug && (
              <ShareButton slug={slug} className="text-white hover:bg-white/20" />
            )}

            {/* Sync button - admin only */}
            {isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSync}
                disabled={isSyncing}
                className="text-white hover:bg-white/20"
                title="Sync medal counts from Wikipedia"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline ml-1.5">
                  {isSyncing ? 'Syncing...' : 'Sync'}
                </span>
              </Button>
            )}

            {/* Dashboard link for authenticated users */}
            {isAuthenticated && (
              <Link to="/dashboard">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                  title="Dashboard"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline ml-1.5">Dashboard</span>
                </Button>
              </Link>
            )}

            {isAdmin && (
              <span className="flex items-center gap-1.5 text-xs bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                <Shield className="w-3 h-3" />
                Admin
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
