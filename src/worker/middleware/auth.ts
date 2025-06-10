import type { HonoContext } from "@worker/types/hono";
import { createMiddleware } from "hono/factory";

export const requireAuth = () =>
	createMiddleware<HonoContext>(async (c, next) => {
		const user = c.get("user");

		if (!user) {
			return c.json({ error: "Unauthorized" }, 401);
		}

		return next();
	});
