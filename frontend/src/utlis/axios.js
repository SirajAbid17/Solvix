import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  try {
    const state = window.__REDUX_STORE__?.getState?.();
    const userId = state?.user?.userdata?._id;

    if (userId && !config.headers["x-user-id"]) {
      config.headers["x-user-id"] = userId;
    }
  } catch (e) {
    console.log(e)
  }

  return config;
});

export default api;  