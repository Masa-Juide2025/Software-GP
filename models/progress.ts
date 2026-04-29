import mongoose from 'mongoose';

const ProgressSchema = new mongoose.Schema(
  {
    // معرف المشترك (ربط مع كوليكشن المستخدمين/المشتركين)
    subscriberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // تأكد أن هذا الاسم يطابق اسم موديل المستخدمين لديك
      required: [true, 'يجب تحديد معرف المشترك'],
    },
    // معرف الأخصائي الذي قام بتحديث البيانات أو يتابع الحالة
    nutritionistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'يجب تحديد معرف الأخصائي'],
    },
    // الوزن الحالي الذي تم إدخاله في هذا التحديث
    currentWeight: {
      type: Number,
      required: [true, 'يجب إدخال الوزن الحالي'],
    },
    // نسبة التقدم المحسوبة (تُخزن كرقيم صحيح أو عشري)
    progressPercentage: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    // هذا الخيار يولد تلقائياً حقلي createdAt و updatedAt كما ظهر في صور الـ Compass
    timestamps: true,
    // للتأكد من اسم الكوليكشن في قاعدة البيانات
    collection: 'progress', 
  }
);

// منع إعادة تعريف الموديل في بيئة Next.js أثناء الـ Hot Reload
const Progress = mongoose.models.progress || mongoose.model('progress', ProgressSchema);

export default Progress;