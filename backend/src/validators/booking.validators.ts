import { z } from "zod";

export const createAppointmentSchema = z.object({
  serviceId: z.string().min(1, "Service is required"),
  stylistId: z.string().optional(),
  date: z.string().refine((d) => !isNaN(Date.parse(d)), "Enter a valid date"),
  timeSlot: z.string().min(1, "Time slot is required"),
  notes: z.string().max(500).optional(),
});

export const createOrderSchema = z.object({
  items: z
    .array(z.object({ productId: z.string(), quantity: z.number().int().positive() }))
    .min(1, "Cart cannot be empty"),
  deliveryAddress: z.string().min(3, "Delivery address is required"),
  phone: z.string().min(9, "Enter a valid phone number"),
  guestEmail: z.string().email().optional(),
});
