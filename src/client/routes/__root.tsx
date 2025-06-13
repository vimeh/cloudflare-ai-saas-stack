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
import { MoonIcon, SunIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";

export interface RouterCtx {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterCtx>()({
	component: Root,
});

function ThemeToggle() {
	const [theme, setTheme] = useState(() => {
		if (typeof localStorage !== "undefined") {
			const storedTheme = localStorage.getItem("theme");
			if (storedTheme === "light" || storedTheme === "dark") {
				return storedTheme;
			}
		}
		// If no theme in localStorage, check system preference.
		// If system prefers light, use light. Otherwise, default to dark.
		if (window.matchMedia("(prefers-color-scheme: light)").matches) {
			return "light";
		}
		return "dark"; // Default to dark
	});

	useEffect(() => {
		const root = window.document.documentElement;
		if (theme === "dark") {
			root.classList.add("dark");
		} else {
			root.classList.remove("dark");
		}
		localStorage.setItem("theme", theme);
	}, [theme]);

	const toggleTheme = () => {
		setTheme(theme === "light" ? "dark" : "light");
	};

	return (
		<Button variant="ghost" size="icon" onClick={toggleTheme}>
			{theme === "light" ? (
				<MoonIcon className="h-5 w-5" />
			) : (
				<SunIcon className="h-5 w-5" />
			)}
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}

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
		<nav className="px-4 py-3 flex items-center justify-between border-b">
			<div className="flex items-center gap-4">
				<Link
					to="/"
					className="text-lg font-medium text-foreground/80 hover:text-foreground [&.active]:text-primary [&.active]:font-semibold"
				>
					MyApp
				</Link>{" "}
				{sessionData && user ? (
					<>
						<Link
							to="/profile"
							className="text-sm text-muted-foreground hover:text-foreground [&.active]:text-primary"
						>
							Profile
						</Link>
						<Link
							to="/create-post"
							className="text-sm text-muted-foreground hover:text-foreground [&.active]:text-primary"
						>
							Create Post
						</Link>
					</>
				) : null}
			</div>
			<div className="flex items-center gap-2">
				{sessionData && user ? (
					<div className="flex items-center gap-3">
						<span className="text-sm text-muted-foreground">
							Hello, {user.name || user.email}
						</span>
						<Button variant="outline" size="sm" onClick={handleLogout}>
							Logout
						</Button>
					</div>
				) : (
					<Link to="/login">
						<Button variant="outline" size="sm">
							Login
						</Button>
					</Link>
				)}
				<ThemeToggle />
			</div>
		</nav>
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
		<div className="min-h-screen flex flex-col">
			<NavBar />
			<main className="flex-grow p-4 md:p-6">
				<Outlet />
			</main>
			<Toaster position="top-right" />
		</div>
	);
}
