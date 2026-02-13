import z from "zod";

export const reactionSchema = z.object({
  type: z.enum(["like", "love", "funny", "angry"], {
    message: "Invalid reaction type. Must be one of: like, love, funny, angry",
  }),
});

export type ReactionPayload = z.infer<typeof reactionSchema>;
