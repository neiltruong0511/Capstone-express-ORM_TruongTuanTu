import { Request, Response, NextFunction } from "express";
import * as commentService from "../services/comment.service";

export const getCommentsByImageId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const imageId = Number(req.params.id);

    if (isNaN(imageId)) {
      return res.status(400).json({
        message: "ID hình không hợp lệ",
      });
    }

    const comments = await commentService.getCommentsByImageId(imageId);

    res.status(200).json({
      message: "Lấy danh sách bình luận thành công",
      content: comments,
    });
  } catch (error) {
    next(error);
  }
};

export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const imageId = Number(req.params.id);

    if (isNaN(imageId)) {
      return res.status(400).json({
        message: "ID hình không hợp lệ",
      });
    }

    const { noi_dung } = req.body;

    if (!noi_dung || !noi_dung.trim()) {
      return res.status(400).json({
        message: "Nội dung bình luận không được để trống",
      });
    }

    const user = (
      req as Request & {
        user: {
          nguoi_dung_id: number;
        };
      }
    ).user;

    const userId = Number(user.nguoi_dung_id);

    const comment = await commentService.createComment(
      userId,
      imageId,
      noi_dung.trim()
    );

    res.status(201).json({
      message: "Bình luận thành công",
      content: comment,
    });
  } catch (error) {
    next(error);
  }
};