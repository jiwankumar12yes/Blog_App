import { z } from "zod";

export const createSubscriptionSchema = z.object({
  body: z.object({
    planId: z.string(),
    customerId: z.string(),
  }),
});
