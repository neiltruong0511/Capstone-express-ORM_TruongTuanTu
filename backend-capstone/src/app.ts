import express from "express";
import cors from "cors";
import path from "path";
import authRouter from "./routers/auth.router";
import imageRouter from "./routers/image.router";
import userRouter from "./routers/user.router";
import {
  authenticate,
  AuthRequest,
} from "./common/middlewares/auth.middleware";
import { setupSwagger } from "./swagger/swagger";

const app = express();

// ✅ Thay app.use(cors()) cũ bằng đoạn cấu hình này:
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://YOUR-FRONTEND.vercel.app", // Thay bằng URL Vercel thật sau khi deploy
    ],
    credentials: true, // Cho phép truyền cookie / Auth header
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setupSwagger(app);

// Serve static files
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

// Routers
app.use("/api/auth", authRouter);
app.use("/api/images", imageRouter);
app.use("/api/users", userRouter); 

// Test JWT
app.get(
  "/api/test-auth",
  authenticate,
  (req, res) => {
    const authReq = req as AuthRequest;

    return res.json({
      message: "Bạn đã đăng nhập",
      user: authReq.user,
    });
  }
);

app.get("/", (req, res) => {
  res.json({
    message: "Pinterest API is running",
  });
});

export default app;