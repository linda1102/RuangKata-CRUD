import { z } from "zod";

export const createPostSchema = z.object({
  categoryId: z.coerce.number(),
  title: z.string().min(3, "Title minimal 3 karakter"),
  content: z.string().min(1),
  authorId: z.coerce.number(),
  status: z.enum(["draft", "published"]).default("published"),
});