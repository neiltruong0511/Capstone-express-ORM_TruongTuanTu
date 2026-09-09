import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import ImageGrid from "../components/image/ImageGrid";
import { useImages } from "../hooks/useImages";

export default function HomePage() {
  const { images, loading, error, searchImages, getImages } = useImages();

  const [searchParams] = useSearchParams();

  const keyword = searchParams.get("search") || "";

  useEffect(() => {
    if (keyword) {
      searchImages(keyword);
    } else {
      getImages();
    }
  }, [keyword]);

  return (
    <div className="home-page">
      <div className="home-heading">
        <div>
          <h1>
            {keyword ? `Kết quả cho "${keyword}"` : "Khám phá ý tưởng tưởng"}
          </h1>

          <p>Tìm những hình ảnh và ý tưởng bạn yêu thích</p>
        </div>
      </div>

      {error && <div className="error-box">{error}</div>}

      <ImageGrid images={images} loading={loading} />
    </div>
  );
}
