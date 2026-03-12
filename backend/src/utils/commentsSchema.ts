import z from "zod";

const contentSchema = z
  .string()
  .min(1, "Comment content cannot be empty")
  .max(500, "Comment content too long");

export const commentSchema = z.object({
  content: contentSchema,
});

export type CreateCommentPayload = z.infer<typeof commentSchema>;
