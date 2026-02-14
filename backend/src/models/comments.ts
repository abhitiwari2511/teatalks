import { model, Schema } from "mongoose";
import type { commentType } from "../types/types.js";

const commentSchema = new Schema<commentType>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      required: true,
    },
    reactionCount: {
      like: {
        type: Number,
        default: 0,
      },
      love: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  },
);

export const Comment = model<commentType>("Comment", commentSchema);
