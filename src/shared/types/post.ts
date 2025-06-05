import { insertPostSchema } from "@worker/db/schema/post";
import { z } from "zod";

export const createPostSchema = z.object({
	...insertPostSchema.pick({ title: true }).shape,
	title: z.string().min(5, "Title must be at least 5 characters long"),
});
