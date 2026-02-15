import { Post } from "../models/posts.js";
import asyncHandler from "../utils/asyncHandler.js";

const createPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const authorId = req.user?._id;

  if (!authorId) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  const newPost = await Post.create({
    title,
    content,
    authorId,
  });

  const populatedPost = await Post.findById(newPost._id).populate(
    "authorId",
    "_id userName fullName",
  );

  return res.status(201).json({
    success: true,
    data: populatedPost,
  });
});

const getAllPost = asyncHandler(async (req, res) => {
  const defaultPageNumber = req.query.page || 1;
  const defaultPostNumber = req.query.limit || 10;

  const page = parseInt(defaultPageNumber as string, 10);
  const limit = parseInt(defaultPostNumber as string, 10);
  const skip = (page - 1) * limit;

  const posts = await Post.find()
    .populate("authorId", "_id userName fullName")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalPosts = await Post.countDocuments();

  return res.status(200).json({
    success: true,
    data: posts,
    page,
    totalPages: Math.ceil(totalPosts / limit),
    totalPosts,
  });
});

const getPostById = asyncHandler(async (req, res) => {
  const postId = req.params.postId;

  const post = await Post.findById(postId).populate(
    "authorId",
    "_id userName fullName",
  );

  if (!post) {
    return res.status(404).json({
      success: false,
      message: "Post not found.",
    });
  }
  return res.status(200).json({
    success: true,
    data: post,
  });
});

const updatePost = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const { title, content } = req.body;
  const authorId = req.user?._id;

  if (!authorId) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({
      success: false,
      message: "Post not found.",
    });
  }

  if (post.authorId.toString() !== authorId.toString()) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to update this post.",
    });
  }

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    { title, content },
    { new: true, runValidators: true },
  ).populate("authorId", "_id userName fullName");

  return res.status(200).json({
    success: true,
    data: updatedPost,
  });
});

const deletePost = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const authorId = req.user?._id;

  if (!authorId) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({
      success: false,
      message: "Post not found.",
    });
  }

  if (post.authorId.toString() !== authorId.toString()) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to delete this post.",
    });
  }

  const deletedPost = await Post.findByIdAndDelete(postId);

  return res.status(200).json({
    success: true,
    message: "Post deleted successfully",
  });
});

export { createPost, getAllPost, getPostById, updatePost, deletePost };
