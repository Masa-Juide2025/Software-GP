"use client"
import { useEffect, useState } from "react";
import { MessageSquare, Star, Calendar, User, CheckCircle2, AlertCircle, Quote } from "lucide-react";

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("الكل");

  const fetchFeedbacks = async () => {
    try {
      const email = localStorage.getItem("userEmail");
      const res = await fetch(`/api/trainer/feedback?email=${email}`);
      const data = await res.json();
      if (data.success) setFeedbacks(data.feedbacks);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchFeedbacks(); }, []);

  const filteredData = filter === "الكل" 
    ? feedbacks 
    : feedbacks.filter(f => f.category === filter);

  const avgRating = feedbacks.length > 0 
    ? (feedbacks.reduce((acc, c) => acc + c.rating, 0) / feedbacks.length).toFixed(1) 
    : "0.0";

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-[#107c41]">جاري التحميل...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto bg-[#fafafa] min-h-screen text-right font-sans" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">فيدباك المشتركين</h1>
          <p className="text-gray-400 text-sm font-bold italic mt-1">استمع لآراء مشتركيك وطوّر من خدماتك</p>
        </div>

        <div className="flex bg-white p-1.5 rounded-[20px] shadow-sm border border-gray-100 gap-1">
          {["الكل", "شكر", "اقتراح", "شكوى"].map((tab) => (
            <button key={tab} onClick={() => setFilter(tab)}
              className={`px-6 py-2 rounded-[15px] text-xs font-black transition-all ${
                filter === tab ? "bg-[#107c41] text-white shadow-md" : "text-gray-400 hover:bg-gray-50"
              }`}>{tab}</button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-[35px] border border-gray-100 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-green-50 text-[#107c41] rounded-2xl flex items-center justify-center"><MessageSquare size={20}/></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase">الرسائل</p>
            <p className="text-xl font-black text-gray-800">{feedbacks.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[35px] border border-gray-100 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-yellow-50 text-yellow-500 rounded-2xl flex items-center justify-center"><Star size={20}/></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase">التقييم</p>
            <p className="text-xl font-black text-gray-800">{avgRating}/5</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[35px] border border-gray-100 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center"><CheckCircle2 size={20}/></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase">جديد</p>
            <p className="text-xl font-black text-gray-800">{feedbacks.filter(f => !f.isRead).length}</p>
          </div>
        </div>
      </div>

      {/* Feedbacks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredData.length > 0 ? filteredData.map((f) => (
          <div key={f._id} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-md transition-all relative">
            <div className={`absolute top-6 left-6 px-3 py-1 rounded-full text-[9px] font-black uppercase ${
              f.category === 'شكوى' ? 'bg-red-50 text-red-500' : 
              f.category === 'اقتراح' ? 'bg-blue-50 text-blue-500' : 'bg-green-50 text-[#107c41]'
            }`}>{f.category}</div>

            <Quote className="text-gray-50 absolute bottom-6 left-6" size={45} />

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden border">
                {f.subscriberImage ? <img src={f.subscriberImage} className="w-full h-full object-cover" /> : <User size={24} className="text-gray-400" />}
              </div>
              <div>
                <h3 className="font-black text-gray-800">{f.subscriberName}</h3>
                <div className="flex gap-0.5 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className={i < f.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                  ))}
                </div>
              </div>
            </div>

            <p className="text-gray-600 font-medium leading-relaxed mb-6 italic min-h-[60px]">"{f.content}"</p>

            <div className="flex items-center justify-between pt-6 border-t border-gray-50 text-[10px] font-bold text-gray-400">
              <span className="flex items-center gap-1"><Calendar size={12}/> {f.createdAt ? new Date(f.createdAt).toLocaleDateString('ar-EG') : "قديماً"}</span>
              {!f.isRead && <span className="flex items-center gap-1 text-[#107c41] animate-pulse"><AlertCircle size={12}/> غير مقروء</span>}
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-100">
            <MessageSquare size={40} className="mx-auto mb-4 text-gray-200" />
            <p className="text-gray-400 font-black">لا توجد رسائل حالياً</p>
          </div>
        )}
      </div>
    </div>
  );
}