import { zValidator } from "@hono/zod-validator";
import { createPostSchema } from "@shared/schema/post";
import { db } from "@worker/db";
import { postsTable } from "@worker/db/schema";
import { insertPostSchema } from "@worker/db/schema/post";
import { requireAuth } from "@worker/middleware";
import type { HonoContext } from "@worker/types/hono";
import { and, desc, eq } from "drizzle-orm";
import { Hono } from "hono";

export const postsRoute = new Hono<HonoContext>()
	.get("/", requireAuth(), async (c) => {
		const user = c.get("user");
		if (!user) {
			return c.json(
				{
					success: false,
					error: { code: "UNAUTHORIZED", message: "Unauthorized" },
				},
				401,
			);
		}

		const posts = await db(c.env)
			.select()
			.from(postsTable)
			.where(eq(postsTable.userId, user.id))
			.orderBy(desc(postsTable.createdAt))
			.limit(10);
		return c.json({ posts });
	})
	.post("/", requireAuth(), zValidator("json", createPostSchema), async (c) => {
		const user = c.get("user");
		if (!user) {
			return c.json(
				{
					success: false,
					error: { code: "UNAUTHORIZED", message: "Unauthorized" },
				},
				401,
			);
		}
		const data = c.req.valid("json");

		try {
			const validatedData = insertPostSchema.parse({
				...data,
				userId: user.id,
				createdAt: new Date(),
				updatedAt: new Date(),
			});

			await db(c.env).insert(postsTable).values(validatedData);
			return c.json(
				{ success: true, message: "Post created successfully" },
				201,
			);
		} catch (_error) {
			return c.json(
				{
					success: false,
					error: {
						code: "INTERNAL_SERVER_ERROR",
						message: "Failed to create post. Please try again.",
					},
				},
				500,
			);
		}
	})
	.get("/:id{[0-9]+}", requireAuth(), async (c) => {
		const user = c.get("user");
		if (!user) {
			return c.json(
				{
					success: false,
					error: { code: "UNAUTHORIZED", message: "Unauthorized" },
				},
				401,
			);
		}

		const id = Number.parseInt(c.req.param("id"));
		if (Number.isNaN(id)) {
			return c.json(
				{
					success: false,
					error: { code: "INVALID_INPUT", message: "Invalid post ID format." },
				},
				400,
			);
		}

		const post = await db(c.env)
			.select()
			.from(postsTable)
			.where(and(eq(postsTable.id, id), eq(postsTable.userId, user.id)))
			.get();

		if (!post) {
			return c.json(
				{
					success: false,
					error: { code: "NOT_FOUND", message: "Post not found." },
				},
				404,
			);
		}
		return c.json({ success: true, data: post });
	})
	.delete("/:id{[0-9]+}", requireAuth(), async (c) => {
		const user = c.get("user");
		if (!user) {
			return c.json(
				{
					success: false,
					error: { code: "UNAUTHORIZED", message: "Unauthorized" },
				},
				401,
			);
		}

		const id = Number.parseInt(c.req.param("id"));
		if (Number.isNaN(id)) {
			return c.json(
				{
					success: false,
					error: { code: "INVALID_INPUT", message: "Invalid post ID format." },
				},
				400,
			);
		}

		try {
			const deletedPosts = await db(c.env)
				.delete(postsTable)
				.where(and(eq(postsTable.id, id), eq(postsTable.userId, user.id)))
				.returning({ id: postsTable.id });

			if (deletedPosts.length === 0) {
				return c.json(
					{
						success: false,
						error: {
							code: "NOT_FOUND",
							message: "Post not found or not authorized to delete.",
						},
					},
					404,
				);
			}

			return c.json({ success: true, message: "Post deleted successfully." });
		} catch (_error) {
			return c.json(
				{
					success: false,
					error: {
						code: "INTERNAL_SERVER_ERROR",
						message: "Failed to delete post. Please try again.",
					},
				},
				500,
			);
		}
	});
