import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@client/components/ui/card";
import { Skeleton } from "@client/components/ui/skeleton";
import { api } from "@client/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

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
	id?: number;
	title?: string;
}

function Index() {
	const { isPending, error, data } = useQuery({
		queryKey: ["total-posts"],
		queryFn: getPosts,
	});

	if (error) {
		return <p>Error: {error.message}</p>;
	}

	return (
		<Card className="w-[600px] m-auto">
			<CardHeader>
				<CardTitle>Posts</CardTitle>
				<CardDescription>All posts in the system</CardDescription>
			</CardHeader>
			<CardContent>
				{isPending ? (
					<div className="space-y-3">
						{[...Array(5)].map((_, i) => (
							<div
								key={`skeleton-${i}`}
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
							{data.posts.length > 0 ? (
								data.posts.map((post: Post) => {
									return (
										<div key={post.id} className="p-3 border rounded-lg">
											<h3 className="font-medium">{post.title}</h3>
										</div>
									);
								})
							) : (
								<p className="text-muted-foreground">No posts found</p>
							)}
						</div>
						<div className="border-t pt-3 mt-4">
							<p className="text-sm font-medium">
								Total Posts:{" "}
								<span className="text-primary">{data.posts.length}</span>
							</p>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

export default Index;
