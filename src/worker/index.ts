import { postsRoute } from "@worker/routes/posts";
import { Hono } from "hono";
import { logger } from "hono/logger";

const app = new Hono<{ Bindings: Env }>();

app.use("*", logger());

const apiRoutes = app
	.basePath("/api")
	.get("/", (c) => c.text("Hello World"))
	.route("/posts", postsRoute);

export default app;
export type ApiRoutes = typeof apiRoutes;
