import { Request, Response } from "express";
import { db } from "../../config/db";
import {
  likesTable,
  savedPostsTable,
  postsTable,
  categoryTable,
  usersTable,
} from "../../config/schema";
import { eq, and } from "drizzle-orm";

export class LibraryController {
  // LIKE POST
  likePost = async (req: Request, res: Response) => {
    try {
      const postId = Number(req.params.id);
      const userId = Number(req.body.userId);

      if (!postId || !userId) {
        return res.status(400).json({
          success: false,
          message: "postId dan userId wajib diisi",
        });
      }

      const existingLike = await db
        .select()
        .from(likesTable)
        .where(
          and(eq(likesTable.userId, userId), eq(likesTable.postId, postId)),
        );

      if (existingLike.length > 0) {
        return res.status(200).json({
          success: true,
          message: "Artikel sudah disukai",
          data: {
            liked: true,
          },
        });
      }

      await db.insert(likesTable).values({
        userId,
        postId,
      });

      return res.status(201).json({
        success: true,
        message: "Artikel berhasil disukai",
        data: {
          liked: true,
        },
      });
    } catch (error) {
      console.error("Like post error:", error);

      return res.status(500).json({
        success: false,
        message: "Gagal menyukai artikel",
        error: error instanceof Error ? error.message : error,
      });
    }
  };

  // UNLIKE POST
  unlikePost = async (req: Request, res: Response) => {
    try {
      const postId = Number(req.params.id);
      const userId = Number(req.query.userId);

      if (!postId || !userId) {
        return res.status(400).json({
          success: false,
          message: "postId dan userId wajib diisi",
        });
      }

      await db
        .delete(likesTable)
        .where(
          and(eq(likesTable.userId, userId), eq(likesTable.postId, postId)),
        );

      return res.status(200).json({
        success: true,
        message: "Like berhasil dihapus",
        data: {
          liked: false,
        },
      });
    } catch (error) {
      console.error("Unlike post error:", error);

      return res.status(500).json({
        success: false,
        message: "Gagal menghapus like",
        error: error instanceof Error ? error.message : error,
      });
    }
  };

  // CHECK LIKE
  checkLike = async (req: Request, res: Response) => {
    try {
      const postId = Number(req.params.id);
      const userId = Number(req.query.userId);

      const result = await db
        .select()
        .from(likesTable)
        .where(
          and(eq(likesTable.userId, userId), eq(likesTable.postId, postId)),
        );

      return res.status(200).json({
        success: true,
        data: {
          liked: result.length > 0,
        },
      });
    } catch (error) {
      console.error("Check like error:", error);

      return res.status(500).json({
        success: false,
        message: "Gagal mengecek like",
      });
    }
  };

  // SAVE POST
  savePost = async (req: Request, res: Response) => {
    try {
      const postId = Number(req.params.id);
      const userId = Number(req.body.userId);

      if (!postId || !userId) {
        return res.status(400).json({
          success: false,
          message: "postId dan userId wajib diisi",
        });
      }

      const existingSave = await db
        .select()
        .from(savedPostsTable)
        .where(
          and(
            eq(savedPostsTable.userId, userId),
            eq(savedPostsTable.postId, postId),
          ),
        );

      if (existingSave.length > 0) {
        return res.status(200).json({
          success: true,
          message: "Artikel sudah disimpan",
          data: {
            saved: true,
          },
        });
      }

      await db.insert(savedPostsTable).values({
        userId,
        postId,
      });

      return res.status(201).json({
        success: true,
        message: "Artikel berhasil disimpan",
        data: {
          saved: true,
        },
      });
    } catch (error) {
      console.error("Save post error:", error);

      return res.status(500).json({
        success: false,
        message: "Gagal menyimpan artikel",
        error: error instanceof Error ? error.message : error,
      });
    }
  };
   // UNSAVE POST
  unsavePost = async (req: Request, res: Response) => {
    try {
      const postId = Number(req.params.id);
      const userId = Number(req.query.userId);

      await db
        .delete(savedPostsTable)
        .where(
          and(
            eq(savedPostsTable.userId, userId),
            eq(savedPostsTable.postId, postId),
          ),
        );

      return res.status(200).json({
        success: true,
        message: "Artikel dihapus dari simpanan",
        data: {
          saved: false,
        },
      });
    } catch (error) {
      console.error("Unsave post error:", error);

      return res.status(500).json({
        success: false,
        message: "Gagal menghapus simpanan",
        error: error instanceof Error ? error.message : error,
      });
    }
  };
}

export default new LibraryController();
