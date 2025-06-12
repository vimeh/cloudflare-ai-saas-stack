import { RegisterForm } from "@client/components/register-form";
import { redirectIfAuthenticated } from "@client/lib/auth-utils";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/register")({
	loader: async ({ context }) => {
		await redirectIfAuthenticated(context.queryClient);
	},
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="max-w-md mx-auto mt-8 px-4">
			<RegisterForm />
		</div>
	);
}
