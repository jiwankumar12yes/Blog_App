// routes/payment.route.ts
import express from "express";
import { verifyPaymentHandler } from "../payment_verification/payment.controller";

const router = express.Router();
router.post("/verify", verifyPaymentHandler);
export default router;
