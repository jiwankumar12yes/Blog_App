import express from "express";
import { createSubscriptionHandler } from "../Payment/subscription.controller";
const router = express.Router();

router.post(
  "/subscribe",
  /*erifyRazorpayWebhook , */ createSubscriptionHandler
);

export default router;
