import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const http = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token on 401
      localStorage.removeItem("token");
      // Use window.location for navigation instead of useRouter
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default http;
