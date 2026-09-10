import { Request, Response } from "express";
import { createPostSchema } from "../../validations/posts.validations";
import { db } from "../../config/db";
import { postsTable } from "../../config/schema";
import { eq } from "drizzle-orm";
import { uploadCloudinary } from "../../services/cloudinary.services";

export class PostsController {
  // CREATE
  createPost = async (req: Request, res: Response) => {
    try {
      const validateData = createPostSchema.parse(req.body);
      const { title, content, categoryId, author } = validateData;

      let imageUrl: string | undefined;
      let imagePublicId: string | undefined;

      if (req.file) {
        const uploadResult = await uploadCloudinary(req.file.buffer);
        imageUrl = uploadResult.secure_url;
        imagePublicId = uploadResult.public_id;
      }

      const [insertedPost] = await db
        .insert(postsTable)
        .values({
          title,
          content,
          author,
          imageUrl,
          imagePublicId,
          categoryId,
        })
        .$returningId();

      const newPost = await db.query.postsTable.findFirst({
        where: eq(postsTable.id, insertedPost.id),
      });

      return res.status(201).json({
        success: true,
        message: "Post created successfully",
        data: {
          post: newPost,
        },
      });
    } catch (error) {
      console.error("Create post error:", error);

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
        error: error instanceof Error ? error.message : error,
      });
    }
  };
}

export default new PostsController();
