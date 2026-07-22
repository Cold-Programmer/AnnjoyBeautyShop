"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = uploadImage;
/**
 * POST /api/uploads — accepts a single file (field name "file") and
 * returns a URL the frontend can store directly on a product/profile,
 * exactly like a manually-pasted image URL would be. This is what
 * powers the "add an image by URL OR upload from your phone" toggle —
 * both paths end up producing the same kind of string.
 *
 * Storage: local disk under backend/src/uploads, served statically at
 * /uploads/:filename (wired in app.ts). This is genuinely functional for
 * development and small deployments, but disk storage does NOT persist
 * across redeploys on most hosts (Render/Railway wipe the filesystem on
 * each deploy). For production, swap this for Cloudinary/S3 — the multer
 * config below is the only place that would need to change; the
 * frontend's upload call and the resulting stored URL format stay the same.
 */
async function uploadImage(req, res) {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "No file was uploaded." });
    }
    const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(201).json({ success: true, url });
}
