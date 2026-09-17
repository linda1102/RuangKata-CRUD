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
}

export default new LibraryController();
