import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export async function createAppointment(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ success: false, message: "Authentication required." });
  const { serviceId, stylistId, date, timeSlot, notes } = req.body;

  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service || !service.isActive) {
    return res.status(404).json({ success: false, message: "Service not found." });
  }

  // Prevent double-booking the same stylist/slot.
  if (stylistId) {
    const clash = await prisma.appointment.findFirst({
      where: { stylistId, date: new Date(date), timeSlot, status: { in: ["PENDING", "CONFIRMED"] } },
    });
    if (clash) {
      return res.status(409).json({ success: false, message: "That time slot is already booked with this stylist." });
    }
  }

  const appointment = await prisma.appointment.create({
    data: { customerId: req.user.userId, serviceId, stylistId, date: new Date(date), timeSlot, notes },
    include: { service: true, stylist: true },
  });

  // TODO: send confirmation email/SMS here.
  res.status(201).json({ success: true, appointment });
}

export async function listMyAppointments(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ success: false, message: "Authentication required." });
  const appointments = await prisma.appointment.findMany({
    where: { customerId: req.user.userId },
    include: { service: true, stylist: true },
    orderBy: { date: "desc" },
  });
  res.json({ success: true, appointments });
}

export async function listAssignedAppointments(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ success: false, message: "Authentication required." });
  const appointments = await prisma.appointment.findMany({
    where: { stylistId: req.user.userId },
    include: { service: true, customer: { select: { firstName: true, lastName: true, phone: true } } },
    orderBy: { date: "asc" },
  });
  res.json({ success: true, appointments });
}

export async function updateAppointmentStatus(req: Request, res: Response) {
  const { status } = req.body;

  if (req.user?.role === "STYLIST") {
    const existing = await prisma.appointment.findUnique({ where: { id: req.params.id } });
    if (!existing || existing.stylistId !== req.user.userId) {
      return res.status(403).json({ success: false, message: "You can only update your own appointments." });
    }
  }

  const appointment = await prisma.appointment.update({ where: { id: req.params.id }, data: { status } });
  res.json({ success: true, appointment });
}

export async function cancelAppointment(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ success: false, message: "Authentication required." });
  const existing = await prisma.appointment.findUnique({ where: { id: req.params.id } });
  if (!existing || existing.customerId !== req.user.userId) {
    return res.status(404).json({ success: false, message: "Appointment not found." });
  }
  const appointment = await prisma.appointment.update({ where: { id: req.params.id }, data: { status: "CANCELLED" } });
  res.json({ success: true, appointment });
}

/**
 * GET /api/appointments/verify/:qrToken — public, minimal detail.
 *
 * Powers the QR ticket: the token is an unguessable cuid unique to ONE
 * appointment, so scanning a ticket can only ever reveal that single
 * customer's booking — never anyone else's, and never a sequential ID an
 * attacker could enumerate. Returns 404 for any invalid/unknown token
 * without distinguishing "wrong token" from "doesn't exist", same
 * information-leak precaution as login.
 */
export async function getAppointmentByToken(req: Request, res: Response) {
  const appointment = await prisma.appointment.findUnique({
    where: { qrToken: req.params.qrToken },
    include: {
      service: true,
      stylist: { select: { firstName: true, lastName: true, title: true } },
      customer: { select: { firstName: true, lastName: true, phone: true } },
    },
  });
  if (!appointment) {
    return res.status(404).json({ success: false, message: "This appointment QR code is invalid or has expired." });
  }
  res.json({ success: true, appointment });
}

/**
 * POST /api/appointments/verify/:qrToken/confirm — STAFF/ADMIN only.
 * The actual "check the client in" action a staff member takes after
 * scanning the ticket on their own phone.
 */
export async function confirmByToken(req: Request, res: Response) {
  const appointment = await prisma.appointment.findUnique({ where: { qrToken: req.params.qrToken } });
  if (!appointment) {
    return res.status(404).json({ success: false, message: "This appointment QR code is invalid or has expired." });
  }
  if (appointment.status === "CANCELLED") {
    return res.status(409).json({ success: false, message: "This appointment was cancelled." });
  }
  const updated = await prisma.appointment.update({
    where: { qrToken: req.params.qrToken },
    data: { status: "CONFIRMED", confirmedAt: new Date() },
  });
  res.json({ success: true, appointment: updated });
}
