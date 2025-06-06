import { Router } from "express";
import { authenticate } from "../auth/auth.middleware";
import { requireAdmin } from "../auth/role.middleware";
import {
  createCategory,
  deleteCategory,
  getCategories,
} from "../controllers/categoryController";

const router = Router();

router.post("/create-category", authenticate, requireAdmin, createCategory);
router.get("/get-categories", authenticate, requireAdmin, getCategories);
router.delete(
  "/delete-category/:id",
  authenticate,
  requireAdmin,
  deleteCategory
);

export default router;
