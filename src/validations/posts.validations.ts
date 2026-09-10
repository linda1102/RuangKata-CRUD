import { z } from "zod";

export const createPostSchema = z.object({
  userId: z.coerce.number(),
  categoryId: z.coerce.number(),
  title: z
  .string()
  .min(3, "Title minimal 3 karakter")
  .max(255, "Title maksimal 255 karakter"),
  content: z.string().min(1),
  author: z.string().min(1),
  status: z.enum(["draft", "published"]).default("published"),
});