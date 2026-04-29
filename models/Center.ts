import mongoose, { Schema, model, models } from "mongoose";

// تعريف الواجهة لضمان صحة البيانات في TypeScript بناءً على الحقول الموجودة
interface ICenter {
  name: string;
  address: string;
  phone: string;
  city: string;
  isActive: boolean;
  createdAt: Date;
}

const CenterSchema = new Schema<ICenter>(
  {
    name: { 
      type: String, 
      required: [true, "اسم المركز مطلوب"] 
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
    // ربط الموديل بالكوليكشن المسمى "Centers"
    collection: "Centers",
    timestamps: true 
  }
);

// تصدير الموديل مع التحقق لتجنب تكرار التعريف في Next.js
const Center = models.Center || model<ICenter>("Center", CenterSchema);

export default Center;