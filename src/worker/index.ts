import { postsRoute } from "@worker/routes/posts";
import type { HonoContext } from "@worker/types/hono";
import { Hono } from "hono";
import { logger } from "hono/logger";

const app = new Hono<HonoContext>();

app.use("*", logger());

const apiRoutes = app
	.basePath("/api")
	.get("/", (c) => c.text("Hello World"))
	.route("/posts", postsRoute);

export default app;
export type ApiRoutes = typeof apiRoutes;
