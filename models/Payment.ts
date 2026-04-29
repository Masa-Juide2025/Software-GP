import mongoose, { Schema, models } from "mongoose";

const PaymentSchema = new Schema({
  id: { type: String, required: true },
  subscription_id: { type: String, required: true },
  amount: { type: Number, required: true },
  payment_date: { type: Date, default: Date.now },
  method: { type: String, required: true },
  status: { type: String, default: "completed" }
}, { timestamps: true });

export default models.payments || mongoose.model("payments", PaymentSchema, "payments");