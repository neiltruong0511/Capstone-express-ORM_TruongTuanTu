import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import type { LoginPayload, RegisterPayload } from "../types/auth";
import type { User } from "../types/user";

const ACCESS_TOKEN = "accessToken";
const USER_INFO = "USER_INFO";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem(USER_INFO);

    if (!savedUser) return null;

    try {
      return JSON.parse(savedUser);
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  // =========================
  // LOGIN
  // =========================
  const login = async (payload: LoginPayload) => {
    setLoading(true);

    try {
      const response = await axiosClient.post(
        "/auth/login",
        payload
      );

      console.log("LOGIN RESPONSE:", response.data);

      // Backend:
      // response.data = {
      //   message,
      //   content: {
      //     user,
      //     accessToken
      //   }
      // }

      const result = response.data?.content;

      const accessToken = result?.accessToken;
      const loggedUser = result?.user;

      if (!accessToken) {
        throw new Error("Không nhận được accessToken");
      }

      if (!loggedUser) {
        throw new Error("Không nhận được thông tin người dùng");
      }

      // Lưu token
      localStorage.setItem(
        ACCESS_TOKEN,
        accessToken
      );

      // Lưu user
      localStorage.setItem(
        USER_INFO,
        JSON.stringify(loggedUser)
      );

      // Update React state
      setUser(loggedUser);

      // Thông báo cho Navbar
      window.dispatchEvent(
        new Event("authChanged")
      );

      return {
        accessToken,
        user: loggedUser,
      };
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // REGISTER
  // =========================
  const register = async (
    payload: RegisterPayload
  ) => {
    setLoading(true);

    try {
      const response = await axiosClient.post(
        "/auth/register",
        payload
      );

      return response.data;
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(USER_INFO);

    setUser(null);

    window.dispatchEvent(
      new Event("authChanged")
    );
  };

  // =========================
  // GET CURRENT USER
  // =========================
  const getCurrentUser = async () => {
    const token = localStorage.getItem(
      ACCESS_TOKEN
    );

    if (!token) {
      setUser(null);
      return null;
    }

    try {
      const response = await axiosClient.get(
        "/users/me"
      );

      console.log(
        "CURRENT USER RESPONSE:",
        response.data
      );

      const result =
        response.data?.content ??
        response.data?.data ??
        response.data;

      localStorage.setItem(
        USER_INFO,
        JSON.stringify(result)
      );

      setUser(result);

      window.dispatchEvent(
        new Event("authChanged")
      );

      return result;
    } catch (error) {
      console.error(
        "Get current user error:",
        error
      );

      logout();

      return null;
    }
  };

  // =========================
  // LISTEN AUTH CHANGED
  // =========================
  useEffect(() => {
    const handleAuthChanged = () => {
      const token = localStorage.getItem(
        ACCESS_TOKEN
      );

      const savedUser =
        localStorage.getItem(USER_INFO);

      if (!token || !savedUser) {
        setUser(null);
        return;
      }

      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
      }
    };

    window.addEventListener(
      "authChanged",
      handleAuthChanged
    );

    return () => {
      window.removeEventListener(
        "authChanged",
        handleAuthChanged
      );
    };
  }, []);

  // =========================
  // LOAD USER KHI REFRESH
  // =========================
  useEffect(() => {
    const token = localStorage.getItem(
      ACCESS_TOKEN
    );

    const savedUser =
      localStorage.getItem(USER_INFO);

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  return {
    user,
    loading,
    isLoggedIn: !!user,

    login,
    register,
    logout,
    getCurrentUser,
  };
};