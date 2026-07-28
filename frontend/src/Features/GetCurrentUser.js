import api from "../utlis/axios";

const GetcurrentUser = async () => {
  try {
    const response = await api.get("/me");
    
    const data = response.data;
    

    const result = {
      _id: data.userId,
      name: data.name,
      email: data.email,
      avatar: data.avatar
    };
    
    return result;
    
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export default GetcurrentUser;