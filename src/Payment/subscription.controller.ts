import { Request, Response } from "express";
import { createUserSubscription } from "./subscription.service";

export const createSubscriptionHandler = async (
  req: Request,
  res: Response
) => {
  const { planId, customerId } = req.body;

  try {
    const subscription = await createUserSubscription({ planId, customerId });
    res.json({ success: true, subscription });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
