import { Router } from "express";
import { uploadSingleImage } from "../../middleware/upload.middleware";
import PostsController from "../../controllers/posts/posts.controllers";

const router = Router();

// Create post
router.post("/", uploadSingleImage, PostsController.createPost);

// Get categories
router.get("/categories", PostsController.getCategories);

// Get all posts
router.get("/", PostsController.getPosts);

// Get post berdasarkan ID
router.get("/:id", PostsController.getPostById);

// Update post
router.put("/:id", uploadSingleImage, PostsController.updatePost);

// Delete post
router.delete("/:id", PostsController.deletePost);

export default router;