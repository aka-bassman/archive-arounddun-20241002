import iap from "iap";

interface VerifyPaymentType {
  packageName: string;
  platform: string;
  productId: string;
  receipt: string;
  secret?: string;
  subscription?: boolean;
  keyObject?: any;
}
export const verifyPayment = async (payment: VerifyPaymentType) => {
  return new Promise((resolve, reject) =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    (iap as { verifyPayment: (...args) => any }).verifyPayment(payment.platform, { ...payment }, (error, response) => {
      if (error) reject(`App Purchase Verify Failed. ${response}`);
      else resolve(response);
    })
  );
};
