import mongoose, { Schema, model, models } from "mongoose";

// تعريف الواجهة (Interface) لضمان صحة البيانات في TypeScript
interface IEnrollment {
  centerId: string;
  nutritionistId: string;
  subscriberId: string;
  enrollmentDate: Date;
  status: string;
}

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    // تم تعريفها كـ String بناءً على شكل البيانات في Compass
    centerId: { 
      type: String, 
      required: [true, "معرف المركز مطلوب"] 
    },
    nutritionistId: { 
      type: String, 
      required: [true, "معرف الأخصائي مطلوب"] 
    },
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
      enum: ["active", "inactive", "pending"] // الخيارات المتاحة للحالة
    },
  },
  { 
    timestamps: true, // لإضافة createdAt و updatedAt تلقائياً
    collection: "Enrollments" // التأكد من الربط بالكوليكشن الصحيح
  }
);

// تصدير الموديل مع التحقق إذا كان موجوداً مسبقاً (مهم جداً في Next.js)
const Enrollment = models.Enrollment || model<IEnrollment>("Enrollment", EnrollmentSchema);

export default Enrollment;