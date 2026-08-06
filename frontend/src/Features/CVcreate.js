// Features/CVcreate/index.js
import api from "../utlis/axios";

export const createCV = async (formData) => {
  try {
    const response = await api.post("/cv/generate", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    console.log('API Response:', response.data);
    
    // Return the data directly
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    console.error('Error Response:', error.response?.data);
    throw error;
  }
};

export const getMyCVs = async () => {
  try {
    const { data } = await api.get("/cv/my-cvs");
    return data;
  } catch (error) {
    console.error('Get CVs Error:', error);
    throw error;
  }
};

export const getCVById = async (id) => {
  try {
    const { data } = await api.get(`/cv/${id}`);
    return data;
  } catch (error) {
    console.error('Get CV Error:', error);
    throw error;
  }
};

export const updateCV = async (id, formData) => {
  try {
    const { data } = await api.put(`/cv/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    console.error('Update CV Error:', error);
    throw error;
  }
};

export const deleteCV = async (id) => {
  try {
    const { data } = await api.delete(`/cv/${id}`);
    return data;
  } catch (error) {
    console.error('Delete CV Error:', error);
    throw error;
  }
};

export const removeProfileImage = async (id) => {
  try {
    const { data } = await api.delete(`/cv/${id}/image`);
    return data;
  } catch (error) {
    console.error('Remove Image Error:', error);
    throw error;
  }
};