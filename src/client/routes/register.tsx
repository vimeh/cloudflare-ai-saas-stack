import { RegisterForm } from "@client/components/register-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/register")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="max-w-md mx-auto mt-8 px-4">
			<RegisterForm />
		</div>
	);
}
