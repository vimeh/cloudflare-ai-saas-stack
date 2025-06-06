import { LoginForm } from "@client/components/login-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="max-w-md mx-auto mt-8 px-4">
			<LoginForm />
		</div>
	);
}
