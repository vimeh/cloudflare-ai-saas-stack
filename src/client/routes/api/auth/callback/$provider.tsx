import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Making the request from the client to the backend API for OAuth Callback
 * Read more: https://github.com/cloudflare/workers-sdk/issues/8798
 * https://github.com/cloudflare/workers-sdk/issues/8879
 *
 * Should be removed once this proposal is implemented:
 * https://github.com/cloudflare/workers-sdk/discussions/9143#discussioncomment-13315288
 */
export const Route = createFileRoute("/api/auth/callback/$provider")({
	loader: async () => {
		const res = await fetch(window.location.href, {
			credentials: "include",
		});

		const targetUrl = new URL(res.url);
		const searchParams = targetUrl.searchParams;
		const error = searchParams.get("error");

		if (error) {
			throw redirect({
				to: "/",
				search: {
					error,
				},
				replace: true,
			});
		}

		throw redirect({
			to: targetUrl.pathname + targetUrl.search,
			replace: true,
		});
	},

	pendingComponent: () => (
		<div className="flex h-screen w-screen items-center justify-center">
			<div className="flex items-center gap-2 rounded-sm border px-3 py-2">
				<span className="animate-spin mr-2">⟳</span> Logging in…
			</div>
		</div>
	),

	component: () => null, // component never renders if redirect succeeds
});
