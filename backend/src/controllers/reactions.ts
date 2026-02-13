import { Post } from "../models/posts.js";
import { Comment } from "../models/comments.js";
import { Reaction } from "../models/reactions.js";
import asyncHandler from "../utils/asyncHandler.js";

const toggleReaction = asyncHandler(async (req, res) => {
  const { postId, commentId } = req.params;
  const { type } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const targetId = postId || commentId;
  const targetType = postId ? "Post" : "Comment";

  if (!targetId) {
    return res.status(400).json({
      success: false,
      message: "Target ID is required",
    });
  }

  let target: string | any;
  if (targetType === "Post") {
    target = await Post.findById(targetId);
  } else {
    target = await Comment.findById(targetId);
  }

  if (!target) {
    return res.status(404).json({
      success: false,
      message: `${targetType} not found`,
    });
  }

    // already reaction by user
  const existingReaction = (await Reaction.findOne({
    userId,
    targetId: targetId as string,
    targetType,
  })) as any;

    // no existing reaction
  if (!existingReaction) {
    await Reaction.create({
      userId,
      targetId: targetId as string,
      targetType,
      reactionType: type,
    });

    // Increment count
    if (
      target.reactionCount &&
      target.reactionCount[type as keyof typeof target.reactionCount] !==
        undefined
    ) {
      (target.reactionCount as any)[type] += 1;
      await target.save();
    }

    return res.status(201).json({
      success: true,
      message: "Reaction added",
      data: { reactionType: type },
    });
  }

  // Same reaction type so delete kr do reaction ko
  if (existingReaction.reactionType === type) {
    await Reaction.findByIdAndDelete(existingReaction._id);

    // Decrement count
    if (
      target.reactionCount &&
      target.reactionCount[type as keyof typeof target.reactionCount] !==
        undefined
    ) {
      (target.reactionCount as any)[type] = Math.max(
        0,
        (target.reactionCount as any)[type] - 1,
      );
      await target.save();
    }

    return res.status(200).json({
      success: true,
      message: "Reaction removed",
    });
  }

  // Different reaction type - update krna hai reaction
  const oldType = existingReaction.reactionType;
  existingReaction.reactionType = type;
  await existingReaction.save();

  // Update counts - decrement old, increment new
  if (target.reactionCount) {
    if ((target.reactionCount as any)[oldType] !== undefined) {
      (target.reactionCount as any)[oldType] = Math.max(
        0,
        (target.reactionCount as any)[oldType] - 1,
      );
    }
    if (
      target.reactionCount[type as keyof typeof target.reactionCount] !==
      undefined
    ) {
      (target.reactionCount as any)[type] += 1;
    }
    await target.save();
  }

  return res.status(200).json({
    success: true,
    message: "Reaction updated",
    data: { reactionType: type },
  });
});

const getReactions = asyncHandler(async (req, res) => {
  const { postId, commentId } = req.params;
  const targetId = postId || commentId;
  const targetType = postId ? "Post" : "Comment";

  if (!targetId) {
    return res.status(400).json({
      success: false,
      message: "Target ID is required",
    });
  }

  const reactions = await Reaction.find({
    targetId: targetId as string,
    targetType,
  }).populate("userId", "userName fullName");

  // Group by reaction type
  const grouped = reactions.reduce((acc: any, reaction: any) => {
    const type = reaction.reactionType;
    if (!acc[type]) {
      acc[type] = 0;
    }
    acc[type] += 1;
    return acc;
  }, {});

  return res.status(200).json({
    success: true,
    data: {
      summary: grouped,
      reactions,
    },
  });
});

export { toggleReaction, getReactions };
