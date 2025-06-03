import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@client/components/ui/card";
import { api } from "@client/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: Index,
});

async function getTotalPosts() {
	const res = await api.posts["total-posts"].$get();
	if (!res.ok) {
		throw new Error("server error");
	}
	const data = await res.json();
	return data;
}

function Index() {
	const { isPending, error, data } = useQuery({
		queryKey: ["total-posts"],
		queryFn: getTotalPosts,
	});

	if (error) {
		return <p>Error: {error.message}</p>;
	}

	return (
		<Card className="w-[300px] m-auto">
			<CardHeader>
				<CardTitle>Total Posts</CardTitle>
				<CardDescription>Number of posts</CardDescription>
			</CardHeader>
			<CardContent>
				<p>{isPending ? "Loading..." : data.totalPosts}</p>
			</CardContent>
		</Card>
	);
}

export default Index;
