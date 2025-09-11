// lib/axios.js
import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api", // your backend base URL
    withCredentials: true, // if you are using cookies for auth
    headers: {
        "Content-Type": "application/json",
    },
});

// Optional: interceptors for adding token or handling errors globally
api.interceptors.request.use(
    (config) => {
        const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default api;
