import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 120000, // 2 minutes for heavy computations
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred";
    return Promise.reject(new Error(message));
  }
);

/**
 * Upload a CSV or Excel file to the backend.
 * @param {File} file
 * @param {Function} onProgress - Upload progress callback (0-100)
 */
export const uploadFile = async (file, onProgress) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/api/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(pct);
      }
    },
  });
  return response.data;
};

/**
 * Remove an uploaded file from the backend.
 * @param {string} filename 
 */
export const removeFile = async (filename) => {
  const response = await api.post("/api/remove", { filename });
  return response.data;
};

/**
 * Analyze dataset — runs preprocessing pipeline and gets algorithm recommendation.
 * @param {string} filename
 */
export const analyzeDataset = async (filename) => {
  const response = await api.post("/api/analyze", { filename });
  return response.data;
};

/**
 * Visualize dataset — runs manifold reduction and returns 2D plot points.
 * @param {string} filename
 * @param {string|null} algorithm - optional override ("tsne" | "umap" | "pca_umap" | "pca")
 */
export const visualizeDataset = async (filename, algorithm = null) => {
  const payload = { filename };
  if (algorithm) payload.algorithm = algorithm;
  const response = await api.post("/api/visualize", payload);
  return response.data;
};

/**
 * Download processed CSV file.
 * @param {string} filename
 */
export const downloadProcessed = (filename) => {
  const url = `${BASE_URL}/api/download/${filename}`;
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

/**
 * Check backend health status.
 */
export const checkHealth = async () => {
  const response = await api.get("/api/health");
  return response.data;
};

export default api;
