import { useState } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface RegisterModalProps {
  onClose?: () => void;
}

export default function RegisterModal({ onClose }: RegisterModalProps) {
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [hoTen, setHoTen] = useState("");
  const [tuoi, setTuoi] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!email || !matKhau || !hoTen || !tuoi) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      await register({
        email,
        mat_khau: matKhau,
        ho_ten: hoTen,
        tuoi: Number(tuoi),
      });

      alert("Đăng ký thành công! Vui lòng đăng nhập.");

      navigate("/login");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Đăng ký thất bại");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="auth-modal register-modal">
        <button
          className="modal-close"
          onClick={() => (onClose ? onClose() : navigate("/"))}
        >
          <X size={28} />
        </button>

        <h1>Welcome to my picture</h1>

        <p className="auth-subtitle">Tìm những ý tưởng mới để thử</p>

        <form onSubmit={handleSubmit}>
          <label>Email</label>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Mật khẩu</label>

          <input
            type="password"
            placeholder="Tạo mật khẩu"
            value={matKhau}
            onChange={(e) => setMatKhau(e.target.value)}
          />

          <label>Họ tên</label>

          <input
            type="text"
            placeholder="Họ tên"
            value={hoTen}
            onChange={(e) => setHoTen(e.target.value)}
          />

          <label>Tuổi</label>

          <input
            type="number"
            placeholder="Tuổi"
            value={tuoi}
            onChange={(e) => setTuoi(e.target.value)}
          />

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        <p className="auth-switch">
          Đã có tài khoản?{" "}
          <span onClick={() => navigate("/login")}>Đăng nhập</span>
        </p>
      </div>
    </div>
  );
}
