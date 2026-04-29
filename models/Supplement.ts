import mongoose, { Schema, model, models } from 'mongoose';

const SupplementSchema = new Schema({
  // رقم المشترك (مربوط بجدول اليوزر)
  subscriberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscriber', // تأكد أن الموديل المرتبط اسمه User
    required: true
  },
  // رقم الأخصائي (مربوط بجدول اليوزر أو أخصائيي التغذية)
  nutritionistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'nutritionist',
    required: true
  },
  // اسم المكمل
  supplementName: {
    type: String,
    required: true,
    trim: true
  },
  // الجرعة (مثلاً: 5g, 1 scoop)
  dosage: {
    type: String,
    required: true
  },
  // التوقيت (مثلاً: قبل التمرين بـ 30 دقيقة)
  timing: {
    type: String,
    required: true
  },
  // الغرض (مثلاً: زيادة الطاقة، استشفاء عضلي)
  purpose: {
    type: String,
    required: true
  }
}, {
  // هذا السطر يضمن أن mongoose يتعامل مع الجدول باسم 'supplement' كما هو عندك
  collection: 'supplement', 
  timestamps: true 
});

// تصدير الموديل مع التحقق من وجوده مسبقاً (مهم لـ Next.js)
const Supplement = models.Supplement || model('Supplement', SupplementSchema);

export default Supplement;