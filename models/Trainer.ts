import mongoose, { Schema, models } from "mongoose";

const TrainerSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    certificateUrl: {
      type: String,
      default: "",
    },
    certificates: [String], 
    specialization: String,
    experienceYears: Number,
    bio: String,
    workingHoursFrom: String,
    workingHoursTo: String,
    availableDays: [String],
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

    approved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default models.Trainers ||
  mongoose.model("Trainers", TrainerSchema);