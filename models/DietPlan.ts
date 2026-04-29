import mongoose, { Schema, models } from "mongoose";

// تعريف الهيكل بناءً على الحقول الظاهرة في MongoDB Compass
const DietPlanSchema = new Schema(
  {
    subscriberId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    nutritionistId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: String,
    dailyCalories: Number,
    startDate: String,
    endDate: String,
  },
  { timestamps: true, strict: false }
);

export default models.dietPlans || mongoose.model("dietPlans", DietPlanSchema, "dietPlans");