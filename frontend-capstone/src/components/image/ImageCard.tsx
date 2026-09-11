import { useNavigate } from "react-router-dom";
import type { ImageItem } from "../../types/image";

interface ImageCardProps {
  image: ImageItem;
}

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

const getImageUrl = (url?: string | null) => {
  if (!url) return null;

  // Ảnh Cloudinary hoặc URL đầy đủ
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Ảnh upload local từ backend
  if (url.startsWith("/")) {
    return `${SERVER_URL}${url}`;
  }

  return `${SERVER_URL}/${url}`;
};

export default function ImageCard({ image }: ImageCardProps) {
  const navigate = useNavigate();

  const imageUrl = getImageUrl(image.duong_dan);

  return (
    <article
      className="image-card"
      onClick={() => navigate(`/images/${image.hinh_id}`)}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={image.ten_hinh || "Hình ảnh"} loading="lazy" />
      ) : (
        <div className="image-card-placeholder">
          <span>Không có hình ảnh</span>
        </div>
      )}

      <div className="image-card-overlay">
        <h3>{image.ten_hinh}</h3>

        {image.nguoi_dung && <p>{image.nguoi_dung.ho_ten}</p>}
      </div>
    </article>
  );
}
