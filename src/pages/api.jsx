import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/v1",
  withCredentials: true, // Quan trọng để gửi HTTPOnly Cookie
});

// Hàm gọi API để lấy Access Token mới
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");// Lấy refresh token từ localStorage
  
  if (!refreshToken) {
    console.error(" Không thấy refreshToken!");
    throw new Error("Refresh token is missing");
  }
  try {
    const response = await api.post("/auth/refresh", { 
      refreshToken 
    });
    // Lưu access token & refresh token mới vào localStorage
    localStorage.setItem("accessToken", response.data.data.accessToken);
    localStorage.setItem("refreshToken", response.data.data.refreshToken);
    return response.data.data.accessToken;
  } catch (error) {
    console.error("Refresh token failed", error);
    throw error;
  }
};

// Interceptor để thêm Access Token vào request
api.interceptors.request.use(
  (config) => {
    let accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      accessToken = accessToken.replace(/^Bearer\s/, ""); // Xóa "Bearer " nếu có
      // console.log("Access Token được gửi:", accessToken);
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      console.warn("Không tìm thấy accessToken trong localStorage!");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let refreshSubscribers = [];
// Interceptor xử lý lỗi 401 và tự động refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshAccessToken();
        api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;

        refreshSubscribers.forEach((callback) => callback(newAccessToken));
        refreshSubscribers = [];

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Session expired. Redirecting to login...");
        localStorage.removeItem("accessToken");
        window.location.href = "";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
