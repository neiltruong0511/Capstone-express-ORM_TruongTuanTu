import ImageCard from "./ImageCard";
import type { ImageItem } from "../../types/image";

interface ImageGridProps {
  images: ImageItem[];
  loading?: boolean;
}

export default function ImageGrid({ images, loading = false }: ImageGridProps) {
  if (loading) {
    return (
      <div className="masonry-grid">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="image-skeleton" />
        ))}
      </div>
    );
  }

  if (!images.length) {
    return (
      <div className="empty-state">
        <h2>Không tìm thấy hình ảnh</h2>
        <p>Hãy thử tìm kiếm với từ khóa khác.</p>
      </div>
    );
  }

  return (
    <div className="masonry-grid">
      {images.map((image) => (
        <ImageCard key={image.hinh_id} image={image} />
      ))}
    </div>
  );
}
