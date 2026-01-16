import { Router } from "express";
import { createPost, deletePost, getAllPost, getPostById, updatePost } from "../controllers/post.js";

const postRouter = Router();

postRouter.route('/').get(getAllPost);
postRouter.route('/:postId').get(getPostById);

// protected
postRouter.route('/:postId').put(updatePost);
postRouter.route('/').post(createPost);
postRouter.route('/:postId').delete(deletePost);

export default postRouter;