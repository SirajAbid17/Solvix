import api from "../utlis/axios";

// ============================================================
// GENERATE MOCK INTERVIEW (PAID - 2 CREDITS)
// ============================================================

export const generateMockInterview = async (formData) => {
  try {
    const { data } = await api.post("/mock-interview/generate", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("✅ Mock Interview Generated:", data);
    return data;
  } catch (error) {
    console.error("❌ Generate Mock Interview Error:", error);
    console.error("Error Response:", error.response?.data);
    throw error;
  }
};

// ============================================================
// GET MY INTERVIEWS (FREE)
// ============================================================

export const getMyInterviews = async () => {
  try {
    const { data } = await api.get("/mock-interview/my-interviews");
    console.log("✅ My Interviews:", data);
    return data;
  } catch (error) {
    console.error("❌ Get My Interviews Error:", error);
    throw error;
  }
};

// ============================================================
// GET INTERVIEW BY ID (FREE)
// ============================================================

export const getInterviewById = async (id) => {
  try {
    const { data } = await api.get(`/mock-interview/${id}`);
    console.log("✅ Interview By ID:", data);
    return data;
  } catch (error) {
    console.error("❌ Get Interview Error:", error);
    throw error;
  }
};

// ============================================================
// DELETE INTERVIEW (FREE)
// ============================================================

export const deleteInterview = async (id) => {
  try {
    const { data } = await api.delete(`/mock-interview/${id}`);
    console.log("✅ Interview Deleted:", data);
    return data;
  } catch (error) {
    console.error("❌ Delete Interview Error:", error);
    throw error;
  }
};

// ============================================================
// ✅ GENERATE NEXT BATCH (15 MORE QUESTIONS)
// ============================================================

export const generateNextBatch = async (interviewId) => {
  try {
    const { data } = await api.post(
      `/mock-interview/${interviewId}/next-batch`
    );
    console.log("✅ Next Batch Generated:", data);
    return data;
  } catch (error) {
    console.error("❌ Generate Next Batch Error:", error);
    console.error("Error Response:", error.response?.data);
    throw error;
  }
};