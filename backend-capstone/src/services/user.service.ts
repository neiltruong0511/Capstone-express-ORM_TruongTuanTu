import prisma from "../prisma/prisma";

export const getCurrentUser = async (userId: number) => {
  const user = await prisma.nguoiDung.findUnique({
    where: {
      nguoi_dung_id: userId,
    },
    select: {
      nguoi_dung_id: true,
      email: true,
      ho_ten: true,
      tuoi: true,
      anh_dai_dien: true,
    },
  });

  if (!user) {
    throw new Error("User không tồn tại");
  }

  return user;
};

export const getSavedImages = async (userId: number) => {
  const savedImages = await prisma.luuAnh.findMany({
    where: {
      nguoi_dung_id: userId,
    },
    orderBy: {
      ngay_luu: "desc",
    },
    include: {
      hinh_anh: {
        include: {
          nguoi_dung: {
            select: {
              nguoi_dung_id: true,
              ho_ten: true,
              email: true,
              anh_dai_dien: true,
            },
          },
        },
      },
    },
  });

  // Chỉ trả về thông tin hình ảnh
  return savedImages.map((item) => item.hinh_anh);
};

export const getCreatedImages = async (userId: number) => {
  const images = await prisma.hinhAnh.findMany({
    where: {
      nguoi_dung_id: userId,
    },
    orderBy: {
      hinh_id: "desc",
    },
  });

  return images;
};

export const updateCurrentUser = async (
  userId: number,
  data: {
    ho_ten?: string;
    tuoi?: number;
    anh_dai_dien?: string;
  }
) => {
  const user = await prisma.nguoiDung.update({
    where: {
      nguoi_dung_id: userId,
    },
    data: {
      ...(data.ho_ten !== undefined && {
        ho_ten: data.ho_ten,
      }),

      ...(data.tuoi !== undefined && {
        tuoi: data.tuoi,
      }),

      ...(data.anh_dai_dien !== undefined && {
        anh_dai_dien: data.anh_dai_dien,
      }),
    },
    select: {
      nguoi_dung_id: true,
      email: true,
      ho_ten: true,
      tuoi: true,
      anh_dai_dien: true,
    },
  });

  return user;
};