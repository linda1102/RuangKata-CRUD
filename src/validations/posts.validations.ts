import { z } from "zod";

export const createPostSchema = z.object({
    title: z
        .string()
        .min(3, "Title minimal 3 karakter")
        .max(255, "Title maksimal 255 karakter"),

    content: z
        .string()
        .min(10, "Content minimal 10 karakter"),
    
    author: z
        .string()
        .min(2, "Author minimal 2 karakter"),
    
    categoryId: z
        .coerce
        .number(),
});