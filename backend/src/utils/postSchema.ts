import { z } from "zod";

const titleSchema = z
  .string()
  .min(1, "Title is required")
  .max(200, "Title must be at most 200 characters")
  .trim();

const contentSchema = z
  .string()
  .min(1, "Content is required")
  .max(2000, "Content must be at most 2000 characters")
  .trim();

export const createPostSchema = z.object({
  title: titleSchema,
  content: contentSchema,
});

export const updatePostSchema = z
  .object({
    title: titleSchema.optional(),
    content: contentSchema.optional(),
  })
  .refine((data) => data.title || data.content, {
    message: "At least one field (title or content) must be provided",
  });

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
