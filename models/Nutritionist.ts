import mongoose, { Schema, models } from "mongoose";

const NutritionistSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    specialization: String,
    experienceYears: Number,
    bio: String,
    workingHoursFrom: String,
    workingHoursTo: String,
    maxSubscribers: Number, 

    // ✅ إعادة القيمة الافتراضية إلى 0
    availableSlots: {
      type: Number,
      default: 0, 
    },
    
    currentSubscribers: {
      type: Number,
      default: 0, 
    },

    availableDays: {
      type: [String], 
      default: [],
    },
      certificateUrl: {
      type: String,
      default: "",
    },
    
  },
  { timestamps: true }
);

export default models.nutritionists ||
  mongoose.model("nutritionists", NutritionistSchema);