import { redirectIfAuthenticated } from "@client/lib/auth-utils";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/register")({
	loader: async ({ context }) => {
		await redirectIfAuthenticated(context.queryClient);
		// Redirect to login since email/password registration is disabled for demo
		throw redirect({
			to: "/login",
		});
	},
	component: RouteComponent,
});

function RouteComponent() {
	// This component should never render due to the redirect in loader
	// return (
	// 	<div className="max-w-md mx-auto mt-8 px-4">
	// 		<RegisterForm />
	// 	</div>
	// );
	return null;
}
