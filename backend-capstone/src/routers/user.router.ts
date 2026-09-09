import { Router } from "express";
import { authenticate } from "../common/middlewares/auth.middleware";
import { getCurrentUser, getSavedImages, getCreatedImages, updateCurrentUser } from "../controllers/user.controller";

const router = Router();

// 1. Các route tĩnh (Static Routes) - Đặt LÊN TRÊN
router.get("/me", authenticate, getCurrentUser);
router.get("/saved-images", authenticate, getSavedImages);
router.get(
  "/created-images",
  authenticate,
  getCreatedImages
);
router.put(
  "/me",
  authenticate,
  updateCurrentUser
);


export default router;