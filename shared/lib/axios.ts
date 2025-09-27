import { getCookie } from "@/functions/cookieActions";
import axios from "axios";

// const BASE_URL = 'https://psychology-eosin.vercel.app/api'
// export const BASE_URL = "http://192.168.1.71:3000/api";
// export const BASE_URL = "http://192.168.0.183:3000/api"; //iş
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = await getCookie("token");
  if (token) {
    config.headers.Authorization = `JWT ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized access");
    }
    if (error.response?.status >= 500) {
      console.error("Server error");
    }
    return Promise.reject(error);
  }
);

export const uploadApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
uploadApi.interceptors.request.use(async (config) => {
  const token = await getCookie("token");
  if (token) {
    config.headers.Authorization = `JWT ${token}`;
  }
  return config;
});

uploadApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized access");
    }
    if (error.response?.status >= 500) {
      console.error("Server error");
    }
    return Promise.reject(error);
  }
);
export default api;
