import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const postsTable = sqliteTable("posts", {
	id: int("id").primaryKey({ autoIncrement: true }),
	title: text("title").notNull(),
});
