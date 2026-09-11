import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma/prisma";

interface RegisterData {
  email: string;
  mat_khau: string;
  ho_ten: string;
  tuoi?: number;
}

interface LoginData {
  email: string;
  mat_khau: string;
}

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET chưa được cấu hình trong .env");
}

export const register = async (data: RegisterData) => {
  const { email, mat_khau, ho_ten, tuoi } = data;

  const existingUser = await prisma.nguoiDung.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("Email đã tồn tại");
  }

  const hashedPassword = await bcrypt.hash(mat_khau, 10);

  const user = await prisma.nguoiDung.create({
    data: {
      email,
      mat_khau: hashedPassword,
      ho_ten,
      tuoi: tuoi !== undefined ? Number(tuoi) : null,
    },
  });

  return {
    nguoi_dung_id: user.nguoi_dung_id,
    email: user.email,
    ho_ten: user.ho_ten,
    tuoi: user.tuoi,
    anh_dai_dien: user.anh_dai_dien,
  };
};

export const login = async (data: LoginData) => {
  const { email, mat_khau } = data;

  // 1. Tìm user theo email
  const user = await prisma.nguoiDung.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("Email hoặc mật khẩu không đúng");
  }

  // 2. So sánh password nhập vào với password đã hash
  const isPasswordValid = await bcrypt.compare(
    mat_khau,
    user.mat_khau
  );

  if (!isPasswordValid) {
    throw new Error("Email hoặc mật khẩu không đúng");
  }

  // 3. Tạo JWT
  const accessToken = jwt.sign(
    {
      nguoi_dung_id: user.nguoi_dung_id,
      email: user.email,
    },
    JWT_SECRET,
    {
      expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as jwt.Secret | number | undefined as any,
    }
  );

  // 4. Trả thông tin user + accessToken
  return {
    user: {
      nguoi_dung_id: user.nguoi_dung_id,
      email: user.email,
      ho_ten: user.ho_ten,
      tuoi: user.tuoi,
      anh_dai_dien: user.anh_dai_dien,
    },
    accessToken,
  };
};