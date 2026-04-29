import mongoose, { Schema, models } from "mongoose";

const DailyLogSchema = new Schema({
  subscriberId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  date: { 
    type: String, // بصيغة YYYY-MM-DD لسهولة البحث
    required: true 
  },
  type: { 
    type: String, 
    enum: ["workout", "diet", "both"], 
    default: "both" 
  },
  status: { 
    type: Boolean, 
    default: true // true يعني تم الإنجاز
  }
}, { timestamps: true });

// ربط الموديل بجدول اسمه dailyLogs
const DailyLog = models.DailyLogs || mongoose.model("DailyLogs", DailyLogSchema, "DailyLogs");
export default DailyLog;