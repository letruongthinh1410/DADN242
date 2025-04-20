import axios from "axios";
import { eventBus } from "./components/EventBus/eventBus";
const api = axios.create({
  baseURL: "http://localhost:8080/v1",
});

const rawAxios = axios.create({
  baseURL: "http://localhost:8080/v1",
});

const refreshAccessToken = async () => {
  const rfToken = localStorage.getItem("refreshToken");
  console.log("refreshToken hiện tại:", rfToken);
  if (!rfToken) {
    console.error("Refresh token không tồn tại hoặc đã hết hạn!");
    throw new Error("Refresh token is missing");
  }

  try {
    const response = await rawAxios.post("/auth/refresh", {
      refreshToken: rfToken,
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data.data;

    // Lưu token mới vào localStorage
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", newRefreshToken);
    eventBus.emit("accessTokenRefreshed"); // Gửi thông báo cho toàn bộ app biết token đã được làm mới
    return accessToken;
  } catch (error) {
    console.error("Refresh token failed", error.response?.data || error.message);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    console.error("Token đã hết hạn, vui lòng đăng nhập lại!");
    window.location.href = "";
    throw error;
  }
};

// Gắn accessToken vào tất cả request
api.interceptors.request.use(
  (config) => {
    const noAuthPaths = ["/auth/login", "/auth/register","user/forgot-password","user/reset-password"]; // Các path không cần token
    const requiresAuth = !noAuthPaths.some((path) => config.url.includes(path));
    if (requiresAuth) {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      } else {
        console.warn("Không tìm thấy accessToken trong localStorage!");
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let refreshSubscribers = [];

function onAccessTokenFetched(newToken) {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
        // Fallback nếu error không có response
    if (!error.response) {
      console.error("Không có response từ server:", error);
      return Promise.reject(error);
    }
    // Không xử lý nếu lỗi không phải 401 hoặc đã retry
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      console.log("Đang chờ token mới, đưa vào hàng đợi:", originalRequest.url);
      return new Promise((resolve) => {
        refreshSubscribers.push((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      const newAccessToken = await refreshAccessToken();

      // Cập nhật headers mặc định của axios
      api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
      onAccessTokenFetched(newAccessToken);

      // Gán lại token vào request cũ
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (err) {
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;