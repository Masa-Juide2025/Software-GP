"use client"
import { useEffect, useState } from "react";
// استيراد الأيقونات اللازمة
import { Star, Eye, X, Mail, Phone, CalendarDays, Users, Search } from "lucide-react";

export function SpecialistsGrid() {
  const [specialists, setSpecialists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialist, setSelectedSpecialist] = useState<any>(null);
  // حالة جديدة لتخزين قيمة البحث
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // جلب البيانات من الـ API
    fetch("/api/admin/specialists")
      .then((res) => res.json())
      .then((data) => {
        setSpecialists(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching specialists:", err);
        setLoading(false);
      });
  }, []);

  // دالة التصفية (البحث)
  const filteredSpecialists = specialists.filter((spec: any) => {
    const query = searchQuery.toLowerCase();
    return (
      spec.displayName?.toLowerCase().includes(query) ||
      spec.phone?.includes(query) ||
      spec.specialization?.toLowerCase().includes(query)
    );
  });

  // عرض رسالة تحميل أثناء انتظار البيانات
  if (loading) return <div className="p-10 text-center font-black">جاري التحميل...</div>;

  return (
    <>
      {/* --- إضافة خانة البحث في الأعلى --- */}
      <div className="relative mb-10 max-w-md" dir="rtl">
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="ابحث عن مختص بالاسم، الرقم، أو التخصص..."
            className="w-full pr-12 pl-4 py-4 bg-white rounded-2xl border-2 border-gray-100 shadow-sm font-black text-gray-800 focus:border-[#107c41] outline-none transition-all placeholder:text-gray-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* استخدام القائمة المفلترة (filteredSpecialists) بدلاً من specialists الأصلية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" dir="rtl">
        {filteredSpecialists.length > 0 ? (
          filteredSpecialists.map((spec: any) => (
            <div key={spec._id} className="bg-white rounded-[35px] p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all relative overflow-hidden">
              
              {/* الجزء العلوي: الاسم والتخصص */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-5">
                  <div className="w-16 h-16 rounded-full bg-[#ecfdf5] text-[#107c41] flex items-center justify-center font-black text-2xl font-sans text-center">
                    {spec.displayName?.substring(0, 2).toUpperCase() || "NN"}
                  </div>
                  <div>
                    <h3 className="font-black text-gray-800 text-xl mb-1">
                      {spec.displayName || "اسم غير معروف"}
                    </h3>
                    <p className="text-gray-400 font-black text-sm text-right">
                      {spec.role === 'nutritionist' ? 'أخصائي تغذية' : 'مدرب رياضي'}
                    </p>
                  </div>
                </div>
                <span className="bg-[#107c41] text-white px-4 py-1.5 rounded-xl text-xs font-black">
                  {spec.specialization || "تغذية"}
                </span>
              </div>

              {/* الإحصائيات: نجوم، خبرة، مشتركين */}
              <div className="flex items-center gap-8 mb-6 font-sans">
                <div className="flex items-center gap-1.5 text-yellow-500">
                  <Star size={18} fill="currentColor" />
                  <span className="text-gray-800 font-black">{spec.rating || "4.8"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 font-black text-sm">
                  <span>{spec.experienceYears || "0"} سنوات</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 font-black text-sm">
                   <span>{spec.currentClients || "0"} مشترك</span>
                </div>
              </div>

              {/* زر العرض */}
              <button 
                onClick={() => setSelectedSpecialist(spec)}
                className="w-full py-4 border-2 border-gray-50 rounded-[22px] flex items-center justify-center gap-3 font-black text-gray-700 hover:bg-gray-50 hover:border-gray-200 transition-all">
                <Eye size={20} />
                عرض التفاصيل
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-gray-50 rounded-[35px] border-2 border-dashed border-gray-200">
            <p className="font-black text-gray-400 text-lg">لا يوجد نتائج تطابق بحثك!</p>
          </div>
        )}
      </div>

      {/* الـ Modal - نافذة التفاصيل (بدون تغيير في منطقك) */}
      {selectedSpecialist && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedSpecialist(null)} dir="rtl">
          <div className="bg-white rounded-[30px] p-8 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            
            {/* زر الإغلاق */}
            <button onClick={() => setSelectedSpecialist(null)} className="absolute top-6 left-6 text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>

            {/* رأس الـ Modal */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-[#ecfdf5] text-[#107c41] flex items-center justify-center font-black text-3xl font-sans mb-4">
                {selectedSpecialist.displayName?.substring(0, 2).toUpperCase()}
              </div>
              <h2 className="text-2xl font-black text-gray-800 mb-1">{selectedSpecialist.displayName}</h2>
              <p className="text-gray-400 font-black text-sm mb-3">
                {selectedSpecialist.specialization} - {selectedSpecialist.role === 'nutritionist' ? 'أخصائي تغذية' : 'مدرب رياضي'}
              </p>
              <div className="flex items-center gap-1.5 text-yellow-500 font-black">
                <Star size={18} fill="currentColor" />
                {selectedSpecialist.rating || "4.8"}
              </div>
            </div>

            {/* معلومات التواصل */}
            <div className="border-t border-gray-100 pt-6 mb-8">
              <h4 className="font-black text-gray-800 mb-4 text-right">معلومات التواصل</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                <div className="flex items-center gap-2 justify-start">
                  <Mail size={18} className="text-[#107c41]" />
                  <span className="font-bold">{selectedSpecialist.email || "غير متوفر"}</span>
                </div>
                <div className="flex items-center gap-2 justify-start">
                  <Phone size={18} className="text-[#107c41]" />
                  <span className="font-bold">{selectedSpecialist.phone || "غير متوفر"}</span>
                </div>
                <div className="flex items-center gap-2 col-span-full">
                  <CalendarDays size={18} className="text-[#107c41]" />
                  <span className="font-bold">أيام العمل: </span>
                  <span className="font-black text-gray-800">
                    {selectedSpecialist.availableDays && selectedSpecialist.availableDays.length > 0 
                      ? selectedSpecialist.availableDays.join(", ") 
                      : "غير محددة"}
                  </span>
                </div>
              </div>
            </div>

            {/* قسم أسماء المشتركين */}
            <div className="border-t border-gray-100 pt-6 mb-8 text-right">
              <div className="flex items-center gap-2 mb-4">
                <Users size={18} className="text-[#107c41]" />
                <h4 className="font-black text-gray-800">قائمة المشتركين ({selectedSpecialist.currentClients})</h4>
              </div>
              
              <div className="space-y-3">
                {selectedSpecialist.subscriberList && selectedSpecialist.subscriberList.length > 0 
                  ? selectedSpecialist.subscriberList.map((sub: any, index: number) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <span className="font-bold text-gray-800">
                          {sub.displayName2  || "اسم غير معروف"}
                        </span>
                        <span className="text-sm text-gray-500 font-black bg-white px-3 py-1 rounded-full border">
                          {sub.phone || "لا يوجد رقم"}
                        </span>
                      </div>
                    ))
                  : <p className="text-gray-400 text-sm p-4 text-center bg-gray-50 rounded-2xl font-bold">لا يوجد مشتركين حالياً</p>
                }
              </div>
            </div>

            {/* الإحصائيات */}
            <div className="grid grid-cols-3 gap-4 text-center border-t border-gray-100 pt-6">
              <div className="bg-gray-50 p-4 rounded-2xl">
                <div className="text-2xl font-black text-gray-800">{selectedSpecialist.maxClients || "0"}</div>
                <div className="text-xs text-gray-500 font-black">الحد الأقصى</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl">
                <div className="text-2xl font-black text-gray-800">{selectedSpecialist.currentClients || "0"}</div>
                <div className="text-xs text-gray-500 font-black">مشترك نشط</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl">
                <div className="text-2xl font-black text-gray-800">{selectedSpecialist.experienceYears || "0"}</div>
                <div className="text-xs text-gray-500 font-black">سنوات خبرة</div>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </>
  );
}