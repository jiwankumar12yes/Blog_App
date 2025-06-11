import razorpay from "../config/razorpay";

export const createOrder = async ({
  amount,
  currency = "INR",
  receipt,
}: {
  amount: number;
  currency?: string;
  receipt: string;
}) => {
  const order = await razorpay.orders.create({
    amount,
    currency,
    receipt,
    payment_capture: true,
  });
  return order;
};
