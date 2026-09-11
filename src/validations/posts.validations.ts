import { z } from "zod";

export const createPostSchema = z.object({
  categoryId: z.coerce.number(),
  title: z.string().min(3, "Title minimal 3 karakter"),
  content: z.string().min(1),
  author: z.string().min(1),
  status: z.enum(["delete", "published"]).default("published"),
});