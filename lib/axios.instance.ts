import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL || "http://192.168.1.3:3000",
  timeout: 10 * 60 * 60 * 1000,
});
console.log(process.env.EXPO_PUBLIC_BASE_URL);

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }

      config.headers["Content-Type"] =
        config.headers["Content-Type"] || "application/json";

      return config;
    } catch (error) {
      console.error("Error retrieving token", error);
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);
