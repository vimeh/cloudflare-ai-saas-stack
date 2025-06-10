import { authClient } from "@client/lib/auth-client";
import { useQuery } from "@tanstack/react-query";

export const useSessionQuery = () =>
	useQuery({
		queryKey: ["session"],
		queryFn: async () => {
			const result = await authClient.getSession();
			return result.data || null;
		},
		staleTime: 1000 * 60 * 5, // 5 minutes
		retry: (failureCount, error) => {
			// Don't retry on 401/403 errors
			if (error && typeof error === "object" && "status" in error) {
				const status = error.status;
				if (status === 401 || status === 403) {
					return false;
				}
			}
			return failureCount < 3;
		},
	});
