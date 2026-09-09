import prisma from "../prisma/prisma";

export const getCommentsByImageId = async (imageId: number) => {
  const comments = await prisma.binhLuan.findMany({
    where: {
      hinh_id: imageId,
    },
    orderBy: {
      binh_luan_id: "desc",
    },
    include: {
      nguoi_dung: {
        select: {
          nguoi_dung_id: true,
          ho_ten: true,
          anh_dai_dien: true,
        },
      },
    },
  });

  return comments;
};

export const createComment = async (
  userId: number,
  imageId: number,
  noi_dung: string
) => {
  const image = await prisma.hinhAnh.findUnique({
    where: {
      hinh_id: imageId,
    },
  });

  if (!image) {
    throw new Error("Hình ảnh không tồn tại");
  }

  const comment = await prisma.binhLuan.create({
    data: {
      nguoi_dung_id: userId,
      hinh_id: imageId,
      ngay_binh_luan: new Date(),
      noi_dung,
    },
    include: {
      nguoi_dung: {
        select: {
          nguoi_dung_id: true,
          ho_ten: true,
          anh_dai_dien: true,
        },
      },
    },
  });

  return comment;
};