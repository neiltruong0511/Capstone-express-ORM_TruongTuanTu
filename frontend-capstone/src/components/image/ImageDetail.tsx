import { useEffect, useState } from "react";
import { Heart, MoreHorizontal, Send, Bookmark, Loader2 } from "lucide-react";

import { useImages } from "../../hooks/useImages";

import type {
  Comment,
  ImageDetail as ImageDetailType,
} from "../../types/image";

interface ImageDetailProps {
  imageId: number;
}

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

const getImageUrl = (url?: string | null) => {
  if (!url) return "";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  if (url.startsWith("/")) {
    return `${SERVER_URL}${url}`;
  }

  return `${SERVER_URL}/${url}`;
};

export default function ImageDetail({ imageId }: ImageDetailProps) {
  const {
    getImageDetail,
    getComments,
    addComment,
    checkSaved,
    saveImage,
    unsaveImage,
  } = useImages();

  const [image, setImage] = useState<ImageDetailType | null>(null);

  const [comments, setComments] = useState<Comment[]>([]);

  const [saved, setSaved] = useState(false);

  const [commentText, setCommentText] = useState("");

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  // =========================
  // LOAD IMAGE DETAIL
  // =========================

  useEffect(() => {
    if (!imageId || !Number.isInteger(imageId) || imageId <= 0) {
      setError("ID hình ảnh không hợp lệ");
      setImage(null);
      setComments([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        // 1. Lấy thông tin hình ảnh
        const imageData = await getImageDetail(imageId);

        if (cancelled) return;

        setImage(imageData);

        // 2. Lấy danh sách bình luận
        try {
          const commentData = await getComments(imageId);

          if (!cancelled) {
            setComments(Array.isArray(commentData) ? commentData : []);
          }
        } catch {
          if (!cancelled) {
            setComments([]);
          }
        }

        // 3. Kiểm tra hình ảnh đã lưu
        const token = localStorage.getItem("accessToken");

        if (token) {
          try {
            const isSaved = await checkSaved(imageId);

            if (!cancelled) {
              setSaved(Boolean(isSaved));
            }
          } catch {
            if (!cancelled) {
              setSaved(false);
            }
          }
        } else {
          setSaved(false);
        }
      } catch (error: any) {
        if (!cancelled) {
          setError(error?.response?.data?.message || "Không thể tải hình ảnh");

          setImage(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [imageId]);

  // =========================
  // SAVE / UNSAVE
  // =========================

  const handleSave = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("Bạn cần đăng nhập để lưu hình ảnh");
      return;
    }

    if (!imageId || !Number.isInteger(imageId)) {
      alert("ID hình ảnh không hợp lệ");
      return;
    }

    try {
      if (saved) {
        await unsaveImage(imageId);
        setSaved(false);
      } else {
        await saveImage(imageId);
        setSaved(true);
      }
    } catch (error: any) {
      alert(error?.response?.data?.message || "Không thể lưu hình ảnh");
    }
  };

  // =========================
  // ADD COMMENT
  // =========================

  const handleComment = async () => {
    const content = commentText.trim();

    if (!content) return;

    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("Bạn cần đăng nhập để bình luận");
      return;
    }

    if (submitting) return;

    if (!imageId || !Number.isInteger(imageId)) {
      alert("ID hình ảnh không hợp lệ");
      return;
    }

    try {
      setSubmitting(true);

      await addComment(imageId, content);

      setCommentText("");

      const newComments = await getComments(imageId);

      setComments(Array.isArray(newComments) ? newComments : []);
    } catch (error: any) {
      alert(error?.response?.data?.message || "Không thể thêm bình luận");
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // ENTER COMMENT
  // =========================

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleComment();
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="detail-loading">
        <Loader2 size={24} className="loading-spinner" />
        <span>Đang tải...</span>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return <div className="empty-state">{error}</div>;
  }

  // =========================
  // NO IMAGE
  // =========================

  if (!image) {
    return <div className="empty-state">Không tìm thấy hình ảnh</div>;
  }

  // =========================
  // RENDER
  // =========================

  return (
    <div className="detail-container">
      {/* IMAGE */}

      <div className="detail-image-section">
        <img src={getImageUrl(image.duong_dan)} alt={image.ten_hinh} />
      </div>

      {/* INFO */}

      <div className="detail-info">
        {/* TOP ACTIONS */}

        <div className="detail-top">
          <button type="button" className="icon-button" title="Tùy chọn">
            <MoreHorizontal />
          </button>

          <div className="detail-actions">
            <button type="button" className="icon-button" title="Thích">
              <Heart />
            </button>

            <button
              type="button"
              className={`save-button ${saved ? "saved" : ""}`}
              onClick={handleSave}
            >
              <Bookmark size={18} />

              {saved ? "Đã lưu" : "Lưu"}
            </button>
          </div>
        </div>

        {/* TITLE */}

        <h1>{image.ten_hinh}</h1>

        {/* DESCRIPTION */}

        {image.mo_ta && <p className="detail-description">{image.mo_ta}</p>}

        {/* CREATOR */}

        {image.nguoi_dung && (
          <div className="creator">
            <div className="creator-avatar">
              {image.nguoi_dung.anh_dai_dien ? (
                <img
                  src={getImageUrl(image.nguoi_dung.anh_dai_dien)}
                  alt={image.nguoi_dung.ho_ten || ""}
                />
              ) : (
                image.nguoi_dung.ho_ten?.charAt(0).toUpperCase() || "U"
              )}
            </div>

            <div>
              <strong>{image.nguoi_dung.ho_ten}</strong>

              <span>Người tạo hình ảnh</span>
            </div>
          </div>
        )}

        {/* COMMENTS */}

        <div className="comments">
          <h2>{comments.length} nhận xét</h2>

          <div className="comment-list">
            {comments.length === 0 ? (
              <div className="empty-comments">
                <p>Chưa có nhận xét nào.</p>

                <span>Hãy là người đầu tiên nhận xét về hình ảnh này.</span>
              </div>
            ) : (
              comments.map((comment) => (
                <div className="comment-item" key={comment.binh_luan_id}>
                  {/* AVATAR */}

                  <div className="comment-avatar">
                    {comment.nguoi_dung?.anh_dai_dien ? (
                      <img
                        src={getImageUrl(comment.nguoi_dung.anh_dai_dien)}
                        alt={comment.nguoi_dung?.ho_ten || "User"}
                      />
                    ) : (
                      comment.nguoi_dung?.ho_ten?.charAt(0).toUpperCase() || "U"
                    )}
                  </div>

                  {/* CONTENT */}

                  <div className="comment-content">
                    <strong>
                      {comment.nguoi_dung?.ho_ten || "Người dùng"}
                    </strong>

                    <p>{comment.noi_dung}</p>

                    <small>
                      {comment.ngay_binh_luan
                        ? new Date(comment.ngay_binh_luan).toLocaleDateString(
                            "vi-VN",
                          )
                        : ""}
                    </small>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* COMMENT FORM */}

          <div className="comment-form">
            <div className="comment-avatar">U</div>

            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Thêm bình luận "
              disabled={submitting}
            />

            <button
              type="button"
              onClick={handleComment}
              disabled={submitting || !commentText.trim()}
              title="Gửi nhận xét"
            >
              {submitting ? (
                <Loader2 size={18} className="loading-spinner" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
