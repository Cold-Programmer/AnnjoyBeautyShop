"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionStore = void 0;
/**
 * Minimal in-memory store so this module runs standalone.
 * Swap this for a real Prisma model, e.g.:
 *
 *   model MpesaTransaction {
 *     id                 String   @id @default(cuid())
 *     checkoutRequestId  String   @unique
 *     merchantRequestId  String
 *     accountReference   String
 *     amount             Int
 *     phone              String
 *     status             String   @default("PENDING")
 *     mpesaReceiptNumber String?
 *     resultDesc         String?
 *     createdAt          DateTime @default(now())
 *     updatedAt          DateTime @updatedAt
 *   }
 */
class TransactionStore {
    constructor() {
        this.transactions = new Map();
    }
    create(tx) {
        const record = {
            ...tx,
            status: "PENDING",
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.transactions.set(tx.checkoutRequestId, record);
        return record;
    }
    updateStatus(checkoutRequestId, status, extra) {
        const record = this.transactions.get(checkoutRequestId);
        if (!record)
            return undefined;
        record.status = status;
        record.updatedAt = new Date();
        if (extra?.mpesaReceiptNumber)
            record.mpesaReceiptNumber = extra.mpesaReceiptNumber;
        if (extra?.resultDesc)
            record.resultDesc = extra.resultDesc;
        this.transactions.set(checkoutRequestId, record);
        return record;
    }
    get(checkoutRequestId) {
        return this.transactions.get(checkoutRequestId);
    }
}
// Singleton — same instance across the app process.
exports.transactionStore = new TransactionStore();
