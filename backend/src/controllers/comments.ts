import { Comment } from "../models/comments.js";
import { Post } from "../models/posts.js";
import asyncHandler from "../utils/asyncHandler.js";

const createComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  if (!postId) {
    return res
      .status(400)
      .json({ success: false, message: "Post ID is required" });
  }

  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ success: false, message: "Post not found" });
  }

  const newComment = await Comment.create({
    content,
    authorId: userId,
    postId: postId as string,
  });

  const populatedComment = await Comment.findById(newComment._id).populate(
    "authorId",
    "_id userName",
  );

  await Post.findByIdAndUpdate(postId, {
    $inc: { commentCount: 1 },
  });

  return res.status(201).json({ success: true, data: populatedComment });
});

const getCommentsForPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!postId) {
    return res
      .status(400)
      .json({ success: false, message: "Post ID is required" });
  }

  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ success: false, message: "Post not found" });
  }

  const comments = await Comment.find({ postId: postId as string })
    .populate("authorId", "_id userName")
    .sort({ createdAt: -1 });

    const topLevelComments = comments.filter((c) => c.depth === 0);
    const replies = comments.filter((c) => c.depth === 1);

     const replyMap = new Map<string, typeof replies>();
  for (const reply of replies) {
    const parentId = reply.parentCommentId!.toString();
    if (!replyMap.has(parentId)) replyMap.set(parentId, []);
    replyMap.get(parentId)!.push(reply);
  }

    const commentTree = topLevelComments.map(comment => ({
    ...comment.toObject(),
    replies: replyMap.get(comment._id.toString()) ?? [],
  }));

  return res.status(200).json({ success: true, data: commentTree });
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const comments = await Comment.findById(commentId);
  if (!comments) {
    return res
      .status(404)
      .json({ success: false, message: "Comment not found" });
  }

  if (comments.authorId.toString() !== userId.toString()) {
    return res.status(403).json({
      success: false,
      message: "You can only delete your own comments",
    });
  }

  await Comment.findByIdAndDelete(commentId);
  const deletedReplies = await Comment.deleteMany({ parentCommentId: commentId as string });

  const post = await Post.findById(comments.postId);
  if (post) {
    await Post.findByIdAndUpdate(comments.postId, {
      $inc: { commentCount: -(1 + deletedReplies.deletedCount) }
    });
  }

  return res
    .status(200)
    .json({ success: true, message: "Comment deleted successfully" });
});

const replyToComment = asyncHandler(async (req, res) => {
  const content = req.body;
  const { commentId } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const parentComment = await Comment.findById(commentId);
  if (!parentComment) {
    return res
      .status(404)
      .json({ success: false, message: "Parent comment not found" });
  }

  if (parentComment.depth >= 1) {
    return res
      .status(400)
      .json({ success: false, message: "Maximum reply depth reached" });
  }

  const newComment = await Comment.create({
    content,
    authorId: userId,
    postId: parentComment.postId,
    parentCommentId: commentId as string,
    depth: parentComment.depth + 1,
  });

  return res.status(201).json({ success: true, data: newComment });
});

export { createComment, getCommentsForPost, deleteComment, replyToComment };
