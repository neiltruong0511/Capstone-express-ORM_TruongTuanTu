import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
// Import đúng tên authenticate và AuthRequest từ middleware
import { authenticate, AuthRequest } from "../common/middlewares/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);

// Sử dụng middleware authenticate ở đây
router.get("/test-auth", authenticate, (req: AuthRequest, res) => {
  return res.status(200).json({
    message: "Bạn đã đăng nhập",
    user: req.user,
  });
});

export default router;