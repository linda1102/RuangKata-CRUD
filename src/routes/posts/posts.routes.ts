import { Router } from "express";
import { uploadSingleImage } from "../../middleware/upload.middleware";
import PostsController from "../../controllers/posts/posts.controllers";

const router = Router();

router.post("/", uploadSingleImage, PostsController.createPost);
router.get("/categories", PostsController.getCategories);
router.get("/", PostsController.getPosts);
router.get("/:id", PostsController.getPostById);
router.put("/:id", uploadSingleImage, PostsController.updatePost);
router.delete("/:id", PostsController.deletePost);

export default router;