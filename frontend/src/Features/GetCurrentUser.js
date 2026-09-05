import api from "../utlis/axios";

const GetcurrentUser = async () => {
  try {
    const response = await api.get("/me");

    console.log("🔥 /me STATUS:", response.status);
    console.log("🔥 /me RESPONSE:", response.data);

    const data = response.data;

    // Backend successfully authenticated the user
    if (!data?.success) {
      console.log("❌ /me returned success:false");
      return null;
    }

    return {
      _id: data.userId || data._id || "",
      name: data.name || "",
      email: data.email || "",
      avatar: data.avatar || "",
      plan: data.plan || "free",
      credits: Number(data.credits ?? 0),
      totalcredits: Number(data.totalcredits ?? 0),
    };
  } catch (error) {
    console.error(
      "❌ Get Current User Error:",
      error.response?.status,
      error.response?.data || error.message
    );
    return null;
  }
};

export default GetcurrentUser;