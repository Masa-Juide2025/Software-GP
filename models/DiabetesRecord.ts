import mongoose, { Schema, model, models } from "mongoose";

const DiabetesRecordSchema = new Schema(
  {
    // ربط السجل بالمشترك (المريض)
    subscriberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscriber",
      required: true,
    },
    // ربط السجل بالأخصائي المسؤول
    nutritionistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "nutritionist",
      required: true,
    },
    // فحوصات السكر
    fastingBloodSugar: { type: String, default: "--" }, // سكر صائم
    hba1c: { type: String, default: "--" },             // سكر تراكمي
    randomBloodSugar: { type: String, default: "--" },  // سكر عشوائي
    
    // الفحوصات الحيوية الأخرى
    ldl: { type: String, default: "--" },               // الكوليسترول الضار
    hdl: { type: String, default: "--" },               // الكوليسترول الجيد
    creatinine: { type: String, default: "--" },        // الكرياتينين
    urea: { type: String, default: "--" },              // اليوريا
    
    // تاريخ إنشاء السجل (يتم إضافته تلقائياً بواسطة timestamps)
  },
  { 
    timestamps: true, // يضيف createdAt و updatedAt تلقائياً
    collection: 'diabetes_medical_records' // اسم الكوليكشن في المونجو
  }
);

const DiabetesRecord = models.DiabetesRecord || model("DiabetesRecord", DiabetesRecordSchema);
export default DiabetesRecord;