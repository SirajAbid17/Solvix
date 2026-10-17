import axios from "axios";

const billingApi = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});


billingApi.interceptors.request.use((config) => {
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


billingApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Billing API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

export default billingApi;