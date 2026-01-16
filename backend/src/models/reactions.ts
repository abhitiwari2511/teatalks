import { model, Schema } from "mongoose";
import type { reactionType } from "../types/types.js";

const reactionSchema = new Schema<reactionType>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    targetId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: function() {
            return this.targetType;
        }
    },
    targetType: {
        type: String,
        enum: ["Post", "Comment"],
        required: true,
    },
    reactionType: {
        type: String,
        enum: ["like", "love", "funny", "angry"],
        required: true,
    }
})

export const Reaction = model<reactionType>("Reaction", reactionSchema)