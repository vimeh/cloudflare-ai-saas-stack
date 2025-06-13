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
		<div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] px-4">
			<div className="w-full max-w-md">
				<LoginForm />
			</div>
		</div>
	);
}
