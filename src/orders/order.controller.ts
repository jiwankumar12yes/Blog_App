import { Request, Response } from "express";
import { createOrder } from "./order.service";

export const createOrderHandler = async (req: Request, res: Response) => {
  const { amount, receipt } = req.body;

  try {
    const order = await createOrder({ amount, receipt });
    res.status(200).json({ success: true, order });
    return;
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Unable to create order",
      error: error.message,
    });
    return;
  }
};
