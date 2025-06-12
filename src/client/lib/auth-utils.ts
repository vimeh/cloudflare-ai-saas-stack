import { authClient } from "@client/lib/auth-client";
import type { QueryClient } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";

/**
 * Checks if user is authenticated and redirects to home if they are.
 * Use this in routes like /login and /register where authenticated users shouldn't have access.
 * This can be used in Router `loader` functions unlike `useSessionQuery` which can be used in components.
 */
export const redirectIfAuthenticated = async (queryClient: QueryClient) => {
	const session = await queryClient.ensureQueryData({
		queryKey: ["session"],
		queryFn: async () => {
			const result = await authClient.getSession();
			return result.data || null;
		},
	});

	if (session?.user) {
		throw redirect({ to: "/", replace: true });
	}
};
