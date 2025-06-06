import { Button } from "@client/components/ui/button";
import { authClient } from "@client/lib/auth-client";
import {
	Link,
	Outlet,
	createRootRoute,
	useRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
	component: Root,
});

function NavBar() {
	const sessionState = authClient.useSession();
	const user = sessionState.data?.user;
	const router = useRouter();

	const handleLogout = async () => {
		try {
			await authClient.signOut({
				fetchOptions: {
					onSuccess: () => {
						router.navigate({ to: "/" });
					},
				},
			});
		} catch (error: unknown) {
			console.error("Logout failed or error during signOut call:", error);
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
				<Link to="/profile" className="[&.active]:font-bold">
					Profile
				</Link>
				<Link to="/create-post" className="[&.active]:font-bold">
					Create Post
				</Link>
			</div>
			<div>
				{user ? (
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
	return (
		<>
			<NavBar />
			<Outlet />
			<TanStackRouterDevtools />
		</>
	);
}
