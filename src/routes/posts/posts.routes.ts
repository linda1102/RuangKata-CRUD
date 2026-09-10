import { Router } from "express";
import { uploadSingleImage } from "../../middleware/upload.middleware";
import PostsController from "../../controllers/posts/posts.controllers";


const router = Router();

router.post('/' ,uploadSingleImage, PostsController.createPost); // create
router.get('/' , PostsController.getPosts); // ngambil data
router.get('/:id', PostsController.getPostById); // ngambil data berdasarkan id
router.put('/:id', PostsController.updatePost); // update
router.delete('/:id', PostsController.deletePost); // delete

export default router;
