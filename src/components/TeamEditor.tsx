import { useState, useEffect } from "react";
import { Team, Country } from "@/types/fantasy";
import { AVAILABLE_COUNTRIES, TEAM_AVATARS } from "@/data/countries";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
import { CountryPicker } from "./CountryPicker";

// TeamEditor only deals with basic team data - tierBreakdown/totalPoints are computed in the hook
interface TeamEditorSaveData {
  name: string;
  avatar: string;
  members: string[];
  countries: Country[];
  id?: string;
}

interface TeamEditorProps {
  team: Team | null;
  open: boolean;
  onClose: () => void;
  onSave: (team: TeamEditorSaveData) => void;
  onDelete?: () => void;
  assignedCountries: string[];
}

export const TeamEditor = ({
  team,
  open,
  onClose,
  onSave,
  onDelete,
  assignedCountries,
}: TeamEditorProps) => {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("⛷️");
  const [members, setMembers] = useState("");
  const [selectedCountries, setSelectedCountries] = useState<Country[]>([]);

  useEffect(() => {
    if (team) {
      setName(team.name);
      setAvatar(team.avatar);
      setMembers(team.members?.join(", ") || "");
      setSelectedCountries(team.countries);
    } else {
      setName("");
      setAvatar("⛷️");
      setMembers("");
      setSelectedCountries([]);
    }
  }, [team, open]);

  const toggleCountry = (country: Country) => {
    setSelectedCountries((prev) =>
      prev.some((c) => c.code === country.code)
        ? prev.filter((c) => c.code !== country.code)
        : [...prev, country]
    );
  };

  const handleSave = () => {
    if (!name.trim()) return;

    const parsedMembers = members
      .split(",")
      .map((m) => m.trim())
      .filter((m) => m.length > 0);

    const teamData = {
      name: name.trim(),
      avatar,
      members: parsedMembers,
      countries: selectedCountries,
    };

    if (team) {
      onSave({ ...teamData, id: team.id });
    } else {
      onSave(teamData);
    }
    onClose();
  };

  const availableForSelection = AVAILABLE_COUNTRIES.filter(
    (c) =>
      !assignedCountries.includes(c.code) ||
      selectedCountries.some((sc) => sc.code === c.code)
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {team ? "Edit Team" : "Create New Team"}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4 p-1">
            {/* Team Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Team Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter team name"
              />
            </div>

            {/* Team Members */}
            <div className="space-y-2">
              <Label htmlFor="members">Team Members</Label>
              <Input
                id="members"
                value={members}
                onChange={(e) => setMembers(e.target.value)}
                placeholder="Bob, Steve, Mike (comma-separated)"
              />
              <p className="text-xs text-muted-foreground">
                Enter names separated by commas
              </p>
            </div>

            {/* Avatar Selection */}
            <div className="space-y-2">
              <Label>Avatar</Label>
              <div className="flex flex-wrap gap-2">
                {TEAM_AVATARS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setAvatar(emoji)}
                    className={cn(
                      "w-10 h-10 text-xl rounded-lg transition-all",
                      avatar === emoji
                        ? "bg-primary/20 ring-2 ring-primary"
                        : "bg-secondary hover:bg-secondary/80"
                    )}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Country Selection */}
            <CountryPicker
              availableCountries={availableForSelection}
              selectedCountries={selectedCountries}
              onToggleCountry={toggleCountry}
            />
          </div>
        </ScrollArea>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          {team && onDelete && (
            <Button
              variant="destructive"
              onClick={() => {
                onDelete();
                onClose();
              }}
              className="w-full sm:w-auto"
            >
              Delete Team
            </Button>
          )}
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!name.trim()} className="flex-1">
              {team ? "Save Changes" : "Create Team"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
