import api from "../utlis/axios";





export const getUserActivity = async () => {
  try {
    const { data } = await api.get("/activity");
    console.log("📊 Activity Data:", data);
    return data;
  } catch (error) {
    console.error("Get Activity Error:", error.response?.data || error.message);
    return { success: false, data: null };
  }
};