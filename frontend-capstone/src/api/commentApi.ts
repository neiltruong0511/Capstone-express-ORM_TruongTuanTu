import axiosClient from "./axiosClient";

export const getCommentsApi = async (
  imageId: number
) => {
  const res = await axiosClient.get(
    `/comments/image/${imageId}`
  );

  return res.data;
};

export const addCommentApi = async (
  imageId: number,
  noi_dung: string
) => {
  const res = await axiosClient.post(
    `/comments/image/${imageId}`,
    {
      noi_dung,
    }
  );

  return res.data;
};