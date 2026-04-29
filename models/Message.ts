import mongoose, { Schema, model, models } from "mongoose";

const MessageSchema = new Schema({
  subscriberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subscriber",
    required: true,
  },
  nutritionistId: {
    type: String, // أو ObjectId حسب نظام التوثيق عندك، سنستخدم الإيميل مؤقتاً للربط
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    enum: ["nutritionist", "subscriber"],
    default: "nutritionist",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Message = models.Message || model("Message", MessageSchema);
export default Message;