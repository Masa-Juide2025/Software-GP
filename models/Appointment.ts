import mongoose, { Schema, model, models } from "mongoose";

const AppointmentSchema = new Schema(
  {
    // ربط الموعد بالأخصائي
    nutritionistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "nutritionists",
      required: true,
    },
    // تغيير من clientId إلى subscriberId
    subscriberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subscribers",
      required: false,
    },
    // اسم المشترك
    subscriberName: {
      type: String,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String, // مثال: "09:00 ص"
      required: true,
    },
    type: {
      type: String,
      enum: ["استشارة أولى", "متابعة أسبوعية", "تحديث خطة غذائية", "جلسة تدريب"],
      default: "متابعة أسبوعية",
    },
    status: {
      type: String,
      enum: ["upcoming", "completed", "cancelled"],
      default: "upcoming",
    },
  },
  { timestamps: true }
  
);

export default mongoose.models.Appointment || mongoose.model("Appointment", AppointmentSchema, "Appointment");