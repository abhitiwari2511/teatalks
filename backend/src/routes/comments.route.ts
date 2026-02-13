import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.js";
import { deleteComment } from "../controllers/comments.js";
import { toggleReaction, getReactions } from "../controllers/reactions.js";
import { reactionSchema } from "../utils/reactionsSchema.js";
import { validate } from "../middlewares/validate.js";

const commentRouter = Router();

// Comment CRUD routes
commentRouter.route("/:commentId").delete(verifyJWT, deleteComment);

// Reaction routes for comments
commentRouter
  .route("/:commentId/reactions")
  .post(verifyJWT, validate(reactionSchema), toggleReaction);
commentRouter.route("/:commentId/reactions").get(getReactions);

export default commentRouter;
