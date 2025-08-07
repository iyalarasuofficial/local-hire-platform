// src/services/axiosInstance.ts
import axios from 'axios';
import { auth } from '../firebase_auth/firebase';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // your MongoDB API endpoint
});

axiosInstance.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
