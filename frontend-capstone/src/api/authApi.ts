import axiosClient from "./axiosClient";

export interface LoginPayload {
  email: string;
  mat_khau: string;
}

export interface RegisterPayload {
  email: string;
  mat_khau: string;
  ho_ten: string;
  tuoi?: number;
}

export const loginApi = async (
  data: LoginPayload
) => {
  const res = await axiosClient.post(
    "/auth/login",
    data
  );

  return res.data;
};

export const registerApi = async (
  data: RegisterPayload
) => {
  const res = await axiosClient.post(
    "/auth/register",
    data
  );

  return res.data;
};