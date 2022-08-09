import * as Joi from "joi";
import { z } from "zod";

export const commentSchema = Joi.object({
  id: Joi.string().required(),
  message: Joi.string().allow("").required(),
  author: Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
  }).required(),
});

export const validateUsingJoi = (obj: any) => commentSchema.validate(obj);

export const commentZod = z.object({
  id: z.string(),
  message: z.string(),
  author: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

export type CommentZodType = z.infer<typeof commentZod>;

export const validateUsingZod = (obj: any) => commentZod.safeParse(obj);
