import { Button } from "@client/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@client/components/ui/card";
import { Skeleton } from "@client/components/ui/skeleton";
import { useSessionQuery } from "@client/hooks/useSessionQuery";
import { api } from "@client/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: Index,
});

async function getPosts() {
	const res = await api.posts.$get();
	if (!res.ok) {
		throw new Error("server error");
	}
	const data = await res.json();
	return data;
}

interface Post {
	id: number;
	title: string;
	content: string;
	userId: string;
	createdAt: string;
	updatedAt: string;
}

function Index() {
	const { data: session, isPending: sessionPending } = useSessionQuery();

	const {
		isPending: postsPending,
		error,
		data,
	} = useQuery({
		queryKey: ["user-posts"],
		queryFn: getPosts,
		enabled: !!session, // Only fetch posts if user is authenticated
	});

	// Show loading state while checking authentication
	if (sessionPending) {
		return (
			<Card className="w-[600px] m-auto">
				<CardHeader>
					<CardTitle>Posts</CardTitle>
					<CardDescription>Loading...</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{Array.from({ length: 3 }, (_, i) => (
							<div
								key={`auth-skeleton-${Date.now()}-${i}`}
								className="flex items-center space-x-4"
							>
								<Skeleton className="h-12 w-12 rounded-full" />
								<div className="space-y-2">
									<Skeleton className="h-4 w-[250px]" />
									<Skeleton className="h-4 w-[200px]" />
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		);
	}

	// Show login prompt for unauthenticated users
	if (!session) {
		return (
			<Card className="w-[600px] m-auto">
				<CardHeader>
					<CardTitle>Welcome to Posts</CardTitle>
					<CardDescription>
						Please log in to see and create posts
					</CardDescription>
				</CardHeader>
				<CardContent className="text-center space-y-4">
					<p className="text-muted-foreground">
						You need to be logged in to view and manage your posts.
					</p>
					<div className="space-x-2">
						<Button asChild>
							<Link to="/login">Log In</Link>
						</Button>
						<Button variant="outline" asChild>
							<Link to="/register">Sign Up</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		);
	}

	// Handle API errors
	if (error) {
		return (
			<Card className="w-[600px] m-auto">
				<CardHeader>
					<CardTitle>Error</CardTitle>
					<CardDescription>Failed to load posts</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-red-600">Error: {error.message}</p>
					<Button className="mt-4" onClick={() => window.location.reload()}>
						Try Again
					</Button>
				</CardContent>
			</Card>
		);
	}

	// Show user's posts
	return (
		<Card className="w-[600px] m-auto">
			<CardHeader>
				<CardTitle>Your Posts</CardTitle>
				<CardDescription>
					Welcome back, {session.user.name || session.user.email}! Here are your
					posts.
				</CardDescription>
			</CardHeader>
			<CardContent>
				{postsPending ? (
					<div className="space-y-3">
						{Array.from({ length: 5 }, (_, i) => (
							<div
								key={`posts-skeleton-${Date.now()}-${i}`}
								className="flex items-center space-x-4"
							>
								<Skeleton className="h-12 w-12 rounded-full" />
								<div className="space-y-2">
									<Skeleton className="h-4 w-[250px]" />
									<Skeleton className="h-4 w-[200px]" />
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="space-y-4">
						<div className="space-y-3">
							{data?.posts && data.posts.length > 0 ? (
								data.posts.map((post: Post) => (
									<div key={post.id} className="p-3 border rounded-lg">
										<h3 className="font-medium">{post.title}</h3>
										<p className="text-sm text-muted-foreground mt-1">
											{new Date(post.createdAt).toLocaleDateString()}
										</p>
									</div>
								))
							) : (
								<div className="text-center py-8">
									<p className="text-muted-foreground mb-4">
										You haven't created any posts yet.
									</p>
									<Button asChild>
										<Link to="/create-post">Create Your First Post</Link>
									</Button>
								</div>
							)}
						</div>
						{data?.posts && data.posts.length > 0 && (
							<div className="border-t pt-3 mt-4 flex justify-between items-center">
								<p className="text-sm font-medium">
									Total Posts:{" "}
									<span className="text-primary">{data.posts.length}</span>
								</p>
								<Button asChild size="sm">
									<Link to="/create-post">Create New Post</Link>
								</Button>
							</div>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
}

export default Index;
