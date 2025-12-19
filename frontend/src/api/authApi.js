import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const loginApi = (data) => API.post("/auth/login", data);
export const selectCompanyApi = (data) =>
  API.post("/auth/select-company", data);
