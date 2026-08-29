import api from "../utlis/axios";

export const createOrder = async (planType) => {
    try {
        // ✅ Gateway will forward to billing service
        const { data } = await api.post("/billing/create-order", { planType });
        return data;
    } catch (error) {
        console.error("Create Order Error:", error);
        console.error("Error Response:", error.response?.data);
        throw error;
    }
};

export const getPaymentStatus = async (sessionId) => {
    try {
        const { data } = await api.get(`/billing/payment-status/${sessionId}`);
        return data;
    } catch (error) {
        console.error("Get Payment Status Error:", error);
        throw error;
    }
};

export const getPaymentHistory = async () => {
    try {
        const { data } = await api.get("/billing/history");
        return data;
    } catch (error) {
        console.error("Get Payment History Error:", error);
        throw error;
    }
};

export const verifyPayment = async (sessionId) => {
    try {
        const { data } = await api.get(`/billing/payment-status/${sessionId}`);
        return data;
    } catch (error) {
        console.error("Verify Payment Error:", error);
        throw error;
    }
};