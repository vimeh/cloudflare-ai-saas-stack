import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/api/auth/callback/$provider")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = Route.useNavigate();
	const { provider } = Route.useParams();
	const queryClient = useQueryClient();

	/**
	 * Making the request from the client to the backend API for OAuth Callback
	 * Read more: https://github.com/cloudflare/workers-sdk/issues/8798
	 * https://github.com/cloudflare/workers-sdk/issues/8879
	 *
	 * Should be removed once this proposal is implemented:
	 * https://github.com/cloudflare/workers-sdk/discussions/9143#discussioncomment-13315288
	 */
	useEffect(() => {
		const handleOAuthCallback = async () => {
			try {
				// Get the callback params from the current URL
				const currentUrl = new URL(window.location.href);
				const callbackParams = currentUrl.search;

				// Make a request to the backend API with the same params
				const apiUrl = `/api/auth/callback/${provider}${callbackParams}`;
				const response = await fetch(apiUrl);

				if (!response.ok) {
					throw new Error(`HTTP error: ${response.status}`);
				}

				// Get the redirect URL from the response
				const redirectUrl = response.url;
				console.log("redirectUrl", redirectUrl);
				const url = new URL(redirectUrl);
				const searchParams = new URLSearchParams(url.search);

				const error = searchParams.get("error");
				const errorDescription = searchParams.get("error_description");

				if (error) {
					alert(
						`Error: ${[error, errorDescription].filter(Boolean).join(" - ")}`,
					);
					void navigate({ to: "/", replace: true });
					return;
				}

				queryClient.invalidateQueries({ queryKey: ["session"] });

				// Navigate to the appropriate route based on the response
				void navigate({
					href: `${url.pathname}${url.search}`,
					replace: true,
				});
			} catch (error) {
				console.error("Error during OAuth callback:", error);
				alert("Something went wrong during login");
				void navigate({ to: "/", replace: true });
			}
		};

		void handleOAuthCallback();
	}, [provider, navigate, queryClient]);

	return (
		<div className="flex h-screen w-screen items-center justify-center">
			<div className="flex cursor-default items-center gap-2 rounded-sm border px-3 py-2">
				<div className="animate-spin mr-2">⟳</div>
				<div>Logging in...</div>
			</div>
		</div>
	);
}
