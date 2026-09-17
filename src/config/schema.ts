import {
  mysqlTable,
  mysqlEnum,
  int,
  varchar,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/mysql-core";

export const POST_STATUS = ["draft", "published"] as const;

// USER
export const usersTable = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  username: varchar("username", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 })
    .notNull()
    .unique(),
  imageProfile: text("image_profile"),
  createdAt: timestamp("created_at").defaultNow(),
  updateAt: timestamp("update_at").defaultNow().onUpdateNow(),
});

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
  authorId: int("author_id")
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),

  title: varchar("title", { length: 225 }).notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  imagePublicId: varchar("image_public_id", { length: 255 }),
  status: mysqlEnum("status", ["draft", "published"])
    .notNull()
    .default("published"),
  createdAt: timestamp("created_at").defaultNow(),
  updateAt: timestamp("update_at")
    .defaultNow()
    .onUpdateNow(),
});

//LIKES
export const likesTable = mysqlTable("likes", {
  id: int("id").autoincrement().primaryKey(),

  userId: int("user_id")
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),

  postId: int("post_id")
    .notNull()
    .references(() => postsTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),

  createdAt: timestamp("created_at").defaultNow(),
},
(table) => ({
    userPostUnique: uniqueIndex("likes_user_post_unique").on(
      table.userId,
      table.postId,
    ),
  }),
);


//SAVED
export const savedPostsTable = mysqlTable("saved_posts", {
  id: int("id").autoincrement().primaryKey(),

  userId: int("user_id")
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),

  postId: int("post_id")
    .notNull()
    .references(() => postsTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),

  createdAt: timestamp("created_at").defaultNow(),
},
(table) => ({
    userPostUnique: uniqueIndex("saved_user_post_unique").on(
      table.userId,
      table.postId,
    ),
  }),
);
