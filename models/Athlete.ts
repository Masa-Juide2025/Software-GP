import mongoose, { Schema, model, models } from "mongoose";

const AthleteSchema = new Schema(
  {
    // ربط مع جدول المشتركين
    subscriberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subscribers",
      required: true,
    },
    // ربط مع جدول الأخصائيين
    nutritionistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "nutritionists",
      required: true,
    },
    // ربط مع جدول المدربين
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer", // تأكد أن اسم الموديل للمدربين هو Trainer
      required: true,
    },
    
    // الحقول الرياضية
    sportType: { 
      type: String, 
      required: true 
    }, // الرياضة
    
    supplements: { 
      type: [String], 
      default: [] 
    }, // المكملات الغذائية
    
    currentWeight: { 
      type: Number, 
      required: true 
    }, // الوزن الحالي
    
    targetWeight: { 
      type: Number, 
      required: true 
    }, // الوزن الهدف
    
    muscleMass: { 
      type: Number, 
      default: 0 
    }, // الكتلة العضلية
    
    fatPercentage: { 
      type: Number, 
      default: 0 
    }, // نسبة الدهون

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
    collection: 'athletes' // اسم الجدول في قاعدة البيانات
  }
);

// التصدير بنفس الأسلوب لمنع مشاكل الـ Re-compilation في Next.js
const Athlete = models.Athlete || model("Athlete", AthleteSchema);

export default Athlete;