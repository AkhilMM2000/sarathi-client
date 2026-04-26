import { toast } from "react-toastify";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TOKEN_KEY = "accessToken";

export const UserAPI: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/users`,
  withCredentials: true,
});

export const DriverAPI: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/drivers`,
  withCredentials: true,
});

export const AdminAPI: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/admin`,
  withCredentials: true,
});

/**
 * Sets up both Request and Response interceptors for a given Axios instance.
 * @param instance The Axios instance (User, Driver, or Admin)
 * @param loginPath The redirect path if authentication fails
 */
const setupInterceptors = (instance: AxiosInstance, loginPath: string) => {
  // 1. Request Interceptor: Attach Unified Token
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token && config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  // 2. Response Interceptor: Handle Refresh & Redirects
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

      // Handle 403 (Forbidden) - Permission Issues
      if (error.response?.status === 403) {
        // 1. Handle blocked accounts immediately
        if ((error.response?.data as any)?.blocked) {
          toast.error("Your account has been blocked. Please contact support.");
          localStorage.removeItem(TOKEN_KEY);
          window.location.href = loginPath;
          return Promise.reject(error);
        }

        // 2. Handle generic permission errors (Wrong Role)
        toast.error("You are not authorized to access this resource.");
        window.location.href = "/";
        return Promise.reject(error);
      }

      // Handle 401 (Unauthorized) - Token Expired
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Unified Refresh: No body needed, backend uses unified refresh_token cookie
          const res = await axios.post<{ accessToken: string }>(
            `${BASE_URL}/auth/refresh-token`,
            {},
            { withCredentials: true }
          );

          const newAccessToken = res.data.accessToken;
          localStorage.setItem(TOKEN_KEY, newAccessToken);

          // Retry the original request with the new token
          if (originalRequest.headers) {
            originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          }
          return axios(originalRequest);
        } catch (refreshError) {
          console.error("Session expired. Redirecting to login...", refreshError);
          
          toast.error("Session expired. Please login again.");
          localStorage.removeItem(TOKEN_KEY);
          window.location.href = loginPath;
          
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

// Standardize all APIs with their respective login/redirect paths
setupInterceptors(UserAPI, "/login?type=user");
setupInterceptors(DriverAPI, "/login?type=driver");
setupInterceptors(AdminAPI, "/admin");