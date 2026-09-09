import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("REQUEST BASE URL:", config.baseURL);
    console.log("REQUEST URL:", config.url);
    console.log("REQUEST METHOD:", config.method);
    console.log("REQUEST DATA:", config.data);

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;