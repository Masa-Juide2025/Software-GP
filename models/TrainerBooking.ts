import mongoose, { Schema, model, models } from "mongoose";

const TrainerBookingSchema = new Schema({
  subscriberId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  subscriberName: { type: String, required: true },
  subscriberLocation: { type: String, required: true }, // الموقع الذي أدخله المشترك
  trainerId: { type: Schema.Types.ObjectId, ref: "Trainer", required: true },
  trainerName: { type: String, required: true },
  appointmentTime: { type: String, required: true },
  // مصفوفة الأندية الرياضية التي يعمل بها المدرب
  assignedCenters: [
    {
      centerId: { type: Schema.Types.ObjectId },
      centerName: { type: String },
      centerAddress: { type: String } // الحقل المطلوب
    }
  ],
  status: { type: String, default: "pending" }
}, { timestamps: true });

export default models.TrainerBooking || model("TrainerBooking", TrainerBookingSchema);