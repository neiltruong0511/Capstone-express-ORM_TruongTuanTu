import axiosClient from "./axiosClient";

export const getMeApi = async () => {
  const res = await axiosClient.get(
    "/users/me"
  );

  return res.data;
};

export const getCreatedImagesApi = async () => {
  const res = await axiosClient.get(
    "/users/created-images"
  );

  return res.data;
};

export const getSavedImagesApi = async () => {
  const res = await axiosClient.get(
    "/users/saved-images"
  );

  return res.data;
};

export const updateProfileApi = async (
  data: {
    ho_ten?: string;
    tuoi?: number;
    anh_dai_dien?: string;
  }
) => {
  const res = await axiosClient.put(
    "/users/me",
    data
  );

  return res.data;
};