import { useCallback, useState } from "react";
import axiosClient from "../api/axiosClient";

import type {
  ImageItem,
  ImageDetail,
  Comment,
} from "../types/image";

const getData = <T,>(responseData: any): T => {
  return (
    responseData?.content ??
    responseData?.data?.content ??
    responseData?.data ??
    responseData
  );
};

export const useImages = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // GET ALL IMAGES
  // GET /api/images
  // =========================

  const getImages = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axiosClient.get("/images");

      const data = getData<ImageItem[]>(response.data);

      const result = Array.isArray(data) ? data : [];

      setImages(result);

      return result;
    } catch (err: any) {
      console.error("Get images error:", err);

      const message =
        err?.response?.data?.message ||
        "Không thể tải danh sách hình ảnh";

      setError(message);

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================
  // SEARCH IMAGES
  // GET /api/images/search
  // =========================

  const searchImages = useCallback(
    async (keyword: string) => {
      const searchKeyword = keyword.trim();

      setLoading(true);
      setError("");

      try {
        // Nếu không có từ khóa
        // thì lấy lại toàn bộ hình ảnh
        if (!searchKeyword) {
          return await getImages();
        }

        const response = await axiosClient.get(
          "/images/search",
          {
            params: {
              keyword: searchKeyword,
            },
          }
        );

        const data = getData<ImageItem[]>(
          response.data
        );

        const result = Array.isArray(data)
          ? data
          : [];

        setImages(result);

        return result;
      } catch (err: any) {
        console.error("Search images error:", err);

        const message =
          err?.response?.data?.message ||
          "Không thể tìm kiếm hình ảnh";

        setError(message);

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getImages]
  );

  // =========================
  // GET IMAGE DETAIL
  // GET /api/images/:id
  // =========================

  const getImageDetail = useCallback(
    async (id: number): Promise<ImageDetail> => {
      if (
        !Number.isInteger(id) ||
        id <= 0
      ) {
        throw new Error(
          `ID hình không hợp lệ: ${id}`
        );
      }

      const response = await axiosClient.get(
        `/images/${id}`
      );

      return getData<ImageDetail>(
        response.data
      );
    },
    []
  );

  // =========================
  // GET COMMENTS
  // GET /api/images/:id/comments
  // =========================

  const getComments = useCallback(
    async (imageId: number): Promise<Comment[]> => {
      if (
        !Number.isInteger(imageId) ||
        imageId <= 0
      ) {
        return [];
      }

      const response = await axiosClient.get(
        `/images/${imageId}/comments`
      );

      const data = getData<Comment[]>(
        response.data
      );

      return Array.isArray(data)
        ? data
        : [];
    },
    []
  );

  // =========================
  // ADD COMMENT
  // POST /api/images/:id/comments
  // =========================

  const addComment = useCallback(
    async (
      id: number,
      noi_dung: string
    ) => {
      if (
        !Number.isInteger(id) ||
        id <= 0
      ) {
        throw new Error(
          `ID hình không hợp lệ: ${id}`
        );
      }

      const content = noi_dung.trim();

      if (!content) {
        throw new Error(
          "Nội dung bình luận không được để trống"
        );
      }

      const response = await axiosClient.post(
        `/images/${id}/comments`,
        {
          noi_dung: content,
        }
      );

      return response.data;
    },
    []
  );

  // =========================
  // CHECK SAVED
  // GET /api/images/:id/saved
  // =========================

  const checkSaved = useCallback(
    async (id: number): Promise<boolean> => {
      if (
        !Number.isInteger(id) ||
        id <= 0
      ) {
        return false;
      }

      const response = await axiosClient.get(
        `/images/${id}/saved`
      );

      const data = getData<any>(
        response.data
      );

      if (typeof data === "boolean") {
        return data;
      }

      return Boolean(data?.saved);
    },
    []
  );

  // =========================
  // SAVE IMAGE
  // POST /api/images/:id/save
  // =========================

  const saveImage = useCallback(
    async (id: number) => {
      if (
        !Number.isInteger(id) ||
        id <= 0
      ) {
        throw new Error(
          `ID hình không hợp lệ: ${id}`
        );
      }

      const response = await axiosClient.post(
        `/images/${id}/save`
      );

      return response.data;
    },
    []
  );

  // =========================
  // UNSAVE IMAGE
  // DELETE /api/images/:id/save
  // =========================

  const unsaveImage = useCallback(
    async (id: number) => {
      if (
        !Number.isInteger(id) ||
        id <= 0
      ) {
        throw new Error(
          `ID hình không hợp lệ: ${id}`
        );
      }

      const response =
        await axiosClient.delete(
          `/images/${id}/save`
        );

      return response.data;
    },
    []
  );

  // =========================
  // GET SAVED IMAGES
  // GET /api/users/saved-images
  // =========================

  const getSavedImages = useCallback(
    async (): Promise<ImageItem[]> => {
      const response =
        await axiosClient.get(
          "/users/saved-images"
        );

      const data = getData<ImageItem[]>(
        response.data
      );

      return Array.isArray(data)
        ? data
        : [];
    },
    []
  );

  // =========================
  // GET CREATED IMAGES
  // GET /api/users/created-images
  // =========================

  const getCreatedImages = useCallback(
    async (): Promise<ImageItem[]> => {
      const response =
        await axiosClient.get(
          "/users/created-images"
        );

      const data = getData<ImageItem[]>(
        response.data
      );

      return Array.isArray(data)
        ? data
        : [];
    },
    []
  );

  // =========================
  // UPLOAD IMAGE
  // POST /api/images
  // =========================

  const uploadImage = useCallback(
    async (
      file: File,
      ten_hinh: string,
      mo_ta: string
    ) => {
      if (!file) {
        throw new Error(
          "Vui lòng chọn hình ảnh"
        );
      }

      if (!ten_hinh.trim()) {
        throw new Error(
          "Tên hình không được để trống"
        );
      }

      const formData = new FormData();

      formData.append(
        "image",
        file
      );

      formData.append(
        "ten_hinh",
        ten_hinh.trim()
      );

      formData.append(
        "mo_ta",
        mo_ta.trim()
      );

      const response =
        await axiosClient.post(
          "/images",
          formData
        );

      return response.data;
    },
    []
  );

  // =========================
  // DELETE IMAGE
  // DELETE /api/images/:id
  // =========================

  const deleteImage = useCallback(
    async (id: number) => {
      if (
        !Number.isInteger(id) ||
        id <= 0
      ) {
        throw new Error(
          `ID hình không hợp lệ: ${id}`
        );
      }

      const response =
        await axiosClient.delete(
          `/images/${id}`
        );

      return response.data;
    },
    []
  );

  // =========================
  // RETURN
  // =========================

  return {
    images,
    loading,
    error,

    getImages,
    searchImages,

    getImageDetail,
    getComments,
    addComment,

    checkSaved,
    saveImage,
    unsaveImage,

    getSavedImages,
    getCreatedImages,

    uploadImage,
    deleteImage,
  };
};