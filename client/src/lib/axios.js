import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.MODE === "development" ? "http://localhost:5000/api/v1" : "https://final-year-project-management-system-333y.onrender.com/api/v1"),
  withCredentials: true,
});
