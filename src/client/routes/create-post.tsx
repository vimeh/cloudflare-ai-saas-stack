import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/create-post")({
	component: CreatePost,
});

function CreatePost() {
	return <div className="p-2">Hello from CreatePost!</div>;
}
