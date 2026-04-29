import mongoose, { Schema, models } from "mongoose";

const SubscriberSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  age: Number,
  height: Number,
  weight: Number,
  targetWeight: Number,
  goal: String,
  diseases: String,
  allergies: String,
  
  // أضف هذه الأسطر الأربعة فوراً
  bmi: { type: Number, default: 0 }, 
 // داخل ملف models/Subscriber.ts
nutritionistId: { 
  type: mongoose.Schema.Types.ObjectId, 
  ref: "Nutritionist",
  default: null // هذه هي القيمة الأولية الصحيحة
},
trainerId: { 
  type: mongoose.Schema.Types.ObjectId, 
  ref: "Trainer",
  default: null // هذه هي القيمة الأولية الصحيحة
},
  
}, { timestamps: true });

const Subscriber = models.Subscriber || mongoose.model("Subscriber", SubscriberSchema, "subscribers");
export default Subscriber;