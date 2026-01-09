import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

export const axiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let isRefreshing = false;
let failedQueue: ((token: string) => void)[] = [];

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const { data } = await axiosInstance.post("/auth/refresh");

          localStorage.setItem("accessToken", data.accessToken);

          failedQueue.forEach((cb) => cb(data.accessToken));
          failedQueue = [];
        } catch {
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve) => {
        failedQueue.push((token: string) => {
          originalRequest.headers = {
            ...(originalRequest.headers || {}),
            Authorization: "Bearer " + token,
          };

          resolve(axiosInstance(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);
