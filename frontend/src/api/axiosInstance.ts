import axios from 'axios';
import { auth } from '../firebase_auth/firebase';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

axiosInstance.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken(true);
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Auth Header set:", config.headers.Authorization);
  } else {
    console.warn("No Firebase user found! Not setting Authorization header.");
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
