import mongoose, { Schema, model, models } from "mongoose";

// 1. تعريف واجهة البيانات (Interface)
interface IPregnantMother {
  subscriberId: mongoose.Types.ObjectId;
  nutritionistId: mongoose.Types.ObjectId;
  pregnancyDetails: {
    gestationalWeek: number;
    trimester: string;
    numberOfChildren: number;
    nextVisitDate: Date;
    expectedDeliveryDate?: Date;
  };
  healthMetrics: {
    weight: number;
    bloodPressure: string;
    hemoglobin: number;
    // إضافة المصفوفة هنا لضمان النوع في TypeScript
    weeklyWeightLog: {
      week: number;
      weight: number;
      date?: Date;
    }[];
  };
  medicalInfo: {
    supplements: string[];
    notes?: string;
  };
  status: string;
}

// 2. بناء المخطط (Schema)
const PregnantMotherSchema = new Schema<IPregnantMother>(
  {
    subscriberId: {
      type: Schema.Types.ObjectId,
      ref: "Subscriber",
      required: true,
    },
    nutritionistId: {
      type: Schema.Types.ObjectId,
      ref: "nutritionist",
      required: true,
    },
    pregnancyDetails: {
      gestationalWeek: { type: Number, required: true },
      trimester: { type: String, required: true },
      numberOfChildren: { type: Number, default: 0 },
      nextVisitDate: { type: Date },
      expectedDeliveryDate: { type: Date },
    },
    healthMetrics: {
      weight: { type: Number, required: true }, // الوزن الحالي
      bloodPressure: { type: String, required: true },
      hemoglobin: { type: Number },
      // إضافة حقل مصفوفة سجل الوزن الأسبوعي
      weeklyWeightLog: [
        {
          week: { type: Number },
          weight: { type: Number },
          date: { type: Date, default: Date.now }
        }
      ],
    },
    medicalInfo: {
      supplements: [{ type: String }],
      notes: { type: String },
    },
    status: {
      type: String,
      enum: ["active", "completed", "archived"],
      default: "active",
    },
  },
  {
    timestamps: true,
    collection: "PregnantMother",
  }
);

// 3. تصدير الموديل
const PregnantMother = models.PregnantMother || model<IPregnantMother>("PregnantMother", PregnantMotherSchema);

export default PregnantMother;