import prisma from "../prisma/prisma";

// ======================================================
// GET ALL IMAGES
// ======================================================
export const getAllImages = async () => {
  return await prisma.hinhAnh.findMany({
    include: {
      nguoi_dung: {
        select: {
          nguoi_dung_id: true,
          email: true,
          ho_ten: true,
          anh_dai_dien: true,
        },
      },
    },
    orderBy: {
      hinh_id: "desc",
    },
  });
};

// ======================================================
// SEARCH IMAGES
// ======================================================
export const searchImages = async (keyword: string) => {
  return await prisma.hinhAnh.findMany({
    where: {
      ten_hinh: {
        contains: keyword,
      },
    },
    include: {
      nguoi_dung: {
        select: {
          nguoi_dung_id: true,
          email: true,
          ho_ten: true,
          anh_dai_dien: true,
        },
      },
    },
    orderBy: {
      hinh_id: "desc",
    },
  });
};

// ======================================================
// GET IMAGE DETAIL
// ======================================================
export const getImageDetail = async (imageId: number) => {
  const image = await prisma.hinhAnh.findUnique({
    where: {
      hinh_id: imageId,
    },
    include: {
      nguoi_dung: {
        select: {
          nguoi_dung_id: true,
          email: true,
          ho_ten: true,
          tuoi: true,
          anh_dai_dien: true,
        },
      },
    },
  });

  if (!image) {
    throw new Error("Hình ảnh không tồn tại");
  }

  return image;
};

// ======================================================
// CHECK SAVED IMAGE
// ======================================================
export const checkSavedImage = async (
  userId: number,
  imageId: number
) => {
  const saved = await prisma.luuAnh.findUnique({
    where: {
      nguoi_dung_id_hinh_id: {
        nguoi_dung_id: userId,
        hinh_id: imageId,
      },
    },
  });

  return {
    saved: !!saved,
  };
};

// ======================================================
// CREATE IMAGE
// ======================================================
export const createImage = async (
  userId: number,
  data: {
    ten_hinh: string;
    duong_dan: string;
    mo_ta?: string;
  }
) => {
  const image = await prisma.hinhAnh.create({
    data: {
      ten_hinh: data.ten_hinh,
      duong_dan: data.duong_dan,
      mo_ta: data.mo_ta || null,
      nguoi_dung_id: userId,
    },
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
  });

  return image;
};

// ======================================================
// DELETE IMAGE
// ======================================================
export const deleteImage = async (
  userId: number,
  imageId: number
) => {
  // Kiểm tra hình có tồn tại không
  const image = await prisma.hinhAnh.findUnique({
    where: {
      hinh_id: imageId,
    },
  });

  if (!image) {
    throw new Error("Hình ảnh không tồn tại");
  }

  // Chỉ chủ ảnh mới được xóa
  if (image.nguoi_dung_id !== userId) {
    const error = new Error(
      "Bạn không có quyền xóa hình ảnh này"
    );

    (error as any).statusCode = 403;

    throw error;
  }

  // Xóa hình
  const deletedImage = await prisma.hinhAnh.delete({
    where: {
      hinh_id: imageId,
    },
  });

  return deletedImage;
};

// ======================================================
// SAVE IMAGE
// ======================================================
export const saveImage = async (
  userId: number,
  imageId: number
) => {
  // --------------------------------------------------
  // Kiểm tra hình có tồn tại không
  // --------------------------------------------------
  const image = await prisma.hinhAnh.findUnique({
    where: {
      hinh_id: imageId,
    },
  });

  if (!image) {
    const error = new Error("Hình ảnh không tồn tại");

    (error as any).statusCode = 404;

    throw error;
  }

  // --------------------------------------------------
  // Kiểm tra người dùng đã lưu hình này chưa
  // --------------------------------------------------
  const existing = await prisma.luuAnh.findUnique({
    where: {
      nguoi_dung_id_hinh_id: {
        nguoi_dung_id: userId,
        hinh_id: imageId,
      },
    },
  });

  // Nếu đã lưu rồi thì không tạo duplicate
  if (existing) {
    return {
      saved: true,
      message: "Hình này đã được lưu",
    };
  }

  // --------------------------------------------------
  // Tạo bản ghi lưu hình
  // --------------------------------------------------
  await prisma.luuAnh.create({
    data: {
      nguoi_dung_id: userId,
      hinh_id: imageId,
      ngay_luu: new Date(),
    },
  });

  return {
    saved: true,
  };
};

// ======================================================
// UNSAVE IMAGE
// ======================================================
export const unsaveImage = async (
  userId: number,
  imageId: number
) => {
  // --------------------------------------------------
  // Kiểm tra hình đã được lưu chưa
  // --------------------------------------------------
  const existing = await prisma.luuAnh.findUnique({
    where: {
      nguoi_dung_id_hinh_id: {
        nguoi_dung_id: userId,
        hinh_id: imageId,
      },
    },
  });

  // Chưa lưu thì không cần xóa
  if (!existing) {
    return {
      saved: false,
    };
  }

  // --------------------------------------------------
  // Xóa bản ghi lưu hình
  // --------------------------------------------------
  await prisma.luuAnh.delete({
    where: {
      nguoi_dung_id_hinh_id: {
        nguoi_dung_id: userId,
        hinh_id: imageId,
      },
    },
  });

  return {
    saved: false,
  };
};