"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadSingleImage = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const storage = multer_1.default.diskStorage({
    destination: path_1.default.join(__dirname, "..", "uploads"),
    filename: (_req, file, cb) => {
        const unique = crypto_1.default.randomBytes(16).toString("hex");
        cb(null, `${unique}${path_1.default.extname(file.originalname).toLowerCase()}`);
    },
});
function fileFilter(_req, file, cb) {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
        return cb(new Error("Unsupported file type. Please upload a JPEG, PNG, WEBP, or GIF image."));
    }
    cb(null, true);
}
exports.uploadSingleImage = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: MAX_SIZE_BYTES },
}).single("file");
