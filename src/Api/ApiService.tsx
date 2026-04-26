import axios from "axios";
import { AdminAPI, DriverAPI, UserAPI } from "./AxiosInterceptor";

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL 
  }

  async registerUser(userData: Record<string, any>, type: "users" | "drivers") {
    try {
      const response = await axios.post(`${this.baseUrl}/${type}/register`, userData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || error.response?.data?.error || "Registration failed";
    }
  }
  
  async verifyOtp(otp: string, email: string, type: "users" | "drivers") {
    try {
      const response = await axios.post(`${this.baseUrl}/${type}/verify-otp`, { 
        otp, 
        email,
        role: type === "drivers" ? "driver" : "user" 
      }, { withCredentials: true });
      return response.data;
    } catch (error: any) {
      throw error; 
    }
  }

  async resendOTP(email: string, role: string) {
    try {
      const type = role === "driver" ? "drivers" : "users";
      const response = await axios.post(`${this.baseUrl}/${type}/resend-otp`, { email, role });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  async uploadImage(image: File) {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "Sarathi");
    formData.append("cloud_name", "dcoo56p7a");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dcoo56p7a/image/upload",
        formData
      );

      if (response.status === 200) {
        return response.data.secure_url;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      return null; 
    }
  }

  async getSignedUrls(fileType: string, fileName: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/files/signed-url`, {
        params: { fileType, fileName },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || "Failed to get signed URL";
    }
  }
  
  async uploadFile(file: File, signedData: any, onProgress?: (percent: number) => void): Promise<string> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
      formData.append("timestamp", signedData.timestamp.toString());
      formData.append("signature", signedData.signature);
      formData.append("public_id", signedData.public_id);
      formData.append("folder", signedData.folder);

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              onProgress(percentCompleted);
            }
          }
        }
      );

      if (response.status === 200) {
        return response.data.public_id;
      }

      throw new Error("File upload failed");
    } catch (error: any) {
      throw error.response?.data?.message || "File upload failed";
    }
  }
  
  async chatSignedUrls(role: "driver" | "user", fileType: string) {
    try {
      const api = role === 'user' ? UserAPI : DriverAPI;
      const response = await api.post('/chat/signature', { fileType });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || "Failed to get signed URL";
    }
  }

  async uploadFileInChat(file: File, signedData: any): Promise<string> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
      formData.append("timestamp", signedData.timestamp.toString());
      formData.append("signature", signedData.signature);
      formData.append("public_id", signedData.public_id);
      formData.append("folder", signedData.folder);
      formData.append('upload_preset', signedData.upload_preset);

      const resourceType = signedData.folder === "images" ? "image" : "raw";

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
        formData
      );

      if (response.status === 200) {
        return response.data.secure_url;
      }

      throw new Error("File upload failed");
    } catch (error: any) {
      throw error.response?.data?.message || "File upload failed";
    }
  }

  async Login(formData: Record<string, any>, type: "users" | "drivers" | "admin") {
    try {
      const role = type === "drivers" ? "driver" : type === "admin" ? "admin" : "user";
      const payload = { ...formData, role };

      const response = await axios.post(`${this.baseUrl}/${type}/login`, payload, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      throw error; 
    }
  }
  
  handleLogout = async () => {
    try {
      const response = await axios.post(`${this.baseUrl}/auth/logout`, {}, { 
        withCredentials: true 
      });
      
      // Standardized Unified Key
      localStorage.removeItem("accessToken");

      return response.data.message;
    } catch (error: unknown) {
      console.error("Logout failed:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Logout failed");
      }
      throw new Error("An unknown error occurred");
    }
  }

  async getAdminDashboardStats() {
    try {
      const response = await AdminAPI.get("/dashboard");
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || "Failed to fetch dashboard stats";
    }
  }
}

export default new ApiService(); 