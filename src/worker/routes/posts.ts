import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const postSchema = z.object({
  id: z.number().int().positive().min(1),
  title: z.string().min(1),
});

type Post = z.infer<typeof postSchema>;

const createPostSchema = postSchema.omit({ id: true });

const fakePosts: Post[] = [
  { id: 1, title: "Post One" },
  { id: 1, title: "Post One" },
  { id: 2, title: "Post Two" },
  { id: 3, title: "Post Three" },
];

export const postsRoute = new Hono()
  .get("/", (c) => {
    return c.json({ posts: fakePosts });
  })
  .post("/", zValidator("json", createPostSchema), async (c) => {
    const data = await c.req.json();
    fakePosts.push({
      id: fakePosts.length + 1,
      title: data.title,
    });
    c.status(201);
    return c.json(data);
  })
  .get("/total-posts", (c) => {
    return c.json({ totalPosts: fakePosts.length });
  })
  .get("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const post = fakePosts.find((b) => b.id === id);
    if (!post) {
      return c.notFound();
    }
    return c.json({ post });
  })
  .delete("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const index = fakePosts.findIndex((b) => b.id === id);
    if (index === -1) {
      return c.notFound();
    }
    const deletedPost = fakePosts.splice(index, 1)[0];
    return c.json({ post: deletedPost });
  });
