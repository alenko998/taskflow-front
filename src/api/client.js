import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:5264/api",
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("tf_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem("tf_token");
      localStorage.removeItem("tf_user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default client;