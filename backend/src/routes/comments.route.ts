import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.js";
import { deleteComment, replyToComment } from "../controllers/comments.js";
import { toggleReaction, getReactions } from "../controllers/reactions.js";
import { reactionSchema } from "../utils/reactionsSchema.js";
import { validate } from "../middlewares/validate.js";
import { commentSchema } from "../utils/commentsSchema.js";

const commentRouter = Router();

// Comment CRUD routes
commentRouter.route("/:commentId").delete(verifyJWT, deleteComment);
commentRouter.route("/:commentId/reply").post(verifyJWT, validate(commentSchema), replyToComment);

// Reaction routes for comments
commentRouter
  .route("/:commentId/reactions")
  .post(verifyJWT, validate(reactionSchema), toggleReaction);
commentRouter.route("/:commentId/reactions").get(getReactions);

export default commentRouter;
