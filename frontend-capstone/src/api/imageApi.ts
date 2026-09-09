import axiosClient from "./axiosClient";

export const getImagesApi = async () => {
  const res = await axiosClient.get(
    "/images"
  );

  return res.data;
};

export const searchImagesApi = async (
  keyword: string
) => {
  const res = await axiosClient.get(
    "/images/search",
    {
      params: {
        keyword,
      },
    }
  );

  return res.data;
};

export const getImageDetailApi = async (
  id: number
) => {
  const res = await axiosClient.get(
    `/images/${id}`
  );

  return res.data;
};

export const checkSavedApi = async (
  imageId: number
) => {
  const res = await axiosClient.get(
    `/images/${imageId}/saved`
  );

  return res.data;
};

export const saveImageApi = async (
  imageId: number
) => {
  const res = await axiosClient.post(
    `/images/${imageId}/save`
  );

  return res.data;
};

export const unsaveImageApi = async (
  imageId: number
) => {
  const res = await axiosClient.delete(
    `/images/${imageId}/save`
  );

  return res.data;
};