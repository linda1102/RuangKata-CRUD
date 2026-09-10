import { Request, Response } from "express";
import { createPostSchema } from "../../validations/posts.validations";
import { db } from "../../config/db";
import { postsTable, categoryTable } from "../../config/schema";
import { eq } from "drizzle-orm";
import { uploadCloudinary } from "../../services/cloudinary.services";

export class PostsController {
  // CREATE
  createPost = async (req: Request, res: Response) => {
    try {
      const validateData = createPostSchema.parse(req.body);

      const {
        userId,
        categoryId,
        title,
        content,
        author,
        status,
      } = validateData;

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
          userId,
          categoryId,
          title,
          content,
          author,
          status,
          imageUrl,
          imagePublicId,
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

   // READ - Semua Post
  getPosts = async (req: Request, res: Response) => {
    try {
      const posts = await db
        .select({
          id: postsTable.id,
          userId: postsTable.userId,
          categoryId: postsTable.categoryId,
          category: categoryTable.name,
          title: postsTable.title,
          content: postsTable.content,
          status: postsTable.status,
          author: postsTable.author,
          createdAt: postsTable.createdAt,
          updateAt: postsTable.updateAt,
        })
        .from(postsTable)
        .leftJoin(
          categoryTable,
          eq(postsTable.categoryId, categoryTable.id)
        );

      return res.status(200).json({
        success: true,
        message: "Berhasil mengambil semua data",
        data: {
          posts,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Gagal mengambil data",
        error: error instanceof Error ? error.message : error,
      });
    }
  };
}

export default new PostsController();