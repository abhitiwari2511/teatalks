import { Router } from "express";
import {
  createPost,
  deletePost,
  getAllPost,
  getPostById,
  updatePost,
} from "../controllers/post.js";
import { createComment, getCommentsForPost } from "../controllers/comments.js";
import { toggleReaction, getReactions } from "../controllers/reactions.js";
import { createPostSchema, updatePostSchema } from "../utils/postSchema.js";
import { createCommentSchema } from "../utils/commentsSchema.js";
import { reactionSchema } from "../utils/reactionsSchema.js";
import { validate } from "../middlewares/validate.js";
import { verifyJWT } from "../middlewares/auth.js";

const postRouter = Router();

// Post routes
postRouter.route("/").get(getAllPost);
postRouter.route("/:postId").get(getPostById);

// Protected post routes
postRouter
  .route("/:postId")
  .put(verifyJWT, validate(updatePostSchema), updatePost);
postRouter.route("/").post(verifyJWT, validate(createPostSchema), createPost);
postRouter.route("/:postId").delete(verifyJWT, deletePost);

// Comment routes for posts
postRouter.route("/:postId/comments").get(getCommentsForPost);
postRouter
  .route("/:postId/comments")
  .post(verifyJWT, validate(createCommentSchema), createComment);

// Reaction routes for posts
postRouter
  .route("/:postId/reactions")
  .post(verifyJWT, validate(reactionSchema), toggleReaction);
postRouter.route("/:postId/reactions").get(getReactions);

export default postRouter;
