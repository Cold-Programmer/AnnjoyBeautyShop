"use strict";

const { prisma } = require("../config/prisma");

/**
 * GET /api/stylists — lists STYLIST-role accounts for the booking form's
 * "choose your stylist" dropdown. Public detail (name/title/bio) only —
 * never returns email/phone/password data.
 *
 * This endpoint didn't exist before, which is the root cause of a real
 * bug: the booking form had no way to send a stylistId, so every
 * appointment was created with stylistId = null, and a stylist's
 * dashboard (which filters `WHERE stylistId = <them>`) never showed
 * anything — a booked service could never "reach" the stylist who's
 * supposed to do it.
 */
async function listStylists(req, res) {
  const stylists = await prisma.user.findMany({
    where: { role: "STYLIST", status: "ACTIVE" },
    select: { id: true, firstName: true, lastName: true, title: true, bio: true, avatarUrl: true },
    orderBy: { firstName: "asc" },
  });
  res.json({ success: true, stylists });
}

module.exports = { listStylists };
