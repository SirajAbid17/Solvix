import api from "../utlis/axios";

const GetcurrentUser = async () => {
  try {
    const response = await api.get("/me");
    const data = response.data;

    if (!data?.success) {
      console.log("/me returned success:false");
      return null;
    }

    const userData = {
      _id: data.userId || data._id || "",
      name: data.name || "",
      email: data.email || "",
      avatar: data.avatar || "",
      plan: data.plan || "free",
      credits: Number(data.credits ?? 0),
      totalcredits: Number(data.totalcredits ?? 0),
      isAdmin: data.isAdmin === true,
    };

    return userData;
  } catch (error) {
    return null;
  }
};

export default GetcurrentUser;