import { Request, Response } from "express";
import * as authService from "../services/auth.service";

export const register = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, mat_khau, ho_ten, tuoi } = req.body;

    if (!email || !mat_khau || !ho_ten) {
      return res.status(400).json({
        message: "Email, mật khẩu và họ tên là bắt buộc",
      });
    }

    const user = await authService.register({
      email,
      mat_khau,
      ho_ten,
      tuoi,
    });

    return res.status(201).json({
      message: "Đăng ký thành công",
      content: user,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Đăng ký thất bại";

    return res.status(400).json({
      message,
    });
  }
};

export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, mat_khau } = req.body;

    if (!email || !mat_khau) {
      return res.status(400).json({
        message: "Email và mật khẩu là bắt buộc",
      });
    }

    const result = await authService.login({
      email,
      mat_khau,
    });

    return res.status(200).json({
      message: "Đăng nhập thành công",
      content: result,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Đăng nhập thất bại";

    return res.status(401).json({
      message,
    });
  }
};