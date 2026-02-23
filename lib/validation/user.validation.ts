import z from "zod";

export const userValidation = z.object({
  email: z.string().email(),
  phone: z.string().min(10).max(15),
  password: z.string().min(8).max(100).optional(),
  fullName: z.string().min(3).max(100),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "EDITOR", "SALES", "ADS_MANAGER", "CLIENT", "USER"]),
  isActive: z.boolean().optional().default(true),
});
