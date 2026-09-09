import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import axiosClient from "../api/axiosClient";

export default function EditProfilePage() {
  const navigate = useNavigate();

  const { user, getCurrentUser } = useAuth();

  const [hoTen, setHoTen] = useState("");

  const [tuoi, setTuoi] = useState("");

  const [avatar, setAvatar] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setHoTen(user.ho_ten || "");
      setTuoi(user.tuoi ? String(user.tuoi) : "");
      setAvatar(user.anh_dai_dien || "");
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      getCurrentUser();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axiosClient.put("/users/me", {
        ho_ten: hoTen,
        tuoi: tuoi ? Number(tuoi) : undefined,
        anh_dai_dien: avatar || undefined,
      });

      await getCurrentUser();

      alert("Cập nhật thông tin thành công!");

      navigate("/profile");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="detail-loading">Đang tải thông tin...</div>;
  }

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-card">
        <h1>Chỉnh sửa hồ sơ</h1>

        <p className="edit-subtitle">Cập nhật thông tin cá nhân của bạn</p>

        <div className="edit-avatar">
          {avatar ? (
            <img src={avatar} alt={hoTen} />
          ) : (
            hoTen.charAt(0).toUpperCase()
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <label>Họ tên</label>

          <input
            value={hoTen}
            onChange={(e) => setHoTen(e.target.value)}
            placeholder="Họ tên"
          />

          <label>Tuổi</label>

          <input
            type="number"
            value={tuoi}
            onChange={(e) => setTuoi(e.target.value)}
            placeholder="Tuổi"
          />

          <label>Link ảnh đại diện</label>

          <input
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="https://..."
          />

          <div className="edit-actions">
            <button type="button" onClick={() => navigate("/profile")}>
              Hủy
            </button>

            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
