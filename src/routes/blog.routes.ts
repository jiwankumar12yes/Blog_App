import { Router } from "express";
import { authenticate } from "../auth/auth.middleware";
import {
  requireAdmin,
  requireEditor,
  requireUserAdmin,
} from "../auth/role.middleware";
import upload from "../config/multer";
import {
  createBlog,
  deleteBlog,
  getBlogById,
  getBlogBySlug,
  getBlogs,
  getUnpublishedBlogs,
  updateBlog,
} from "../controllers/blog.controller";

const router = Router();

router.get("/", getBlogs); // public
router.get("/:id", getBlogById); // public
router.get("/slug/:slug", getBlogBySlug);

router.post(
  "/",
  authenticate,
  requireUserAdmin,
  upload.single("image"),
  createBlog
);
router.patch(
  "/:id",
  authenticate,
  requireUserAdmin,
  upload.single("image"),
  updateBlog
);

router.get(
  "/unpublished/all",
  authenticate,
  requireEditor,
  getUnpublishedBlogs
);

router.delete("/:id", authenticate, requireAdmin, deleteBlog);

export default router;
