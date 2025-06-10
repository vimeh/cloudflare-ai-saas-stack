import { LoginForm } from "@client/components/login-form";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const loginSearchSchema = z.object({
	redirect: z.string().optional(),
});

export const Route = createFileRoute("/login")({
	validateSearch: loginSearchSchema,
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="max-w-md mx-auto mt-8 px-4">
			<LoginForm />
		</div>
	);
}
