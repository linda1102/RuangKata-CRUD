import { Router } from "express";
import LibraryController from "../../controllers/library/library.controllers";

const router = Router();

// Like post
router.post("/posts/:id/like", LibraryController.likePost);
router.delete("/posts/:id/like", LibraryController.unlikePost);
router.get("/posts/:id/like", LibraryController.checkLike);

// Save post
router.post("/posts/:id/save", LibraryController.savePost);
router.delete("/posts/:id/save", LibraryController.unsavePost);
router.get("/posts/:id/save", LibraryController.checkSave);

// Library
router.get("/liked", LibraryController.getLikedPosts);
router.get("/saved", LibraryController.getSavedPosts);

// Test route
router.post("/test", (req, res) => {
  res.json({
    message: "Library route berhasil",
  });
});

export default router;
