import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const verifyPaymentHandler = async (req: Request, res: Response) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    userId,
    plan,
  } = req.body;

  const secret = process.env.key_secret!;
  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    res.status(400).json({ success: false, message: "Invalid signature" });
    return;
  }

  try {
    const planEnum = plan.toUpperCase(); // BASIC, STANDARD, PREMIUM

    const subscription = await prisma.subscription.create({
      data: {
        userId,
        plan: planEnum,
        razorpayPlanId: razorpay_order_id,
        razorpaySubId: razorpay_payment_id,
        status: "ACTIVE",
        startDate: new Date(),
      },
    });

    res.status(200).json({
      success: true,
      message: "Payment verified and subscription saved",
      subscription,
    });
    return;
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
    return;
  }
};
