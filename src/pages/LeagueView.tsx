import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { Team } from "@/types/fantasy";
import { useFantasyData } from "@/hooks/useFantasyData";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/Header";
import { Leaderboard } from "@/components/Leaderboard";
import { CountryStandings } from "@/components/CountryStandings";
import { TeamEditor } from "@/components/TeamEditor";
import { TeamDetailSheet } from "@/components/TeamDetailSheet";
import { HeroBanner } from "@/components/HeroBanner";
import { Snowfall } from "@/components/Snowfall";
import { RulesModal } from "@/components/RulesModal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const LeagueView = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user, isAuthenticated } = useAuth();

  const league = useQuery(
    api.leagues.getLeagueBySlug,
    slug ? { slug } : "skip"
  );

  // League loading / not found states
  if (league === undefined) {
    return (
      <div className="min-h-screen gradient-alpine flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-3 animate-float">Loading...</div>
        </div>
      </div>
    );
  }

  if (league === null) {
    return (
      <div className="min-h-screen gradient-alpine flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">404</div>
          <p className="text-muted-foreground mb-4">League not found</p>
          <Link to="/" className="text-primary underline hover:text-primary/90">
            Return home
          </Link>
        </div>
      </div>
    );
  }

  const isAdmin = isAuthenticated && user?._id === league.adminId;

  return (
    <LeagueContent
      league={league}
      isAdmin={isAdmin}
      slug={slug!}
      isAuthenticated={isAuthenticated}
    />
  );
};

function LeagueContent({
  league,
  isAdmin,
  slug,
  isAuthenticated,
}: {
  league: { _id: any; name: string; adminId: any; slug: string };
  isAdmin: boolean;
  slug: string;
  isAuthenticated: boolean;
}) {
  const { teams, isLoading, lastMedalUpdate, addTeam, updateTeam, deleteTeam } =
    useFantasyData(league._id);

  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [detailTeam, setDetailTeam] = useState<Team | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("fantasy");

  const getLastUpdatedText = () => {
    if (!lastMedalUpdate) return null;
    try {
      return formatDistanceToNow(new Date(lastMedalUpdate), { addSuffix: true });
    } catch {
      return null;
    }
  };

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team);
    setIsEditorOpen(true);
  };

  const handleViewDetail = (team: Team) => {
    setDetailTeam(team);
    setIsDetailOpen(true);
  };

  const handleNewTeam = () => {
    setEditingTeam(null);
    setIsEditorOpen(true);
  };

  const handleSaveTeam = (teamData: any) => {
    if ("id" in teamData && teamData.id) {
      updateTeam(teamData.id, teamData);
    } else {
      addTeam(teamData);
    }
  };

  const handleDeleteTeam = () => {
    if (editingTeam) {
      deleteTeam(editingTeam.id);
    }
  };

  const assignedCountries = teams.flatMap((t) =>
    t.countries.map((c) => c.code)
  );

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-alpine flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-3 animate-float">Loading...</div>
          <p className="text-muted-foreground">Loading standings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-alpine relative">
      <Snowfall />
      <Header
        leagueName={league.name}
        slug={slug}
        isAdmin={isAdmin}
        isAuthenticated={isAuthenticated}
      />

      <main className="container mx-auto py-6 space-y-4 pb-24 relative z-10">
        <HeroBanner />

        <div className="px-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {lastMedalUpdate && (
                <span className="text-xs text-muted-foreground">
                  Updated {getLastUpdatedText()}
                </span>
              )}
              <RulesModal />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="fantasy" className="flex-1">Fantasy Standings</TabsTrigger>
              <TabsTrigger value="country" className="flex-1">Country Standings</TabsTrigger>
            </TabsList>

            <TabsContent value="fantasy">
              <Leaderboard
                teams={teams}
                isAdmin={isAdmin}
                onEditTeam={handleEditTeam}
                onViewDetail={handleViewDetail}
              />
            </TabsContent>

            <TabsContent value="country">
              <CountryStandings />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Floating Add Button (Admin Only) */}
      {isAdmin && (
        <Button
          onClick={handleNewTeam}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-elevated"
          size="icon"
        >
          <Plus className="w-6 h-6" />
        </Button>
      )}

      {/* Team Editor Modal */}
      <TeamEditor
        team={editingTeam}
        open={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveTeam}
        onDelete={editingTeam ? handleDeleteTeam : undefined}
        assignedCountries={
          editingTeam
            ? assignedCountries.filter(
                (code) => !editingTeam.countries.some((c) => c.code === code)
              )
            : assignedCountries
        }
      />

      {/* Team Detail Sheet */}
      <TeamDetailSheet
        team={detailTeam}
        open={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  );
}

export default LeagueView;
