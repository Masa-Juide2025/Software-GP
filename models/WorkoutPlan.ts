import mongoose, { Schema, models } from "mongoose";

/**
 * موديل البرامج التدريبية (WorkoutPlan Model)
 * تم ضبطه ليتوافق مع اسم المجموعة "workoutPrograms" في قاعدة البيانات
 */
const WorkoutPlanSchema = new Schema(
  {
    // تعريف الحقول الأساسية بناءً على هيكلية البيانات عندك
    subscriberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
    },
    description: String,
    exercises: [
      {
        name: String,
        sets: Number,
        reps: Number,
        duration: String,
        notes: String,
      },
    ],
    startDate: String,
    endDate: String,
  },
  { 
    timestamps: true,
    // تسمح بجلب أي حقول إضافية موجودة في الداتا بيس حتى لو لم تكن معرفة هنا
    strict: false 
  }
);

/**
 * ✅ الربط بالمجموعة الصحيحة:
 * الاسم الثالث "workoutPrograms" هو الأهم لضمان جلب البيانات من الجدول الصحيح.
 */
const WorkoutPlan = models.workoutPrograms || mongoose.model("workoutPrograms", WorkoutPlanSchema, "workoutPrograms");

export default WorkoutPlan;