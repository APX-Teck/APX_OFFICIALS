import z from "zod";

export const blogValidation = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long").max(100, "Title must be at most 100 characters long"),
    slug: z.string().min(3, "Slug must be at least 3 characters long").max(100, "Slug must be at most 100 characters long"),
    content: z.string().min(10, "Content must be at least 10 characters long"),
    status: z.enum(["draft", "published"]),
    authorId: z.number(),
    image: z.string().url("Invalid image URL"),
});

