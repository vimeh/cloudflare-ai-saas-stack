import { requireAuth } from "@worker/middleware/auth";
import type { HonoContext } from "@worker/types/hono";
import { Hono } from "hono";

export const authDemoRoute = new Hono<HonoContext>()
	// Public route - no authentication required
	.get("/public", async (c) => {
		return c.json({ message: "This is a public endpoint" });
	})

	// Optional authentication - shows different content based on auth status
	.get("/optional", async (c) => {
		const user = c.get("user");
		const session = c.get("session");

		if (user && session) {
			return c.json({
				message: "Hello authenticated user!",
				user: user.email,
				sessionId: session.id,
			});
		}

		return c.json({ message: "Hello anonymous user!" });
	})

	// Protected route - authentication required
	.get("/protected", requireAuth(), async (c) => {
		const user = c.get("user");
		const session = c.get("session");

		if (!user || !session) {
			return c.json({ error: "Unauthorized" }, 401);
		}

		return c.json({
			message: "This is a protected endpoint",
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
			},
			session: {
				id: session.id,
				expiresAt: session.expiresAt,
			},
		});
	})

	// Get current user profile (protected)
	.get("/me", requireAuth(), async (c) => {
		const user = c.get("user");

		if (!user) {
			return c.json({ error: "Unauthorized" }, 401);
		}

		return c.json({
			id: user.id,
			email: user.email,
			name: user.name,
			createdAt: user.createdAt,
		});
	});
