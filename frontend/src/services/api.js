import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (!error.response) {
      error.friendlyMessage = "Cannot reach the server. Please make sure the backend is running.";
    } else {
      error.friendlyMessage =
        error.response.data?.message || "Something went wrong. Please try again.";
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (email, password) => api.post("/auth/login", { email, password }),
};

export const predictionApi = {
  predict: (payload) => api.post("/predictions/predict", payload),
  save: (payload) => api.post("/predictions", payload),
  list: (params) => api.get("/predictions", { params }),
  getById: (id) => api.get(`/predictions/${id}`),
  remove: (id) => api.delete(`/predictions/${id}`),
};

export const dashboardApi = {
  stats: () => api.get("/dashboard/stats"),
  charts: () => api.get("/dashboard/charts"),
  modelMetrics: () => api.get("/dashboard/model-metrics"),
};

export default api;
