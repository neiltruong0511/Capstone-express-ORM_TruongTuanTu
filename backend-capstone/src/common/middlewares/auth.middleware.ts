import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET chưa được cấu hình trong .env");
}

export interface AuthPayload {
  nguoi_dung_id: number;
  email: string;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorization = req.headers.authorization;

    // Không có Authorization
    if (!authorization) {
      return res.status(401).json({
        message: "Bạn chưa đăng nhập",
      });
    }

    // Tách Bearer và token
    const [type, token] = authorization.split(" ");

    if (type !== "Bearer" || !token) {
      return res.status(401).json({
        message: "Token không hợp lệ",
      });
    }

    // Verify JWT
    const decoded = jwt.verify(
      token,
      JWT_SECRET
    ) as AuthPayload;

    // Lưu thông tin user vào request
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token không hợp lệ hoặc đã hết hạn",
    });
  }
};