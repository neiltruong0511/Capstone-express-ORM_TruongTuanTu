import { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service";

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (
      req as Request & {
        user: {
          nguoi_dung_id: number;
        };
      }
    ).user;

    const userId = Number(user.nguoi_dung_id);

    const result = await userService.getCurrentUser(userId);

    res.status(200).json({
      message: "Lấy thông tin user thành công",
      content: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getSavedImages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (
      req as Request & {
        user: {
          nguoi_dung_id: number;
        };
      }
    ).user;

    const userId = Number(user.nguoi_dung_id);

    const images = await userService.getSavedImages(userId);

    res.status(200).json({
      message: "Lấy danh sách hình đã lưu thành công",
      content: images,
    });
  } catch (error) {
    next(error);
  }
};

export const getCreatedImages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (
      req as Request & {
        user: {
          nguoi_dung_id: number;
        };
      }
    ).user;

    const userId = Number(user.nguoi_dung_id);

    const images = await userService.getCreatedImages(userId);

    res.status(200).json({
      message: "Lấy danh sách hình đã tạo thành công",
      content: images,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (
      req as Request & {
        user: {
          nguoi_dung_id: number;
        };
      }
    ).user;

    const userId = Number(user.nguoi_dung_id);

    const { ho_ten, tuoi, anh_dai_dien } = req.body;

    const updatedUser = await userService.updateCurrentUser(
      userId,
      {
        ho_ten,
        tuoi:
          tuoi !== undefined
            ? Number(tuoi)
            : undefined,
        anh_dai_dien,
      }
    );

    res.status(200).json({
      message: "Cập nhật thông tin thành công",
      content: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};