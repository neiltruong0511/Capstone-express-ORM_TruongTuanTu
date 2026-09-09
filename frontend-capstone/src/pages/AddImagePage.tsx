import { useRef, useState } from "react";

import { Upload, X } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useImages } from "../hooks/useImages";

export default function AddImagePage() {
  const navigate = useNavigate();

  const { uploadImage } = useImages();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);

  const [preview, setPreview] = useState("");

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);

  const handleFileChange = (selectedFile?: File) => {
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      alert("Vui lòng chọn file hình ảnh");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("Hình ảnh không được vượt quá 5MB");
      return;
    }

    setFile(selectedFile);

    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert("Vui lòng chọn hình ảnh");
      return;
    }

    if (!title.trim()) {
      alert("Vui lòng nhập tiêu đề");
      return;
    }

    try {
      setLoading(true);

      await uploadImage(file, title, description);

      alert("Thêm hình ảnh thành công!");

      navigate("/profile");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Upload hình ảnh thất bại");
    } finally {
      setLoading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview("");
  };

  return (
    <div className="add-image-page">
      <div className="add-image-card">
        <div className="add-image-header">
          <h1>Tạo một Ghim</h1>

          <button onClick={() => navigate(-1)}>
            <X />
          </button>
        </div>

        <form className="add-image-form" onSubmit={handleSubmit}>
          <div className="upload-section">
            {preview ? (
              <div className="preview-container">
                <img src={preview} alt="Preview" />

                <button
                  type="button"
                  className="remove-preview"
                  onClick={removeFile}
                >
                  <X />
                </button>
              </div>
            ) : (
              <div
                className="upload-box"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={32} />

                <h3>Chọn hình ảnh</h3>

                <p>Kéo và thả hoặc nhấp để tải lên</p>

                <span>JPG, PNG, WEBP tối đa 5MB</span>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => handleFileChange(e.target.files?.[0])}
            />
          </div>

          <div className="upload-info">
            <label>Tiêu đề</label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Thêm tiêu đề"
            />

            <label>Mô tả</label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Cho mọi người biết Ghim của bạn nói về điều gì"
              rows={5}
            />

            <button
              type="submit"
              className="primary-button upload-button"
              disabled={loading}
            >
              {loading ? "Đang tải lên..." : "Tạo Ghim"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
