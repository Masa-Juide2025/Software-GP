"use client"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { X, Mail, Phone, Activity, Target, ShieldAlert, Droplets, Calendar } from "lucide-react"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"

export function SubscriberDetailDialog({ subscriber, open, onOpenChange }: any) {
  if (!subscriber) return null;

  // --- دالة معالجة التواريخ بناءً على حقل الـ package وتاريخ الإنشاء ---
  const getSubscriptionInfo = () => {
    const startDate = subscriber.createdAt ? new Date(subscriber.createdAt) : new Date();
    const packageName = subscriber.package?.toLowerCase() || "basic"; 
    
    let monthsToAdd = 1;
    if (packageName === "premium") monthsToAdd = 3;
    if (packageName === "vip") monthsToAdd = 6;

    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + monthsToAdd);

    const formatDate = (date: Date) => {
      const d = String(date.getDate()).padStart(2, '0');
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const y = date.getFullYear();
      return `${d}/${m}/${y}`;
    };

    return {
      start: formatDate(startDate),
      end: formatDate(endDate),
      displayPackage: packageName.toUpperCase()
    };
  };

  const { start, end, displayPackage } = getSubscriptionInfo();
  const bmiValue = subscriber.bmi ? Number(subscriber.bmi).toFixed(1) : "---";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-none rounded-[25px] bg-white font-sans shadow-xl" dir="rtl">
        
        <VisuallyHidden.Root>
          <DialogTitle>تفاصيل المشترك {subscriber.name}</DialogTitle>
        </VisuallyHidden.Root>

        {/* رأس المودال */}
        <div className="p-6 relative bg-gray-50/50">
          <div className="flex justify-end mb-2">
             <button onClick={() => onOpenChange(false)} className="text-gray-400 hover:text-red-500 border rounded-full p-1 transition-colors">
                <X size={16} />
             </button>
          </div>

          <div className="flex flex-col items-center">
             <div className="w-16 h-16 rounded-full bg-[#ecfdf5] text-[#107c41] flex items-center justify-center text-xl font-black mb-3 shadow-sm border border-green-100">
                {subscriber.name?.substring(0, 2).toUpperCase() || "SU"}
             </div>
             <h2 className="text-xl font-black text-gray-800 mb-1">{subscriber.name}</h2>
             <span className="text-[10px] bg-[#107c41] text-white px-4 py-0.5 rounded-full font-bold tracking-wider">
                باقة {displayPackage}
             </span>
          </div>
        </div>

        <div className="px-8 pb-8 space-y-6 overflow-y-auto max-h-[70vh] scrollbar-hide">
          
          {/* قسم معلومات التواصل - (بدون جنس) */}
          <div className="space-y-3">
             <h4 className="text-sm font-black text-gray-800 border-b pb-2">معلومات التواصل</h4>
             <div className="space-y-2 text-gray-500 text-xs font-bold">
                <div className="flex items-center justify-end gap-2 italic">{subscriber.email} <Mail size={14} className="text-gray-400"/></div>
                <div className="flex items-center justify-end gap-2" dir="ltr">{subscriber.phone} <Phone size={14} className="text-gray-400"/></div>
                <div className="flex items-center justify-end gap-2 text-right">العمر: {subscriber.age} سنة</div>
             </div>
          </div>

          {/* القياسات البدنية */}
          <div className="space-y-4">
             <h4 className="text-sm font-black text-gray-800">القياسات البدنية</h4>
             <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-xl flex flex-col items-end border border-gray-100">
                   <span className="text-[9px] text-gray-400 font-bold flex items-center gap-1">الطول <Activity size={10}/></span>
                   <span className="text-sm font-black text-gray-700">{subscriber.height} سم</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl flex flex-col items-end border border-gray-100">
                   <span className="text-[9px] text-gray-400 font-bold flex items-center gap-1">الوزن الحالي <Target size={10}/></span>
                   <span className="text-sm font-black text-gray-700">{subscriber.weight} كجم</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl flex flex-col items-end border border-gray-100">
                   <span className="text-[9px] text-gray-400 font-bold flex items-center gap-1">الوزن المستهدف <Target size={10}/></span>
                   <span className="text-sm font-black text-green-600">{subscriber.targetWeight} كجم</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl flex flex-col items-end border border-gray-100">
                   <span className="text-[9px] text-gray-400 font-bold flex items-center gap-1">السعرات <Droplets size={10}/></span>
                   <span className="text-sm font-black text-blue-600">{subscriber.dailyCalories || "---"}</span>
                </div>
             </div>

             {/* مؤشر BMI */}
             <div className="pt-1 px-1">
                <div className="flex justify-between text-[10px] font-black mb-1">
                   <span className="text-gray-400 font-bold">مؤشر كتلة الجسم (BMI)</span>
                   <span className="text-[#107c41]">{bmiValue}</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                   <div className="h-full bg-[#107c41]" style={{ width: `${Math.min((Number(bmiValue)/40)*100, 100)}%` }}></div>
                </div>
             </div>
          </div>

          {/* الحالات الصحية */}
          <div className="grid grid-cols-2 gap-4">
             <div className="flex flex-col items-center">
                <span className="text-[10px] font-black text-gray-800 flex items-center gap-1 mb-2 text-center">الأمراض المزمنة <ShieldAlert size={12} className="text-yellow-500"/></span>
                <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-lg text-[9px] font-bold text-center w-full min-h-[26px] flex items-center justify-center border border-yellow-100">
                  {subscriber.diseases || "لا يوجد"}
                </span>
             </div>
             <div className="flex flex-col items-center">
                <span className="text-[10px] font-black text-gray-800 flex items-center gap-1 mb-2 text-center">الحساسية الغذائية <ShieldAlert size={12} className="text-red-500"/></span>
                <span className="bg-red-50 text-red-700 px-3 py-1 rounded-lg text-[9px] font-bold text-center w-full min-h-[26px] flex items-center justify-center border border-red-100">
                  {subscriber.allergies || "لا يوجد"}
                </span>
             </div>
          </div>

          {/* فترة صلاحية الاشتراك والمسؤولين */}
          <div className="space-y-3 pt-4 border-t border-dashed">
             <h4 className="text-sm font-black text-gray-800">فترة صلاحية الاشتراك</h4>
             <div className="space-y-2 text-[11px] font-bold">
                <div className="flex justify-between items-center p-3 bg-green-50/50 rounded-xl border border-green-100 shadow-sm">
                   <span className="flex items-center gap-2 text-green-700 font-black">{start} <Calendar size={14}/></span> 
                   <span className="text-gray-500 font-bold">تاريخ البدء</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-red-50/50 rounded-xl border border-red-100 shadow-sm">
                   <span className="flex items-center gap-2 text-red-700 font-black">{end} <Calendar size={14}/></span> 
                   <span className="text-gray-500 font-bold">تاريخ الانتهاء</span>
                </div>

                <div className="flex justify-between items-center px-2 pt-2 border-t mt-2">
                   <span className="text-[#107c41] font-black">{subscriber.nutritionistName || "لم يحدد"}</span> 
                   <span className="text-gray-400 font-black">الأخصائي المشرف</span>
                </div>
                <div className="flex justify-between items-center px-2">
                   <span className="text-[#107c41] font-black">{subscriber.trainerName || "لم يحدد"}</span> 
                   <span className="text-gray-400 font-black">المدرب المشرف</span>
                </div>
             </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}