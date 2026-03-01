import z from "zod";

export const blogValidation = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long").max(100, "Title must be at most 100 characters long"),
    slug: z.coerce.string().min(3, "Slug must be at least 3 characters long").max(100, "Slug must be at most 100 characters long").optional(),
    content: z.string().min(10, "Content must be at least 10 characters long"),
    thumbnail: z.string().url("Invalid thumbnail URL"),
    status: z.enum(["DRAFT", "PUBLISHED","ARCHIVED"]),
    authorId: z.number(),
});
 

