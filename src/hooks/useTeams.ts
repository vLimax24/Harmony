import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";

export const useTeams = () => {
  const teams = useQuery(api.teams.getTeamsForUser) || [];
  return teams;
};
