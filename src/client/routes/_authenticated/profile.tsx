import { useSessionQuery } from "@client/hooks/useSessionQuery";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/profile")({
	component: Profile,
});

function Profile() {
	const { data: session, isLoading, error } = useSessionQuery();

	if (isLoading) {
		return <div>Loading user profile...</div>;
	}

	if (error) {
		return <div>Error loading profile: {error.message}</div>;
	}

	if (!session) {
		return <div>Please log in to view your profile</div>;
	}

	return (
		<div className="p-4 border rounded-lg">
			<h2 className="text-xl font-semibold mb-2">User Profile</h2>
			<div className="space-y-2">
				<p>
					<strong>Name:</strong> {session.user.name || "Not provided"}
				</p>
				<p>
					<strong>Email:</strong> {session.user.email}
				</p>
				<p>
					<strong>Email Verified:</strong>{" "}
					{session.user.emailVerified ? "Yes" : "No"}
				</p>
				<p>
					<strong>Member Since:</strong>{" "}
					{new Date(session.user.createdAt).toLocaleDateString()}
				</p>
			</div>
		</div>
	);
}
