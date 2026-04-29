import mongoose, { Schema, models } from "mongoose";

const FeedbackSchema = new Schema(
  {
    subscriberId: { type: mongoose.Schema.Types.ObjectId, ref: "Subscriber" },
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: "Trainer" },
    content: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    category: { 
      type: String, 
      enum: ["اقتراح", "شكوى", "شكر", "أخرى"], 
      default: "شكر" 
    },
    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Feedback = models.Feedback || mongoose.model("Feedback", FeedbackSchema);
export default Feedback;