import { useParams } from "react-router-dom";
import ImageDetail from "../components/image/ImageDetail";

export default function ImageDetailPage() {
  const { id } = useParams<{ id: string }>();

  const imageId = Number(id);

  // Kiểm tra ID
  if (!id || !Number.isInteger(imageId) || imageId <= 0) {
    return <div className="empty-state">ID hình ảnh không hợp lệ</div>;
  }

  return <ImageDetail imageId={imageId} />;
}
