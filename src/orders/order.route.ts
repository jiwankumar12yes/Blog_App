import express from "express";
import { createOrderHandler } from "./order.controller";

const router = express.Router();

router.post("/create", createOrderHandler);

export default router;
