import { Request, Response } from "express";
import { createPostSchema } from "../../validations/posts.validations";
import { db } from "../../config/db";
import { postsTable, categoryTable, usersTable } from "../../config/schema";
import { eq, and } from "drizzle-orm";
import { uploadCloudinary } from "../../services/cloudinary.services";

export class PostsController {
  // CREATE POST
  createPost = async (req: Request, res: Response) => {
    try {
      const validateData = createPostSchema.parse(req.body);

      const { categoryId, title, content, authorId, status } = validateData;

      let imageUrl: string | undefined;
      let imagePublicId: string | undefined;

      // Upload image ke Cloudinary
      if (req.file) {
        const uploadResult = await uploadCloudinary(req.file.buffer);

        imageUrl = uploadResult.secure_url;
        imagePublicId = uploadResult.public_id;
      }

      // Menambahkan post ke database
      const [insertedPost] = await db
        .insert(postsTable)
        .values({
          categoryId,
          title,
          content,
          authorId,
          status,
          imageUrl,
          imagePublicId,
        })
        .$returningId();

      // Mengambil data post yang baru dibuat
      const newPost = await db
        .select({
          id: postsTable.id,
          categoryId: postsTable.categoryId,
          category: categoryTable.name,
          title: postsTable.title,
          content: postsTable.content,
          status: postsTable.status,
          authorId: postsTable.authorId,
          author: usersTable.username,
          imageProfile: usersTable.imageProfile,
          imageUrl: postsTable.imageUrl,
          createdAt: postsTable.createdAt,
          updateAt: postsTable.updateAt,
        })
        .from(postsTable)
        .leftJoin(categoryTable, eq(postsTable.categoryId, categoryTable.id))
        .leftJoin(usersTable, eq(postsTable.authorId, usersTable.id))
        .where(eq(postsTable.id, insertedPost.id));

      return res.status(201).json({
        success: true,
        message: "Post created successfully",
        data: {
          post: newPost[0],
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

  // GET ALL POSTS
  getPosts = async (req: Request, res: Response) => {
    try {
      const authorId = req.query.authorId ? Number(req.query.authorId) : null;

      const conditions = [];

      // Jika ada authorId, ambil post milik author tersebut
      if (authorId) {
        conditions.push(eq(postsTable.authorId, authorId));
      } else {
        conditions.push(eq(postsTable.status, "published"));
      }

      // Mengambil data posts dari database
      const posts = await db
        .select({
          id: postsTable.id,
          categoryId: postsTable.categoryId,
          category: categoryTable.name,
          title: postsTable.title,
          content: postsTable.content,
          status: postsTable.status,

          authorId: postsTable.authorId,
          author: usersTable.username,
          imageProfile: usersTable.imageProfile,

          imageUrl: postsTable.imageUrl,
          createdAt: postsTable.createdAt,
          updateAt: postsTable.updateAt,
        })
        .from(postsTable)
        .leftJoin(categoryTable, eq(postsTable.categoryId, categoryTable.id))
        .leftJoin(usersTable, eq(postsTable.authorId, usersTable.id))
        .where(and(...conditions));

      return res.status(200).json({
        success: true,
        message: "Berhasil mengambil data",
        data: {
          posts,
        },
      });
    } catch (error) {
      console.error("Get posts error:", error);

      return res.status(500).json({
        success: false,
        message: "Gagal mengambil data",
        error: error instanceof Error ? error.message : error,
      });
    }
  };

  // GET POST BY ID
  getPostById = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      // Mengambil post berdasarkan ID
      const post = await db
        .select({
          id: postsTable.id,
          categoryId: postsTable.categoryId,
          category: categoryTable.name,
          title: postsTable.title,
          content: postsTable.content,
          status: postsTable.status,

          authorId: postsTable.authorId,
          author: usersTable.username,
          imageProfile: usersTable.imageProfile,

          imageUrl: postsTable.imageUrl,
          createdAt: postsTable.createdAt,
          updateAt: postsTable.updateAt,
        })
        .from(postsTable)
        .leftJoin(categoryTable, eq(postsTable.categoryId, categoryTable.id))
        .leftJoin(usersTable, eq(postsTable.authorId, usersTable.id))
        .where(eq(postsTable.id, id));

      // Jika post tidak ditemukan
      if (post.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Data tidak ditemukan",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Berhasil mengambil data",
        data: post[0],
      });
    } catch (error) {
      console.error("Get post by id error:", error);

      return res.status(500).json({
        success: false,
        message: "Gagal mengambil data",
        error: error instanceof Error ? error.message : error,
      });
    }
  };

  // UPDATE POST
  updatePost = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      const { categoryId, title, content, authorId, status } = req.body;

      let image: string | undefined;

      // Upload image baru jika ada
      if (req.file) {
        const uploadResult = await uploadCloudinary(req.file.buffer);
        image = uploadResult.secure_url;
      }

      // Mengupdate data post
      await db
        .update(postsTable)
        .set({
          categoryId: categoryId ? Number(categoryId) : undefined,
          title,
          content,
          authorId: authorId ? Number(authorId) : undefined,
          status,
          ...(image && { imageUrl: image }),
        })
        .where(eq(postsTable.id, id));

      return res.status(200).json({
        success: true,
        message: "Data berhasil diupdate",
      });
    } catch (error) {
      console.error("Update post error:", error);

      return res.status(500).json({
        success: false,
        message: "Gagal mengupdate data",
        error: error instanceof Error ? error.message : error,
      });
    }
  };

  // DELETE POST
  deletePost = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      // Menghapus post berdasarkan ID
      await db.delete(postsTable).where(eq(postsTable.id, id));

      return res.status(200).json({
        success: true,
        message: "Data berhasil dihapus",
      });
    } catch (error) {
      console.error("Delete post error:", error);

      return res.status(500).json({
        success: false,
        message: "Gagal menghapus data",
        error: error instanceof Error ? error.message : error,
      });
    }
  };

  // GET CATEGORIES
  getCategories = async (req: Request, res: Response) => {
    try {
      // Mengambil semua category
      const categories = await db.select().from(categoryTable);

      return res.status(200).json({
        success: true,
        message: "Berhasil mengambil category",
        data: {
          categories,
        },
      });
    } catch (error) {
      console.error("Get categories error:", error);

      return res.status(500).json({
        success: false,
        message: "Gagal mengambil category",
        error: error instanceof Error ? error.message : error,
      });
    }
  };
}

export default new PostsController();