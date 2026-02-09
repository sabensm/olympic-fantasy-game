import { useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { OlympicRings } from "@/components/OlympicRings";
import { toast } from "sonner";
import { Plus, Link as LinkIcon, LogOut, Trophy, Trash2 } from "lucide-react";
import type { Id } from "../../convex/_generated/dataModel";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, signOut } = useAuth();
  const leagues = useQuery(
    api.leagues.getMyLeagues,
    isAuthenticated ? {} : "skip"
  );
  const createLeague = useMutation(api.leagues.createLeague);
  const deleteLeagueMutation = useMutation(api.leagues.deleteLeague);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newLeagueName, setNewLeagueName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: Id<"leagues">; name: string } | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-alpine flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-3 animate-float">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" />;
  }

  const handleCreateLeague = async () => {
    if (!newLeagueName.trim()) return;
    setIsCreating(true);
    try {
      const result = await createLeague({ name: newLeagueName.trim() });
      setNewLeagueName("");
      setIsCreateOpen(false);
      navigate(`/${result.slug}`);
    } catch (error) {
      toast.error("Failed to create league", {
        description: error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(url).then(
      () => toast.success("Link copied!", { description: url }),
      () => toast.error("Couldn't copy link", { description: url })
    );
  };

  const handleDeleteLeague = async () => {
    if (!deleteTarget) return;
    try {
      await deleteLeagueMutation({ leagueId: deleteTarget.id });
      toast.success("League deleted");
      setDeleteTarget(null);
    } catch (error) {
      toast.error("Failed to delete league", {
        description: error instanceof Error ? error.message : "Please try again",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen gradient-alpine">
      <header className="bg-gradient-to-r from-olympic-blue via-primary to-olympic-blue text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <OlympicRings size="sm" />
              <div>
                <h1 className="text-lg font-bold">Dashboard</h1>
                <p className="text-xs text-white/70">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-white hover:bg-white/20"
            >
              <LogOut className="w-4 h-4 mr-1.5" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">My Leagues</h2>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            New League
          </Button>
        </div>

        {leagues === undefined ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading leagues...</p>
          </div>
        ) : leagues.length === 0 ? (
          <div className="text-center py-16">
            <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">
              You haven't created any leagues yet.
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="w-4 h-4 mr-1.5" />
              Create Your First League
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {leagues.map((league) => (
              <div
                key={league._id}
                className="rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 p-5 hover:bg-card/80 transition-colors"
              >
                <Link to={`/${league.slug}`} className="block">
                  <h3 className="font-semibold text-lg mb-1">{league.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {league.teamCount} {league.teamCount === 1 ? "team" : "teams"}
                  </p>
                </Link>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate">
                    /{league.slug}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyLink(league.slug)}
                    aria-label="Copy league link"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteTarget({ id: league._id, name: league.name })}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    aria-label={`Delete ${league.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create League Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Create New League</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="league-name">League Name</Label>
              <Input
                id="league-name"
                value={newLeagueName}
                onChange={(e) => setNewLeagueName(e.target.value)}
                placeholder="e.g. Office Pool 2026"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateLeague();
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateLeague}
              disabled={!newLeagueName.trim() || isCreating}
            >
              {isCreating ? "Creating..." : "Create League"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{deleteTarget?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the league and all its teams. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteLeague}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete League
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
