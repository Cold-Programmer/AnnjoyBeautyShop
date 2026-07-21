import { StoredTransaction, PaymentStatus } from "../types/mpesa.types";

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
  private transactions = new Map<string, StoredTransaction>();

  create(tx: Omit<StoredTransaction, "status" | "createdAt" | "updatedAt">): StoredTransaction {
    const record: StoredTransaction = {
      ...tx,
      status: "PENDING",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.transactions.set(tx.checkoutRequestId, record);
    return record;
  }

  updateStatus(
    checkoutRequestId: string,
    status: PaymentStatus,
    extra?: { mpesaReceiptNumber?: string; resultDesc?: string }
  ): StoredTransaction | undefined {
    const record = this.transactions.get(checkoutRequestId);
    if (!record) return undefined;
    record.status = status;
    record.updatedAt = new Date();
    if (extra?.mpesaReceiptNumber) record.mpesaReceiptNumber = extra.mpesaReceiptNumber;
    if (extra?.resultDesc) record.resultDesc = extra.resultDesc;
    this.transactions.set(checkoutRequestId, record);
    return record;
  }

  get(checkoutRequestId: string): StoredTransaction | undefined {
    return this.transactions.get(checkoutRequestId);
  }
}

// Singleton — same instance across the app process.
export const transactionStore = new TransactionStore();
