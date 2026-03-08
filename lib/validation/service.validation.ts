import { z } from "zod";

export const serviceValidation = z.object({
  name: z.string().min(2, "Service name is required"),
  description: z.string().min(1, "Service description is required"),
  isActive: z.boolean().default(true),
  slug: z.string().min(1, "Service slug is optional").optional(),
  thumbnail: z.instanceof(File, { message: "Thumbnail is required" }).optional(),
});

export const serviceFieldValidation = z.object({
  label: z.string().min(2, "Field label is required").optional(),
  key: z.string().min(2, "Field key is required").optional(),
  type: z.string().optional(),
  isRequired: z.boolean().default(false).optional(),
  options: z.string().optional(),
});

export const serviceRequestValidation = z.object({
  assignedToId: z.number().optional(),
  status: z
    .enum([
      "NEW",
      "IN_REVIEW",
      "IN_PROGRESS",
      "COMPLETED",
      "REJECTED",
      "CANCELLED",
    ])
    .optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  title: z.string().optional(),
  message: z.string().optional(),
  serviceId: z.number().optional(),
});


export const serviceRequestDataValidation = z.object({
  requestId: z.number().min(1, 'Enter Positive Number').optional(),
  fields: z.string().min(1, 'Enter Field Name').optional(),
  value: z.string().min(1, 'Enter Field Value').optional(),
});
