import mongoose, { Schema, model, models } from "mongoose";

const PatientsHealthDataSchema = new Schema(
  {
    // ربط مع جدول المشتركين الأساسي
    subscriberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscriber",
      required: true,
    },
    // المقاييس الصحية (التي ظهرت في الصورة: سكر، ضغط، نبض)
    healthMetrics: {
      bloodSugar: { type: String, default: "" },
      bloodPressure: { type: String, default: "" },
      heartRate: { type: String, default: "" },
      weight: { type: String, default: "" },
    },
    // المعلومات الطبية (الأدوية، الحالات)
    medicalInfo: {
      medications: { type: [String], default: [] },
      chronicDiseases: { type: [String], default: [] },
      allergies: { type: [String], default: [] },
    },
    // حالة المريض (نشط، محتاج متابعة، إلخ)
    status: {
      type: String,
      enum: ["active", "requires_followup", "stable"],
      default: "active",
    },
    // ملاحظات الأخصائي الخاصة بالسكري
    nutritionistNotes: { type: String, default: "" },
  },
  {
    timestamps: true, // عشان يسجل الـ createdAt و updatedAt تلقائياً
    collection: "patients_health_data", // هاد السطر ضروري جداً عشان يربط مع نفس الاسم اللي عندك
  }
);

// منع إعادة تعريف الموديل في Next.js أثناء الـ Hot Reload
const PatientsHealthData = models.PatientsHealthData || model("PatientsHealthData", PatientsHealthDataSchema);

export default PatientsHealthData;