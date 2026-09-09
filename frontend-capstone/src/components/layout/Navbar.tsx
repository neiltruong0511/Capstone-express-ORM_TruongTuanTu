import { useEffect, useState } from "react";
import {
  Search,
  Bell,
  MessageCircle,
  ChevronDown,
  Plus,
  LogOut,
  User,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface NavbarProps {
  onSearch?: (keyword: string) => void;
}

export default function Navbar({ onSearch }: NavbarProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [keyword, setKeyword] = useState("");
  const [openMenu, setOpenMenu] = useState(false);

  // =========================
  // ĐỒNG BỘ USER SAU KHI LOGIN
  // =========================
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const handleAuthChanged = () => {
      forceUpdate((prev) => prev + 1);
    };

    window.addEventListener("authChanged", handleAuthChanged);

    return () => {
      window.removeEventListener("authChanged", handleAuthChanged);
    };
  }, []);

  // =========================
  // SEARCH
  // =========================
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    onSearch?.(keyword);
  };

  // =========================
  // AVATAR
  // =========================
  const avatar = user?.anh_dai_dien?.trim() || "";

  const avatarLetter = user?.ho_ten?.charAt(0).toUpperCase() || "S";

  return (
    <header className="navbar">
      {/* HOME */}
      <div className="navbar-home" onClick={() => navigate("/")}>
        Trang chủ
      </div>

      {/* CREATE */}
      <div className="navbar-create" onClick={() => navigate("/add")}>
        Tạo
        <ChevronDown size={16} />
      </div>

      {/* SEARCH */}
      <form className="navbar-search" onSubmit={handleSearch}>
        <Search size={20} />

        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Tìm kiếm"
        />
      </form>

      {/* ACTIONS */}
      <div className="navbar-actions">
        {/* NOTIFICATION */}
        <button type="button">
          <Bell size={22} />
          <span className="notification">83</span>
        </button>

        {/* MESSAGE */}
        <button type="button">
          <MessageCircle size={21} />
        </button>

        {/* PROFILE */}
        <div className="profile-menu-wrapper">
          <button
            type="button"
            className="avatar-button"
            onClick={() => setOpenMenu((prev) => !prev)}
          >
            {avatar ? (
              <img
                src={avatar}
                alt={user?.ho_ten || "Avatar"}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <span>{avatarLetter}</span>
            )}
          </button>

          {/* DROPDOWN */}
          {openMenu && (
            <div className="profile-dropdown">
              {user ? (
                <>
                  {/* PROFILE */}
                  <div
                    className="dropdown-user"
                    onClick={() => {
                      navigate("/profile");
                      setOpenMenu(false);
                    }}
                  >
                    <User size={18} />
                    Hồ sơ
                  </div>

                  {/* ADD IMAGE */}
                  <div
                    className="dropdown-user"
                    onClick={() => {
                      navigate("/add");
                      setOpenMenu(false);
                    }}
                  >
                    <Plus size={18} />
                    Thêm một ảnh
                  </div>

                  {/* EDIT PROFILE */}
                  <div
                    className="dropdown-user"
                    onClick={() => {
                      navigate("/profile/edit");
                      setOpenMenu(false);
                    }}
                  >
                    <User size={18} />
                    Chỉnh sửa hồ sơ
                  </div>

                  <hr />

                  {/* LOGOUT */}
                  <div
                    className="dropdown-user logout"
                    onClick={() => {
                      logout();
                      setOpenMenu(false);
                      navigate("/");
                    }}
                  >
                    <LogOut size={18} />
                    Đăng xuất
                  </div>
                </>
              ) : (
                <>
                  {/* LOGIN */}
                  <div
                    className="dropdown-user"
                    onClick={() => {
                      navigate("/login");
                      setOpenMenu(false);
                    }}
                  >
                    Đăng nhập
                  </div>

                  {/* REGISTER */}
                  <div
                    className="dropdown-user"
                    onClick={() => {
                      navigate("/register");
                      setOpenMenu(false);
                    }}
                  >
                    Đăng ký
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
