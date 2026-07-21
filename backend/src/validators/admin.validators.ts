import { z } from "zod";

export const createUserSchema = z.object({
  firstName: z.string().min(1).max(60),
  lastName: z.string().min(1).max(60),
  email: z.string().email(),
  phone: z.string().min(9).max(15),
  password: z.string().min(8),
  role: z.enum(["CUSTOMER", "STYLIST", "STAFF", "ADMIN"]),
  title: z.string().max(100).optional(),
  bio: z.string().max(1000).optional(),
});

export const updateRoleSchema = z.object({
  role: z.enum(["CUSTOMER", "STYLIST", "STAFF", "ADMIN"]),
});

export const updateStatusSchema = z.object({
  status: z.enum(["ACTIVE", "SUSPENDED", "FLAGGED", "DELETED"]),
  reason: z.string().max(500).optional(),
});
