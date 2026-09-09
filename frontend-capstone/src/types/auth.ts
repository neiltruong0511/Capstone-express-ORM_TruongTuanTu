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

export interface User {
  nguoi_dung_id: number;
  email: string;
  ho_ten: string;
  tuoi?: number | null;
  anh_dai_dien?: string | null;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}

export interface AuthContextUser extends User {}