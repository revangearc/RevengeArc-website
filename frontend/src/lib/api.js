import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

const TOKEN_KEY = "ra_admin_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const apiClient = axios.create({ baseURL: API });

apiClient.interceptors.request.use((config) => {
  const t = getToken();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

export const joinWaitlist = (data) => apiClient.post("/waitlist", data);
export const applyCreator = (data) => apiClient.post("/creator-applications", data);
export const adminLogin = (password) => apiClient.post("/admin/login", { password });
export const fetchStats = () => apiClient.get("/admin/stats");
export const fetchWaitlist = () => apiClient.get("/admin/waitlist");
export const fetchCreators = () => apiClient.get("/admin/creators");
export const approveCreator = (id) => apiClient.post(`/admin/creators/${id}/approve`);
export const rejectCreator = (id) => apiClient.post(`/admin/creators/${id}/reject`);
export const emailCreator = (id, payload) => apiClient.post(`/admin/creators/${id}/email`, payload);
export const sendAnnouncement = (payload) => apiClient.post("/admin/announce", payload);
export const deleteWaitlist = (id) => apiClient.delete(`/admin/waitlist/${id}`);
