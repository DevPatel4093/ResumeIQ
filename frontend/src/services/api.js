import axios from "axios";

export const api = axios.create({
  baseURL: "/api"
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function getError(error) {
  return error.response?.data?.message || error.message || "Something went wrong";
}
