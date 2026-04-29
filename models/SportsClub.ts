import mongoose, { Schema, model, models } from "mongoose";

// تعريف الواجهة لضمان توافق البيانات مع شكل الجداول في Compass
interface ISportsClub {
  name: string;
  address: string;
  phone: string;
  city: string;
  isActive: boolean;
  createdAt: Date;
}

const SportsClubSchema = new Schema<ISportsClub>(
  {
    name: { 
      type: String, 
      required: [true, "اسم النادي مطلوب"] 
    },
    address: { 
      type: String, 
      required: [true, "العنوان مطلوب"] 
    },
    phone: { 
      type: String, 
      required: [true, "رقم الهاتف مطلوب"] 
    },
    city: { 
      type: String, 
      required: [true, "المدينة مطلوبة"] 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    }
  },
  { 
    // ملاحظة هامة جداً: يجب أن يتطابق اسم الكوليكشن تماماً مع ما هو موجود في MongoDB Compass
    // بما أن الاسم في الصورة يحتوي على مسافة "Sports clubs"، نحدده هنا يدوياً
    collection: "Sports clubs", 
    timestamps: true 
  }
);

// تصدير الموديل مع التحقق المعتاد في Next.js لمنع تكرار التعريف
const SportsClub = models.SportsClub || model<ISportsClub>("SportsClub", SportsClubSchema);

export default SportsClub;