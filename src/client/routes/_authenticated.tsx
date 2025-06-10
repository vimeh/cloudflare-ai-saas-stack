import { authClient } from "@client/lib/auth-client";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async ({ location }) => {
		// Check if user is authenticated using Better Auth client
		const session = await authClient.getSession();

		if (!session.data) {
			// Redirect to login with the current location for post-login redirect
			throw redirect({
				to: "/login",
				search: {
					redirect: location.href,
				},
			});
		}
	},
	component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
	return <Outlet />;
}
