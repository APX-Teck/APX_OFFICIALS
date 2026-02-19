import { z } from "zod";

export const serviceValidation = z.object({
   name: z.string().min(2, "Service name is required"),
   slug: z.string().min(1, "Service slug is optional").optional(),
   description: z.string().min(1, "Service description is required"),
   isActive: z.boolean().default(true),
});

export const serviceFieldValidation = z.object({
   label: z.string().min(2, "Field label is required").optional(),
   key: z.string().min(2, "Field key is required").optional(),
   type: z.enum(["text", "textarea", "number", "date", "boolean", "select", "file"]).optional(),
   isRequired: z.boolean().default(false).optional(),
   options: z.string().optional(),
});