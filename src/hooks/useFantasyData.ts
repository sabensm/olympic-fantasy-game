import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Team, TieredCountry, MedalCount, TierMedalBreakdown, CountryMedalData, calculateCountryPoints } from "@/types/fantasy";
import { getCountryTier, TierLevel } from "@/data/countryTiers";
import type { Id } from "../../convex/_generated/dataModel";

const buildTierBreakdown = (
  countries: TieredCountry[],
  medalLookup: Map<string, MedalCount>
): TierMedalBreakdown[] => {
  const tierMap = new Map<TierLevel, CountryMedalData[]>();

  ([1, 2, 3] as TierLevel[]).forEach(tier => {
    tierMap.set(tier, []);
  });

  countries.forEach(country => {
    const medals = medalLookup.get(country.code) || { gold: 0, silver: 0, bronze: 0 };
    const points = calculateCountryPoints(country.code, medals);

    tierMap.get(country.tier)!.push({
      country,
      medals,
      points,
    });
  });

  const breakdown: TierMedalBreakdown[] = [];

  ([1, 2, 3] as TierLevel[]).forEach(tier => {
    const countryData = tierMap.get(tier)!;
    if (countryData.length === 0) return;

    const totalMedals: MedalCount = { gold: 0, silver: 0, bronze: 0 };
    let totalPoints = 0;

    countryData.forEach(cd => {
      totalMedals.gold += cd.medals.gold;
      totalMedals.silver += cd.medals.silver;
      totalMedals.bronze += cd.medals.bronze;
      totalPoints += cd.points;
    });

    breakdown.push({
      tier,
      countries: countryData,
      totalMedals,
      totalPoints,
    });
  });

  return breakdown;
};

export const useFantasyData = (leagueId: Id<"leagues">) => {
  const teamsData = useQuery(api.teams.listTeams, { leagueId });
  const medalsData = useQuery(api.medals.getMedalTable);
  const addTeamMutation = useMutation(api.teams.addTeam);
  const updateTeamMutation = useMutation(api.teams.updateTeam);
  const deleteTeamMutation = useMutation(api.teams.deleteTeam);

  const isLoading = teamsData === undefined || medalsData === undefined;

  // Build medal lookup
  const medalLookup = new Map<string, MedalCount>();
  if (medalsData) {
    medalsData.forEach((medal) => {
      medalLookup.set(medal.countryCode, {
        gold: medal.gold,
        silver: medal.silver,
        bronze: medal.bronze,
      });
    });
  }

  // Get last medal update timestamp
  const lastMedalUpdate = medalsData && medalsData.length > 0
    ? new Date(medalsData[0].scrapedAt).toISOString()
    : null;

  // Transform to Team format
  const teams: Team[] = (teamsData || []).map((team) => {
    const countries: TieredCountry[] = team.countries.map((tc) => ({
      code: tc.countryCode,
      name: tc.countryName,
      flag: tc.countryFlag,
      tier: getCountryTier(tc.countryCode),
    }));

    const medals: MedalCount = { gold: 0, silver: 0, bronze: 0 };
    countries.forEach((country) => {
      const countryMedals = medalLookup.get(country.code);
      if (countryMedals) {
        medals.gold += countryMedals.gold;
        medals.silver += countryMedals.silver;
        medals.bronze += countryMedals.bronze;
      }
    });

    const tierBreakdown = buildTierBreakdown(countries, medalLookup);
    const totalPoints = tierBreakdown.reduce((sum, tb) => sum + tb.totalPoints, 0);

    return {
      id: team._id,
      name: team.name,
      avatar: team.avatar,
      members: team.members,
      countries,
      medals,
      tierBreakdown,
      totalPoints,
    };
  });

  const addTeam = async (team: Omit<Team, "id">) => {
    await addTeamMutation({
      leagueId,
      name: team.name,
      avatar: team.avatar,
      members: team.members,
      countries: team.countries.map((c) => ({
        countryCode: c.code,
        countryName: c.name,
        countryFlag: c.flag,
      })),
    });
  };

  const updateTeam = async (id: string, updates: Partial<Team>) => {
    await updateTeamMutation({
      id: id as Id<"teams">,
      name: updates.name!,
      avatar: updates.avatar!,
      members: updates.members!,
      countries: (updates.countries || []).map((c) => ({
        countryCode: c.code,
        countryName: c.name,
        countryFlag: c.flag,
      })),
    });
  };

  const deleteTeam = async (id: string) => {
    await deleteTeamMutation({ id: id as Id<"teams"> });
  };

  const refreshMedals = async () => {
    // No-op: Convex queries are reactive and auto-update
  };

  return {
    teams,
    isLoading,
    lastMedalUpdate,
    addTeam,
    updateTeam,
    deleteTeam,
    refreshMedals,
  };
};
