import mongoose, { Schema, model, models } from "mongoose";

// تعريف الواجهة (Interface) لبيانات التحاق المدرب
interface ITrainerEnrollment {
  centerId: string;       // أو sportClubId حسب التسمية المعتمدة عندك
  trainerId: string;
  subscriberId: string;
  enrollmentDate: Date;
  status: string;
}

const TrainerEnrollmentSchema = new Schema<ITrainerEnrollment>(
  {
    // معرف النادي الرياضي أو المركز الذي يعمل به المدرب
    centerId: { 
      type: String, 
      required: [true, "معرف المركز أو النادي مطلوب"] 
    },
    // معرف المدرب (Trainer ID)
    trainerId: { 
      type: String, 
      required: [true, "معرف المدرب مطلوب"] 
    },
    // معرف المشترك (Subscriber ID)
    subscriberId: { 
      type: String, 
      required: [true, "معرف المشترك مطلوب"] 
    },
    enrollmentDate: { 
      type: Date, 
      default: Date.now 
    },
    status: { 
      type: String, 
      default: "active",
      enum: ["active", "inactive", "pending"] 
    },
  },
  { 
    timestamps: true, 
    collection: "Enrollments" // يبقى نفس الكوليكشن إذا كنت تجمعهم في جدول واحد، أو غيره لـ "TrainerEnrollments"
  }
);

// تصدير الموديل مع التحقق من وجوده مسبقاً (مهم لبيئة Next.js)
const TrainerEnrollment = models.TrainerEnrollment || model<ITrainerEnrollment>("TrainerEnrollment", TrainerEnrollmentSchema);

export default TrainerEnrollment;