import razorpay from "../config/razorpay";

export const createPlans = async () => {
  const plans: {
    name: string;
    period: "monthly" | "daily" | "weekly" | "yearly";
    interval: number;
    amount: number;
  }[] = [
    { name: "Basic", period: "monthly", interval: 1, amount: 10000 },
    { name: "Standard", period: "monthly", interval: 1, amount: 25000 },
    { name: "Premium", period: "monthly", interval: 1, amount: 50000 },
  ];

  for (const plan of plans) {
    const result = await razorpay.plans.create({
      period: plan.period,
      interval: plan.interval,
      item: {
        name: plan.name,
        amount: plan.amount,
        currency: "INR",
        description: `${plan.name} Subscription Plan`,
      },
    });
    console.log(result.id, result.item.name);
  }
};
