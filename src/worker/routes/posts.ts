import { zValidator } from "@hono/zod-validator";
import { createPostSchema } from "@shared/schema/post";
import { db } from "@worker/db";
import { postsTable } from "@worker/db/schema";
import { insertPostSchema } from "@worker/db/schema/post";
import { requireAuth } from "@worker/middleware";
import type { HonoContext } from "@worker/types/hono";
import { desc, eq } from "drizzle-orm";
import { Hono } from "hono";

export const postsRoute = new Hono<HonoContext>()
	.get("/", async (c) => {
		const posts = await db(c.env)
			.select()
			.from(postsTable)
			.orderBy(desc(postsTable.createdAt))
			.limit(10);
		return c.json({ posts });
	})
	.post("/", requireAuth(), zValidator("json", createPostSchema), async (c) => {
		const user = c.get("user");
		const data = await c.req.json();

		try {
			const validatedData = insertPostSchema.parse({
				...data,
				userId: user?.id,
				createdAt: new Date(),
				updatedAt: new Date(),
			});

			await db(c.env).insert(postsTable).values(validatedData);
			c.status(201);
			return c.json({ success: true, message: "Post created successfully" });
		} catch (error) {
			console.error("Error creating post:", error);

			// Generic server error
			c.status(500);
			return c.json({
				success: false,
				error: { message: "Failed to create post. Please try again." },
			});
		}
	})
	.get("/:id{[0-9]+}", async (c) => {
		const id = Number.parseInt(c.req.param("id"));
		const post = await db(c.env)
			.select()
			.from(postsTable)
			.where(eq(postsTable.id, id))
			.get();
		if (!post) {
			return c.notFound();
		}
		return c.json({ post });
	})
	.delete("/:id{[0-9]+}", requireAuth(), async (c) => {
		const id = Number.parseInt(c.req.param("id"));

		const deletedPost = await db(c.env)
			.delete(postsTable)
			.where(eq(postsTable.id, id))
			.get();
		if (!deletedPost) {
			return c.notFound();
		}
		return c.json({ success: true });
	});
