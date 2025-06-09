import { Router } from "express";
import { authenticate } from "../auth/auth.middleware";
import { optionalAuth } from "../auth/optionalAuth";
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

router.get("/", optionalAuth, getBlogs); // public
router.get("/:id", optionalAuth, getBlogById); // public
router.get("/slug/:slug", optionalAuth, getBlogBySlug); // public

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
