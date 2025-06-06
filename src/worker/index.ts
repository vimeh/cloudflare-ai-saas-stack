import { auth } from "@worker/auth";
import { postsRoute } from "@worker/routes/posts";
import type { HonoContext } from "@worker/types/hono";
import { Hono } from "hono";
import { logger } from "hono/logger";

const app = new Hono<HonoContext>();

app.use("*", logger());

const apiRoutes = app
	.basePath("/api")
	.get("/", (c) => c.text("Hello World"))
	.route("/posts", postsRoute)
	.all("/auth/*", (c) => {
		const authHandler = auth(c.env).handler;
		return authHandler(c.req.raw);
	});

export default app;
export type ApiRoutes = typeof apiRoutes;
