import crypto from "crypto";
import { Request, Response } from "express";

export const handleWebhook = async (req: Request, res: Response) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;

  const body = JSON.stringify(req.body);
  const signature = req.headers["x-razorpay-signature"] as string;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  if (signature === expectedSignature) {
    const event = req.body;

    if (event.event === "payment.captured") {
      const paymentId = event.payload.payment.entity.id;
      const orderId = event.payload.payment.entity.order_id;
      const userEmail = event.payload.payment.entity.email;

      // Find user by email or order mapping
      // Save Subscription / Payment info in DB
      console.log("✅ Webhook verified & payment captured:", paymentId);

      res.json({ status: "ok" });
    } else {
      res.status(200).json({ message: "Unhandled event" });
    }
  } else {
    console.log("❌ Invalid signature");
    res.status(400).send("Invalid signature");
  }
};
