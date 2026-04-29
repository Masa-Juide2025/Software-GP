import mongoose, { Schema, model, models } from "mongoose";

const BloodPressureRecordSchema = new Schema(
  {
    subscriberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscriber",
      required: true,
    },
    nutritionistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "nutritionist",
      required: true,
    },
    // الحقول المطلوبة
    creatinine: { type: String, default: "--" },      // فحص الكرياتينين
    urea: { type: String, default: "--" },            // فحص اليوريا
    bloodLipids: { type: String, default: "--" },     // فحص الدهون في الدم
    fastingBloodSugar: { type: String, default: "--" }, // فحص السكر صائم
    
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    }
  },
  { 
    timestamps: true, // لإضافة createdAt و updatedAt تلقائياً
    collection: 'blood_pressure_medical_records' // اسم الجدول في قاعدة البيانات
  }
);

const BloodPressureRecord = models.BloodPressureRecord || model("BloodPressureRecord", BloodPressureRecordSchema);
export default BloodPressureRecord;