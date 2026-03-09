import { z } from "zod";

export const adValidation = z.object({
    placement: z.enum(["BLOG_LIST_TOP",
    "BLOG_LIST_MID",
    "BLOG_POST_TOP",
    "BLOG_POST_MID",
    "BLOG_POST_BOTTOM",
    "SIDEBAR"]),
    adType: z.enum(["GOOGLE", "CLIENT","OTHER"]),
    adCode: z.string()    .max(20000)    .optional()
    .nullable(),
    targetUrl: z.string().min(1, "Target URL is required"),
    clientName: z.string().min(1, "Client Name is required"),
    isActive: z.boolean().default(true),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
});