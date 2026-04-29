"use client"

import { useState, useEffect } from "react";
import { User, Scale, Ruler, Flame, Calendar, Sparkles, ChevronDown, Loader2, CheckCircle2 } from "lucide-react";

export default function AIMealPlanPage() {
    const [subscribers, setSubscribers] = useState<any[]>([]);
    const [selectedSubData, setSelectedSubData] = useState<any>(null);
    const [preferences, setPreferences] = useState("");
    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [mealPlan, setMealPlan] = useState<any>(null);

    // تحميل قائمة المشتركين عند فتح الصفحة
    useEffect(() => {
        const loadSubscribers = async () => {
            try {
                const nutritionistEmail = localStorage.getItem("userEmail");
                const res = await fetch(`/api/generate-meal-plan?email=${nutritionistEmail}`);
                const data = await res.json();
                if (data.success) setSubscribers(data.subscribers);
            } catch (err) { 
                console.error("Error loading subscribers:", err); 
            } finally { 
                setLoading(false); 
            }
        };
        loadSubscribers();
    }, []);

    const handleGenerate = async () => {
        if (!selectedSubData) {
            alert("يرجى اختيار مشترك أولاً من القائمة");
            return;
        }
        setIsGenerating(true);
        setMealPlan(null); // تصفية الخطة القديمة عند البدء
        try {
            const res = await fetch("/api/generate-meal-plan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subscriber: selectedSubData, preferences })
            });
            const data = await res.json();
            if (data.success) {
                setMealPlan(data.mealPlan);
            } else {
                alert(data.error || "فشل في توليد الخطة، جرب مرة أخرى");
            }
        } catch (err) { 
            console.error("Generation error:", err);
            alert("حدث خطأ في الاتصال بالخادم");
        } finally { 
            setIsGenerating(false); 
        }
    };

    if (loading) return (
        <div className="h-screen flex items-center justify-center text-[#107c41] font-black italic animate-pulse tracking-widest">
            جاري تحضير قائمة مشتركيك...
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto bg-[#fafafa] min-h-screen text-right font-sans" dir="rtl">
            <div className="flex items-center justify-end gap-3 mb-10">
                <h1 className="text-3xl font-black text-gray-800">إنشاء خطة غذائية ذكية</h1>
                <Sparkles className="text-[#107c41]" size={30} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 font-sans">
                {/* الجزء الأيمن - المدخلات ومعلومات المشترك */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                        <label className="block text-xs font-black text-gray-400 mb-4 mr-2 italic uppercase">اختر من مشتركيك</label>
                        <div className="relative mb-8 text-right">
                            <select 
                                value={selectedSubData?._id || ""}
                                onChange={(e) => {
                                    const sub = subscribers.find(s => s._id === e.target.value);
                                    setSelectedSubData(sub);
                                }}
                                className="w-full p-5 bg-gray-50 rounded-[25px] border-none text-gray-800 font-black appearance-none focus:ring-2 focus:ring-[#107c41] cursor-pointer"
                            >
                                <option value="">قائمة المشتركين...</option>
                                {subscribers.map((s) => (
                                    <option key={s._id} value={s._id}>{s.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>

                        {/* عرض بيانات المشترك المختار */}
                        <div className="bg-[#f2faf5] p-8 rounded-[35px] border border-[#e3f4e9]">
                            <div className="flex items-center gap-5 mb-8 justify-end">
                                <div className="text-right">
                                    <h3 className="text-xl font-black text-gray-800">{selectedSubData?.name || "اسم المشترك"}</h3>
                                    <span className="inline-block mt-1 px-3 py-1 bg-white text-[#107c41] text-[10px] font-black rounded-full border border-[#dcfce7]">
                                        {selectedSubData?.goal || "الهدف"}
                                    </span>
                                </div>
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-2 border-white shadow-sm overflow-hidden text-gray-200">
                                    {selectedSubData?.image ? <img src={selectedSubData.image} className="w-full h-full object-cover" /> : <User size={30} />}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-8 text-right font-bold">
                                <InfoItem icon={<Scale size={20}/>} label="الوزن" value={`${selectedSubData?.weight || "--"} كجم`} />
                                <InfoItem icon={<Ruler size={20}/>} label="الطول" value={`${selectedSubData?.height || "--"} سم`} />
                                <InfoItem icon={<Calendar size={20}/>} label="العمر" value={`${selectedSubData?.age || "--"} سنة`} />
                                <InfoItem icon={<Flame size={20}/>} label="السعرات" value={selectedSubData?.calories || "--"} />
                            </div>
                        </div>

                        <textarea 
                            value={preferences}
                            onChange={(e) => setPreferences(e.target.value)}
                            placeholder="أضف أي ملاحظات (نباتي، ممنوع الملح...)"
                            className="w-full mt-6 p-5 bg-gray-50 rounded-[25px] border-none text-sm min-h-[100px] focus:ring-2 focus:ring-[#107c41] text-right shadow-inner"
                        />
                        <button 
                            onClick={handleGenerate}
                            disabled={!selectedSubData || isGenerating}
                            className="w-full mt-6 bg-[#107c41] text-white py-5 rounded-[25px] font-black shadow-lg hover:bg-[#0d6635] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isGenerating ? <Loader2 className="animate-spin" /> : "توليد الخطة الذكية"}
                        </button>
                    </div>
                </div>

                {/* الجزء الأيسر - عرض الخطة المتولدة */}
                <div className="lg:col-span-7 bg-white rounded-[50px] border-2 border-dashed border-gray-100 p-8 flex items-center justify-center min-h-[500px]">
                    {!mealPlan && !isGenerating ? (
                         <div className="text-center space-y-4">
                            <p className="text-gray-300 font-bold italic text-lg tracking-wide">بانتظار اختيار مشترك لبدء التحليل...</p>
                         </div>
                    ) : isGenerating ? (
                        <div className="flex flex-col items-center gap-4 text-[#107c41] animate-pulse">
                            <Sparkles size={45} />
                            <p className="font-black italic text-center">جاري تصميم خطة {selectedSubData?.name} بالذكاء الاصطناعي...</p>
                        </div>
                    ) : (
                        <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                             <div className="flex justify-between items-center bg-[#f2faf5] p-6 rounded-[25px] border border-[#e3f4e9] shadow-sm">
                                <h4 className="font-black text-[#107c41] text-xl tracking-tighter">السعرات الكلية: {mealPlan.totalCalories}</h4>
                                <CheckCircle2 className="text-[#107c41]" />
                             </div>
                             
                             {mealPlan.meals?.map((meal: any, i: number) => (
                                <div key={i} className="p-6 bg-gray-50 rounded-[30px] border border-gray-100 text-right shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between mb-3 border-b border-gray-100 pb-2">
                                        <span className="font-black text-gray-800 text-lg">{meal.name}</span>
                                        <span className="text-[12px] font-bold text-[#107c41] px-3 py-1 bg-white rounded-xl shadow-sm border border-[#e3f4e9] font-mono">{meal.calories} Cal</span>
                                    </div>
                                    <ul className="text-sm text-gray-500 space-y-2 pr-2 font-medium">
                                        {meal.items?.map((it: string, idx: number) => (
                                            <li key={idx} className="flex items-center gap-2">• {it}</li>
                                        ))}
                                    </ul>
                                </div>
                             ))}
                             
                             <div className="text-[13px] text-amber-700 bg-amber-50 p-6 rounded-[30px] border border-amber-100 font-bold text-right leading-relaxed shadow-sm italic">
                                <h5 className="text-sm font-black mb-1 flex items-center gap-2">💡 نصيحة الأخصائي:</h5>
                                {mealPlan.tips}
                             </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// مكون فرعي لعرض بنود المعلومات
function InfoItem({ icon, label, value }: any) {
    return (
        <div className="flex items-center gap-3 text-right">
            <span className="text-[#107c41] bg-white p-2.5 rounded-2xl shadow-sm border border-gray-50">{icon}</span>
            <div>
                <p className="text-[10px] font-bold text-gray-400 leading-tight uppercase tracking-tight">{label}</p>
                <p className="font-black text-gray-700">{value}</p>
            </div>
        </div>
    );
}