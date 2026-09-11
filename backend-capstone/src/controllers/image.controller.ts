import { Request, Response, NextFunction } from "express"; 
import { AuthRequest } from "../common/middlewares/auth.middleware";
import * as imageService from "../services/image.service";

export const getAllImages = async (
  req: Request,
  res: Response
) => {
  try {
    const images = await imageService.getAllImages();

    return res.status(200).json({
      message: "Lấy danh sách hình thành công",
      content: images,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

export const searchImages = async (
  req: Request,
  res: Response
) => {
  try {
    const keyword = String(req.query.keyword || "").trim();

    if (!keyword) {
      return res.status(400).json({
        message: "Vui lòng nhập từ khóa tìm kiếm",
      });
    }

    const images = await imageService.searchImages(keyword);

    return res.status(200).json({
      message: "Tìm kiếm hình thành công",
      content: images,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

export const getImageDetail = async (
  req: Request,
  res: Response
) => {
  try {
    const imageId = Number(req.params.id);

    if (!Number.isInteger(imageId)) {
      return res.status(400).json({
        message: "ID hình không hợp lệ",
      });
    }

    const image = await imageService.getImageDetail(imageId);

    return res.status(200).json({
      message: "Lấy thông tin hình thành công",
      content: image,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Lỗi server";

    return res.status(404).json({
      message,
    });
  }
};

export const checkSavedImage = async (
  req: AuthRequest, // 2. Dùng kiểu AuthRequest an toàn hơn
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

    // 3. Kiểm tra optional chaining tránh crash server nếu chưa truyền Token
    if (!req.user?.nguoi_dung_id) {
      return res.status(401).json({
        message: "Bạn chưa đăng nhập hoặc token không hợp lệ",
      });
    }

    const userId = Number(req.user.nguoi_dung_id);

    const result = await imageService.checkSavedImage(
      userId,
      imageId
    );

    return res.status(200).json({
      message: "Kiểm tra ảnh đã lưu thành công",
      content: result,
    });
  } catch (error) {
    next(error);
  }
};

export const createImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user;
    const userId = Number(user?.nguoi_dung_id);

    if (isNaN(userId)) {
      return res.status(401).json({ message: "Xác thực người dùng thất bại" });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Vui lòng chọn hình ảnh",
      });
    }

    const { ten_hinh, mo_ta } = req.body;

    if (!ten_hinh) {
      return res.status(400).json({
        message: "Tên hình không được để trống",
      });
    }

    // Tự động lấy protocol + host (Localhost hoặc Render Domain)
    const protocol = req.protocol;
    const host = req.get("host");
    const fullImageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    const image = await imageService.createImage(userId, {
      ten_hinh,
      mo_ta,
      duong_dan: fullImageUrl, // Lưu https://capstone-express-orm-truongtuantu.onrender.com/uploads/...
    });

    return res.status(201).json({
      message: "Thêm hình thành công",
      content: image,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteImage = async (
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

    const user = (
      req as Request & {
        user: {
          nguoi_dung_id: number;
        };
      }
    ).user;

    const userId = Number(user.nguoi_dung_id);

    await imageService.deleteImage(userId, imageId);

    res.status(200).json({
      message: "Xóa hình thành công",
    });
  } catch (error) {
    next(error);
  }
};

export const saveImage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const imageId = Number(req.params.id);

    if (!Number.isInteger(imageId) || imageId <= 0) {
      return res.status(400).json({
        message: "ID hình không hợp lệ",
      });
    }

    if (!req.user?.nguoi_dung_id) {
      return res.status(401).json({
        message: "Bạn chưa đăng nhập",
      });
    }

    const userId = Number(req.user.nguoi_dung_id);

    const result = await imageService.saveImage(userId, imageId);

    return res.status(200).json({
      message: "Lưu hình thành công",
      content: result,
    });
  } catch (error) {
    next(error);
  }
};

export const unsaveImage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const imageId = Number(req.params.id);

    if (!Number.isInteger(imageId) || imageId <= 0) {
      return res.status(400).json({
        message: "ID hình không hợp lệ",
      });
    }

    if (!req.user?.nguoi_dung_id) {
      return res.status(401).json({
        message: "Bạn chưa đăng nhập",
      });
    }

    const userId = Number(req.user.nguoi_dung_id);

    const result = await imageService.unsaveImage(userId, imageId);

    return res.status(200).json({
      message: "Bỏ lưu hình thành công",
      content: result,
    });
  } catch (error) {
    next(error);
  }
};