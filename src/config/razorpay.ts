import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.key_id,
  key_secret: process.env.key_secret,
});

export default razorpay;
