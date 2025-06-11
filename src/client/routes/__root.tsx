import { Button } from "@client/components/ui/button";
import { useSessionQuery } from "@client/hooks/useSessionQuery";
import { authClient } from "@client/lib/auth-client";
import { useQueryClient } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";
import {
	Link,
	Outlet,
	createRootRouteWithContext,
	useRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useEffect } from "react";
import { Toaster, toast } from "sonner";

export interface RouterCtx {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterCtx>()({
	component: Root,
});

function NavBar() {
	const { data: sessionData } = useSessionQuery();
	const user = sessionData?.user;
	const router = useRouter();
	const queryClient = useQueryClient();

	const handleLogout = async () => {
		try {
			await authClient.signOut({
				fetchOptions: {
					onSuccess: () => {
						queryClient.invalidateQueries({ queryKey: ["session"] });
						router.navigate({ to: "/" });
					},
				},
			});
		} catch (error: unknown) {
			console.error("Logout failed or error during signOut call:", error);
			// Always invalidate session on logout attempt
			queryClient.invalidateQueries({ queryKey: ["session"] });
			if (router.state.location.pathname !== "/") {
				router.navigate({ to: "/" });
			}
		}
	};

	return (
		<div className="p-2 flex items-center justify-between">
			<div className="flex gap-2">
				<Link to="/" className="[&.active]:font-bold">
					Home
				</Link>{" "}
				{sessionData && user ? (
					<>
						<Link to="/profile" className="[&.active]:font-bold">
							Profile
						</Link>
						<Link to="/create-post" className="[&.active]:font-bold">
							Create Post
						</Link>
					</>
				) : null}
			</div>
			<div>
				{sessionData && user ? (
					<div className="flex items-center gap-2">
						<span>Hello, {user.name || user.email}</span>
						<Button variant="outline" onClick={handleLogout}>
							Logout
						</Button>
					</div>
				) : (
					<Link to="/login">
						<Button variant="outline">Login</Button>
					</Link>
				)}
			</div>
		</div>
	);
}

function Root() {
	const router = useRouter();

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const error = params.get("error");

		if (error) {
			toast.error(`Authentication failed: ${error}`);

			// Clean up URL
			router.navigate({ to: "/", replace: true });
		}
	}, [router]);

	return (
		<>
			<NavBar />
			<Outlet />
			<Toaster position="top-right" />
			<TanStackRouterDevtools />
		</>
	);
}
