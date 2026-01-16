import { model, Schema } from "mongoose";
import type { postModelType } from "../types/types.js";

const postSchema = new Schema<postModelType>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    reactionCount: {
      like: { type: Number, default: 0 },
      love: { type: Number, default: 0 },
      funny: { type: Number, default: 0 },
      angry: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

export const Post = model<postModelType>("Post", postSchema);
