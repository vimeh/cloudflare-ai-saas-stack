import { zValidator } from "@hono/zod-validator";
import { generateContentRequestSchema } from "@shared/schema/ai";
import { requireAuth } from "@worker/middleware";
import type { HonoContext } from "@worker/types/hono";
import { generateText } from "ai";
import { Hono } from "hono";
import { createWorkersAI } from "workers-ai-provider";

export const aiRoute = new Hono<HonoContext>().post(
	"/generate-content",
	requireAuth(),
	zValidator("json", generateContentRequestSchema),
	async (c) => {
		const { title } = await c.req.json();

		try {
			const workersai = createWorkersAI({ binding: c.env.AI });
			const result = await generateText({
				model: workersai("@cf/meta/llama-3.2-1b-instruct"),
				prompt: `Write a single paragraph (maximum 200 words) expanding on this topic: "${title}". Make it informative and engaging. Do not include a title or heading.`,
				maxTokens: 250,
				temperature: 0.7,
			});

			return c.json({
				content: result.text,
				success: true,
			});
		} catch (error) {
			console.error("AI generation error:", error);
			return c.json(
				{
					error: "Failed to generate content. Please try again.",
					success: false,
				},
				500,
			);
		}
	},
);
