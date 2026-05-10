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
export const adminLogin = (email, password) => apiClient.post("/admin/login", { email, password });
export const fetchStats = (range = "14d") => apiClient.get(`/admin/stats?range=${range}`);
export const fetchWaitlist = () => apiClient.get("/admin/waitlist");
export const fetchCreators = (status) => apiClient.get(`/admin/creators${status ? `?status=${status}` : ""}`);
export const approveCreator = (id) => apiClient.post(`/admin/creators/${id}/approve`);
export const rejectCreator = (id) => apiClient.post(`/admin/creators/${id}/reject`);
export const emailCreator = (id, payload) => apiClient.post(`/admin/creators/${id}/email`, payload);
export const sendAnnouncement = (payload) => apiClient.post("/admin/announce", payload);
export const fetchRecipientCounts = () => apiClient.get("/admin/recipient-counts");
export const deleteWaitlist = (id) => apiClient.delete(`/admin/waitlist/${id}`);
export const fetchTemplates = () => apiClient.get("/admin/templates");
export const createTemplate = (data) => apiClient.post("/admin/templates", data);
export const updateTemplate = (id, data) => apiClient.put(`/admin/templates/${id}`, data);
export const deleteTemplate = (id) => apiClient.delete(`/admin/templates/${id}`);
export const fetchSignatures = () => apiClient.get("/admin/signatures");
export const createSignature = (data) => apiClient.post("/admin/signatures", data);
export const updateSignature = (id, data) => apiClient.put(`/admin/signatures/${id}`, data);
export const deleteSignature = (id) => apiClient.delete(`/admin/signatures/${id}`);
export const bulkDeleteWaitlist = (ids, confirmation) => apiClient.post("/admin/waitlist/bulk-delete", { ids, confirmation });
export const deleteAllWaitlist = (confirmation) => apiClient.delete("/admin/waitlist", { data: { confirmation } });
export const bulkDeleteCreators = (ids, confirmation) => apiClient.post("/admin/creators/bulk-delete", { ids, confirmation });
export const deleteAllCreators = (confirmation) => apiClient.delete("/admin/creators", { data: { confirmation } });
export const setCreatorStatus = (id, status) => apiClient.post(`/admin/creators/${id}/status`, { status });
export const searchUsers = (q) => apiClient.get(`/admin/users/search?q=${encodeURIComponent(q)}`);
export const fetchEmailLogs = (params = {}) => {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== "") q.append(k, v); });
  const qs = q.toString();
  return apiClient.get(`/admin/email-logs${qs ? `?${qs}` : ""}`);
};
export const clearEmailLogs = (confirmation) => apiClient.delete("/admin/email-logs", { data: { confirmation } });
