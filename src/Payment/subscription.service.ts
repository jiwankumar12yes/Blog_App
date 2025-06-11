import razorpay from "../config/razorpay";

export const createUserSubscription = async ({
  planId,
  customerId,
  totalCount = 12,
}: {
  planId: string;
  customerId: string;
  totalCount?: number;
}) => {
  const subscription = await razorpay.subscriptions.create({
    plan_id: planId,
    customer_notify: 1,
    total_count: totalCount,
  });
  return subscription;
};
