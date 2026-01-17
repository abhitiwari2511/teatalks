import { Router } from "express";
import {
  createPost,
  deletePost,
  getAllPost,
  getPostById,
  updatePost,
} from "../controllers/post.js";
import { createPostSchema, updatePostSchema } from "../utils/postSchema.js";
import { validate } from "../middlewares/validate.js";
import { verifyJWT } from "../middlewares/auth.js";

const postRouter = Router();

postRouter.route("/").get(getAllPost);
postRouter.route("/:postId").get(getPostById);

// protected
postRouter.route("/:postId").put(verifyJWT, validate(updatePostSchema), updatePost);
postRouter.route("/").post(verifyJWT, validate(createPostSchema), createPost);
postRouter.route("/:postId").delete(verifyJWT, deletePost);

export default postRouter;