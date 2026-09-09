export interface User {
  nguoi_dung_id: number;
  email: string;
  ho_ten: string;
  tuoi?: number | null;
  anh_dai_dien?: string | null;
}

export interface UpdateUserPayload {
  ho_ten?: string;
  tuoi?: number;
  anh_dai_dien?: string;
}