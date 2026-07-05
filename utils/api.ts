import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to dynamically add the JWT to every request
api.interceptors.request.use(
  (config) => {
    // Ensure this runs only in the browser to prevent Next.js SSR errors
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token'); // Change key if needed
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
