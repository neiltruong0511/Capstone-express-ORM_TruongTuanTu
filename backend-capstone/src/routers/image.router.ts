import { Router } from "express";

import {
  getAllImages,
  searchImages,
  getImageDetail,
  checkSavedImage,
  createImage,
  deleteImage,
  saveImage,
  unsaveImage,
} from "../controllers/image.controller";

import {
  getCommentsByImageId,
  createComment,
} from "../controllers/comment.controller";

import { authenticate } from "../common/middlewares/auth.middleware";
import { upload } from "../multer/upload";

const router = Router();

// Search phải đặt trước /:id
router.get("/search", searchImages);

router.get("/", getAllImages);

router.get("/:id", getImageDetail);

// Comments
router.get("/:id/comments", getCommentsByImageId);
router.post("/:id/comments", authenticate, createComment);

// Save image
router.get("/:id/saved", authenticate, checkSavedImage);
router.post("/:id/save", authenticate, saveImage);
router.delete("/:id/save", authenticate, unsaveImage);

// Create image
router.post("/", authenticate, upload.single("image"), createImage);

// Delete image
router.delete("/:id", authenticate, deleteImage);

export default router;