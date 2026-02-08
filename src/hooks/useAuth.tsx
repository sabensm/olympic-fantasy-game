import { useConvexAuth, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../convex/_generated/api";

export const useAuth = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signIn, signOut } = useAuthActions();
  const user = useQuery(
    api.users.currentUser,
    isAuthenticated ? {} : "skip"
  );

  return {
    user: user ?? null,
    isAuthenticated,
    isLoading,
    signIn,
    signOut,
  };
};
