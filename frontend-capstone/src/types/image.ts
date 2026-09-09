import type { User } from "./user";

export interface ImageItem {
  hinh_id: number;
  ten_hinh: string;
  duong_dan: string;
  mo_ta?: string | null;
  nguoi_dung_id: number;

  nguoi_dung?: User;
}

export interface Comment {
  binh_luan_id: number;
  nguoi_dung_id: number;
  hinh_id: number;
  ngay_binh_luan: string;
  noi_dung: string;

  nguoi_dung?: User;
}

export interface ImageDetail extends ImageItem {
  binh_luan?: Comment[];
}

export interface CreateImagePayload {
  image: File;
  ten_hinh: string;
  mo_ta?: string;
}