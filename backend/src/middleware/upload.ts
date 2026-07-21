import multer from "multer";
import path from "path";
import crypto from "crypto";
import { Request } from "express";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

const storage = multer.diskStorage({
  destination: path.join(__dirname, "..", "uploads"),
  filename: (_req, file, cb) => {
    const unique = crypto.randomBytes(16).toString("hex");
    cb(null, `${unique}${path.extname(file.originalname).toLowerCase()}`);
  },
});

function fileFilter(_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    return cb(new Error("Unsupported file type. Please upload a JPEG, PNG, WEBP, or GIF image."));
  }
  cb(null, true);
}

export const uploadSingleImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE_BYTES },
}).single("file");
