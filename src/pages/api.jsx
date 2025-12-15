import axios from 'axios';

// Use your Render backend URL here
const API = axios.create({
  baseURL: 'https://styleora-server-5.onrender.com', // <-- replace localhost
});

//  Add request interceptor once!
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
