import { useEffect, useState } from "react";
import { Plus, Settings, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import ImageCard from "../components/image/ImageCard";
import { useAuth } from "../hooks/useAuth";
import { useImages } from "../hooks/useImages";

import type { ImageItem } from "../types/image";

export default function ProfilePage() {
  const navigate = useNavigate();

  const { user, getCurrentUser } = useAuth();

  const { getCreatedImages, getSavedImages, deleteImage } = useImages();

  const [tab, setTab] = useState<"created" | "saved">("created");

  const [created, setCreated] = useState<ImageItem[]>([]);
  const [saved, setSaved] = useState<ImageItem[]>([]);

  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD PROFILE DATA
  // =========================
  const loadData = async () => {
    try {
      setLoading(true);

      // Lấy thông tin user mới nhất
      await getCurrentUser();

      // Lấy ảnh đã tạo + ảnh đã lưu
      const [createdImages, savedImages] = await Promise.all([
        getCreatedImages(),
        getSavedImages(),
      ]);

      console.log("CREATED IMAGES:", createdImages);

      console.log("SAVED IMAGES:", savedImages);

      // Luôn đảm bảo state là array
      setCreated(Array.isArray(createdImages) ? createdImages : []);

      setSaved(Array.isArray(savedImages) ? savedImages : []);
    } catch (error) {
      console.error("Load profile data error:", error);

      setCreated([]);
      setSaved([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD WHEN LOGIN
  // =========================
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      loadData();
    } else {
      setLoading(false);
    }
  }, []);

  // =========================
  // DELETE IMAGE
  // =========================
  const handleDelete = async (imageId: number) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa hình này?");

    if (!confirmDelete) return;

    try {
      await deleteImage(imageId);

      // Xóa khỏi danh sách ảnh đã tạo
      setCreated((prev) =>
        Array.isArray(prev)
          ? prev.filter((item) => item.hinh_id !== imageId)
          : [],
      );

      alert("Xóa hình ảnh thành công!");
    } catch (error: any) {
      console.error("Delete image error:", error);

      alert(error?.response?.data?.message || "Không thể xóa hình ảnh");
    }
  };

  // =========================
  // NOT LOGIN
  // =========================
  if (!user) {
    return (
      <div className="empty-state">
        <h2>Bạn chưa đăng nhập</h2>

        <button className="primary-button" onClick={() => navigate("/login")}>
          Đăng nhập
        </button>
      </div>
    );
  }

  // =========================
  // CURRENT IMAGES
  // =========================
  const currentImages: ImageItem[] =
    tab === "created"
      ? Array.isArray(created)
        ? created
        : []
      : Array.isArray(saved)
        ? saved
        : [];

  return (
    <div className="profile-page">
      {/* =========================
          PROFILE HEADER
      ========================= */}
      <section className="profile-header">
        <div className="profile-avatar-large">
          {user.anh_dai_dien ? (
            <img
              src={user.anh_dai_dien}
              alt={user.ho_ten}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            user.ho_ten?.charAt(0).toUpperCase() || "S"
          )}
        </div>

        <h1>{user.ho_ten}</h1>

        <p>{user.email}</p>

        <div className="profile-buttons">
          <button onClick={() => navigate("/profile/edit")}>
            <Settings size={17} />
            Chỉnh sửa hồ sơ
          </button>

          <button onClick={() => navigate("/add")}>
            <Plus size={17} />
            Tạo
          </button>
        </div>
      </section>

      {/* =========================
          TABS
      ========================= */}
      <div className="profile-tabs">
        <button
          className={tab === "created" ? "active" : ""}
          onClick={() => setTab("created")}
        >
          Đã tạo
        </button>

        <button
          className={tab === "saved" ? "active" : ""}
          onClick={() => setTab("saved")}
        >
          Đã lưu
        </button>
      </div>

      {/* =========================
          LOADING
      ========================= */}
      {loading ? (
        <div className="detail-loading">Đang tải...</div>
      ) : (
        <>
          {/* =========================
              IMAGE GRID
          ========================= */}
          {currentImages.length > 0 && (
            <div className="masonry-grid profile-grid">
              {currentImages.map((image) => (
                <div className="profile-image-wrapper" key={image.hinh_id}>
                  <ImageCard image={image} />

                  {/* Chỉ cho phép xóa
                        ảnh mình đã tạo */}
                  {tab === "created" && (
                    <button
                      className="delete-image"
                      onClick={() => handleDelete(image.hinh_id)}
                      title="Xóa hình ảnh"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* =========================
              EMPTY STATE
          ========================= */}
          {currentImages.length === 0 && (
            <div className="empty-state">
              <h2>
                {tab === "created"
                  ? "Bạn chưa tạo ảnh nào"
                  : "Bạn chưa lưu ảnh nào"}
              </h2>

              <p>Hãy khám phá và lưu những hình ảnh bạn thích.</p>

              {tab === "created" && (
                <button
                  className="primary-button"
                  onClick={() => navigate("/add")}
                >
                  <Plus size={18} />
                  Tạo ảnh đầu tiên
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
