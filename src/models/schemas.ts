import { z } from "zod";



export const registerSchema = z.object({
 body: z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username cannot exceed 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers and underscores allowed"),
  email: z.string().email("Invalid email format"),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
  role: z.enum(['USER', 'ADMIN']).default('USER') 
  })
});

export const loginSchema = z.object({
 body: z.object({email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required")
})
});


export const blogSchema=z.object({
    title:z.string().min(3,"Title should be at least 3 character").max(255),
    content:z.string().min(10,"Content should be at least 10 character"),
    authorId:z.number().int().positive(),
    categoryId: z.number().int().positive()
});

export const commentSchema = z.object({
    content: z.string().min(1).max(500),
    authorId: z.number().int().positive(),
    blogId: z.number().int().positive()
  });

  export const likeSchema = z.object({
    authorId: z.number().int().positive(),
    blogId: z.number().int().positive()
  });


export type BlogInput = z.infer<typeof blogSchema>;
export type CommentInput = z.infer<typeof commentSchema>;
export type LikeInput = z.infer<typeof likeSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;