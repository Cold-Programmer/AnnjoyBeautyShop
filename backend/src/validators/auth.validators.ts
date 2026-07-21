import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(60),
  lastName: z.string().min(1, "Last name is required").max(60),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(9, "Enter a valid phone number").max(15),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export const verifyEmailSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  code: z.string().length(6, "Enter the 6-digit code"),
});

export const resendVerificationSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});
