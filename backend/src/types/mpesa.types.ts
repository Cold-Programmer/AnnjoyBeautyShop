export interface StkPushRequestBody {
  phone: string; // e.g. "0722503692" or "254722503692"
  amount: number;
  accountReference: string; // e.g. order/booking ID
  transactionDesc: string; // e.g. "Annjoy Beauty Shop Order #123"
}

export interface StkPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

export interface StkCallbackItem {
  Name: string;
  Value?: string | number;
}

export interface StkCallbackBody {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: StkCallbackItem[];
      };
    };
  };
}

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED";

export interface StoredTransaction {
  checkoutRequestId: string;
  merchantRequestId: string;
  accountReference: string;
  amount: number;
  phone: string;
  status: PaymentStatus;
  mpesaReceiptNumber?: string;
  resultDesc?: string;
  createdAt: Date;
  updatedAt: Date;
}
