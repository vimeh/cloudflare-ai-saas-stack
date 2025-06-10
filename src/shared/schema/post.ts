import { insertPostSchema } from "@worker/db/schema/post";
import { z } from "zod";

export const createPostSchema = z.object({
	...insertPostSchema.pick({ title: true, content: true }).shape,
	title: z.string().min(5, "Title must be at least 5 characters long"),
	content: z.string().min(10, "Content must be at least 10 characters long"),
});
