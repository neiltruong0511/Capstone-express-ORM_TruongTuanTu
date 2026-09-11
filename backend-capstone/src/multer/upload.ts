import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// 1. Kết nối đến tài khoản Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Cấu hình Storage đẩy ảnh thẳng lên Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (_req, _file) => {
    return {
      folder: "capstone_uploads", // Tên thư mục lưu ảnh trên Cloudinary
      allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
      public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
    };
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn 5MB
  },
});