import mongoose, { Schema, model, models } from "mongoose";

const NutritionistBookingSchema = new Schema(
  {
    subscriberId: { type: Schema.Types.ObjectId, ref: "Subscriber", required: true },
    subscriberName: { type: String, required: true },
    subscriberLocation: { type: String, required: true }, 

    nutritionistId: { type: Schema.Types.ObjectId, ref: "Nutritionist", required: true },
    nutritionistName: { type: String, required: true },

    // مصفوفة المراكز الطبية المرتبطة بهذا الأخصائي
    assignedCenters: [
      {
        centerId: { type: Schema.Types.ObjectId, ref: "Center", required: true },
        centerName: { type: String, required: true },
        centerAddress: { type: String, required: true }, // العنوان المطلوب
        city: { type: String }
      }
    ],

    appointmentTime: { type: String, required: true },
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" }
  },
  { timestamps: true }
);

export default models.NutritionistBooking || model("NutritionistBooking", NutritionistBookingSchema);