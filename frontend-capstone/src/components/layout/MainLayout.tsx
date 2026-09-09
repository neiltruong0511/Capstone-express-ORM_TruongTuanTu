import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function MainLayout() {
  const navigate = useNavigate();

  return (
    <div className="app-layout">
      <Navbar
        onSearch={(keyword) => {
          navigate(
            keyword.trim() ? `/?search=${encodeURIComponent(keyword)}` : "/",
          );
        }}
      />

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
