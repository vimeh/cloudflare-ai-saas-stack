import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@client/components/ui/card";
import { Skeleton } from "@client/components/ui/skeleton";
import { useSessionQuery } from "@client/hooks/useSessionQuery";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/profile")({
	component: Profile,
});

function ProfileInfoItem({
	label,
	value,
}: { label: string; value: React.ReactNode }) {
	return (
		<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b last:border-b-0">
			<p className="text-sm font-medium text-muted-foreground">{label}</p>
			<p className="text-sm text-foreground mt-1 sm:mt-0">{value}</p>
		</div>
	);
}

function Profile() {
	const { data: session, isLoading, error } = useSessionQuery();

	if (isLoading) {
		return (
			<div className="max-w-2xl mx-auto w-full">
				<Card>
					<CardHeader>
						<Skeleton className="h-8 w-1/2 mb-2" />
						<Skeleton className="h-4 w-3/4" />
					</CardHeader>
					<CardContent className="space-y-4">
						{Array.from({ length: 4 }).map((_, i) => (
							<div
								key={`profile-skeleton-${Date.now()}-${i}`} // Add Date.now() for better uniqueness
								className="flex justify-between py-3 border-b last:border-b-0"
							>
								<Skeleton className="h-5 w-1/4" />
								<Skeleton className="h-5 w-1/2" />
							</div>
						))}
					</CardContent>
				</Card>
			</div>
		);
	}

	if (error) {
		return (
			<div className="max-w-2xl mx-auto w-full">
				<Card>
					<CardHeader>
						<CardTitle>Error</CardTitle>
						<CardDescription>Failed to load profile</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-destructive">Error: {error.message}</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (!session?.user) {
		// Redirect or show login prompt if session or user is not available
		// This case should ideally be handled by the _authenticated route loader
		return (
			<div className="max-w-2xl mx-auto w-full text-center py-10">
				<p>Please log in to view your profile.</p>
				{/* Optionally, add a Link to login here */}
			</div>
		);
	}

	const { user } = session;

	return (
		<div className="max-w-2xl mx-auto w-full">
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl">User Profile</CardTitle>
					<CardDescription>
						View and manage your profile information.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-1">
						<ProfileInfoItem label="Name" value={user.name || "Not provided"} />
						<ProfileInfoItem label="Email" value={user.email} />
						<ProfileInfoItem
							label="Email Verified"
							value={user.emailVerified ? "Yes" : "No"}
						/>
						<ProfileInfoItem
							label="Member Since"
							value={new Date(user.createdAt).toLocaleDateString()}
						/>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
