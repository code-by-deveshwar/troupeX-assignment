import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const ACCESS_TOKEN_KEY = "accessToken";
export const REFRESH_TOKEN_KEY = "refreshToken";

// ✅ Always use your Mac's LAN IP
export const API_BASE_URL = "http://192.168.1.9:8000";


// 🔗 Log so we confirm
console.log("🔗 Using API Base URL:", API_BASE_URL);

export const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
