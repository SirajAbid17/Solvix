import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    paymentId: {
      type: String,
      sparse: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      enum: ["USD"],
      default: "USD",
    },
    plan: {
      type: String,
      enum: ["free", "starter", "pro"],
      required: true,
    },
    credits: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Created", "Paid", "Failed"],
      default: "Created",
    },
    creditsAdded: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;