import { useState } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface LoginModalProps {
  onClose?: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const navigate = useNavigate();

  const { login, getCurrentUser, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !matKhau.trim()) {
      setError("Vui lòng nhập email và mật khẩu");
      return;
    }

    try {
      // 1. Login
      await login({
        email: email.trim(),
        mat_khau: matKhau,
      });

      // 2. Lấy thông tin user mới nhất
      // bao gồm ảnh đại diện nếu backend trả về
      await getCurrentUser();

      // 3. Đóng modal
      onClose?.();

      // 4. Về trang chủ
      navigate("/");
    } catch (err: any) {
      console.error("Login error:", err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Đăng nhập thất bại",
      );
    }
  };

  return (
    <div className="modal-overlay">
      <div className="auth-modal">
        {/* Close */}
        <button
          type="button"
          className="modal-close"
          onClick={() => {
            if (onClose) {
              onClose();
            } else {
              navigate("/");
            }
          }}
        >
          <X size={28} />
        </button>

        <h1>Welcome to my picture</h1>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <label>Email</label>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          {/* Password */}
          <label>Mật khẩu</label>

          <input
            type="password"
            placeholder="Mật khẩu"
            value={matKhau}
            onChange={(e) => setMatKhau(e.target.value)}
            autoComplete="current-password"
          />

          {/* Error */}
          {error && <p className="form-error">{error}</p>}

          {/* Submit */}
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <p className="auth-switch">
          Chưa có tài khoản?{" "}
          <span
            onClick={() => {
              onClose?.();
              navigate("/register");
            }}
          >
            Đăng ký
          </span>
        </p>
      </div>
    </div>
  );
}
