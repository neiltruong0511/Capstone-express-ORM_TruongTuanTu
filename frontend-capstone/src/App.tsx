import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";

import HomePage from "./pages/HomePage";
import ImageDetailPage from "./pages/ImageDetailPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import AddImagePage from "./pages/AddImagePage";

import LoginModal from "./components/auth/LoginModal";
import RegisterModal from "./components/auth/RegisterModal";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />

          <Route path="/images/:id" element={<ImageDetailPage />} />

          <Route path="/profile" element={<ProfilePage />} />

          <Route path="/profile/edit" element={<EditProfilePage />} />

          <Route path="/add" element={<AddImagePage />} />

          <Route path="/login" element={<LoginModal />} />

          <Route path="/register" element={<RegisterModal />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
