import { mysqlTable, mysqlEnum, int, varchar, text, timestamp} from "drizzle-orm/mysql-core";

export const POST_STATUS = ["draft", "published"] as const;

// CATEGORY
export const categoryTable = mysqlTable("category", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updateAt: timestamp("update_at").defaultNow().onUpdateNow(),
});

// POST
export const postsTable = mysqlTable("post", {
  id: int("id").autoincrement().primaryKey(),

  categoryId: int("category_id")
    .notNull()
    .references(() => categoryTable.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),

  title: varchar("title", { length: 225 }).notNull(),
  content: text("content").notNull(),
  author: varchar("author", { length: 100 }).notNull(),

  imageUrl: text("image_url"),
  imagePublicId: varchar("image_public_id", { length: 255 }),

  status: mysqlEnum("status", ["delete", "published"])
    .notNull()
    .default("published"),

  createdAt: timestamp("created_at").defaultNow(),
  updateAt: timestamp("update_at").defaultNow().onUpdateNow(),
});
