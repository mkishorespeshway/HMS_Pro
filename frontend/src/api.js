import axios from "axios";

const API = axios.create({ baseURL: (process.env.NODE_ENV === 'production' ? process.env.REACT_APP_API_BASE_URL_PRODUCTION : process.env.REACT_APP_API_BASE_URL_LOCAL) + '/api' });
API.defaults.timeout = 8000;

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
