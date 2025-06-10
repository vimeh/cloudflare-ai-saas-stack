import { auth } from "@worker/auth";
import type { HonoContext } from "@worker/types/hono";
import { createMiddleware } from "hono/factory";

export const sessionMiddleware = () =>
	createMiddleware<HonoContext>(async (c, next) => {
		const session = await auth(c.env).api.getSession({
			headers: c.req.raw.headers,
		});

		if (!session) {
			c.set("user", null);
			c.set("session", null);
			return next();
		}

		c.set("user", session.user);
		c.set("session", session.session);
		return next();
	});
