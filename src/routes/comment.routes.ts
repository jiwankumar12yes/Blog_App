import { Router } from "express";
import { authenticate } from "../auth/auth.middleware";
import {
  createComment,
  deleteComment,
} from "../controllers/comment.controller";

const router = Router();

router.post("/", authenticate, createComment);
router.delete("/:id", authenticate, deleteComment);

export default router;
