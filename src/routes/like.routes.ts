import { Router } from "express";
import { authenticate } from "../auth/auth.middleware";
import { getBlogLikes, likeBlog } from "../controllers/like.controller";

const router = Router();

router.post("/", authenticate, likeBlog);
router.get("/", authenticate, getBlogLikes);

export default router;
