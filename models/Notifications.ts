import mongoose, { Schema, model, models } from "mongoose";

const NotificationSchema = new Schema({
  subscriberId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Subscriber", 
    required: true 
  },
  nutritionistId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Nutritionist", 
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ["weight_alert",'diet_plan', "appointment", "general"], 
    default: "general" 
  },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Notification = models.notifications || model("notifications", NotificationSchema);
export default Notification;