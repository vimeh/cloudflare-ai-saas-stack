import { LoginForm } from "@client/components/login-form";
import { redirectIfAuthenticated } from "@client/lib/auth-utils";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const loginSearchSchema = z.object({
	redirect: z.string().optional(),
});

export const Route = createFileRoute("/login")({
	validateSearch: loginSearchSchema,
	loader: async ({ context }) => {
		await redirectIfAuthenticated(context.queryClient);
	},
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="max-w-md mx-auto mt-8 px-4">
			<LoginForm />
		</div>
	);
}
