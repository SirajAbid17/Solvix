import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            index: true
        },
        orderId: {
            type: String,
            required: true,
            unique: true
        },
        paymentId: {
            type: String,
            sparse: true
        },
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            default: "USD",
            enum: ["USD"],
        },
        credits: {
            type: Number,
            default:10,
            required: true,
        },
        plan: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["Created", "Paid", "Successfully", "Failed"],
            default: "Created",
        },
    },
    {
        timestamps: true,
    }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;