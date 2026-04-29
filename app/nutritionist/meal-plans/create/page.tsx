"use client"
import { useState, useEffect } from "react";
import { 
  Save, Plus, Trash2, Apple, Beef, 
  Droplets, Flame, Utensils, ArrowRight, X, PlusCircle, CheckCircle2 
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function CreateMealPlan() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // جلب المعرفات من الرابط
  const subId = searchParams.get("subId");

  // --- States ---
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showMealTypes, setShowMealTypes] = useState(false);
  const mealOptions = ["فطور", "غداء", "عشاء", "سناك 1", "سناك 2", "سناك 3"];

  const [planData, setPlanData] = useState({
    title: "نظام غذائي يومي",
    dailyCalories: 2000,
    macros: { protein: 150, carbs: 200, fat: 70 },
    meals: [
      { id: Date.now(), mealType: "فطور", items: [{ name: "", quantity: "", calories: 0 }] }
    ]
  });

  // حساب السعرات الكلية تلقائياً بناءً على الوجبات (اختياري لكن مفيد)
  useEffect(() => {
    const total = planData.meals.reduce((sum, meal) => 
      sum + meal.items.reduce((mSum, item) => mSum + (Number(item.calories) || 0), 0), 0
    );
    if(total > 0) setPlanData(prev => ({ ...prev, dailyCalories: total }));
  }, [planData.meals]);

  // --- دالة الحفظ الحقيقية ---
  const handleSave = async () => {
    if (!planData.title) return alert("يرجى إدخال عنوان للخطة");
    if (!subId) return alert("خطأ: لم يتم تحديد مشترك. يرجى العودة واختيار مشترك حقيقي.");

    setIsSaving(true);
    const email = localStorage.getItem("userEmail");

    const payload = {
      title: planData.title,
      description: "نظام غذائي مخصص تم إنشاؤه عبر لوحة التحكم",
      dailyCalories: planData.dailyCalories,
      macros: {
        carbsCalories: planData.macros.carbs,
        proteinCalories: planData.macros.protein,
        fatCalories: planData.macros.fat
      },
      meals: planData.meals.map(m => ({
        mealType: m.mealType,
        items: m.items.map(it => ({
            name: it.name,
            quantity: it.quantity,
            calories: Number(it.calories)
        }))
      })),
      subscriberId: subId,
      email: email
    };

    try {
      const res = await fetch('/api/meal-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (result.success) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          router.push("/nutritionist/meal-plans");
        }, 2500);
      } else {
        alert("فشل الحفظ: " + result.error);
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ في الاتصال بالسيرفر");
    } finally {
      setIsSaving(false);
    }
  };

  const addMeal = (type: string) => {
    setPlanData({
      ...planData,
      meals: [...planData.meals, { 
        id: Date.now() + Math.random(), 
        mealType: type, 
        items: [{ name: "", quantity: "", calories: 0 }] 
      }]
    });
    setShowMealTypes(false);
  };

  const removeMeal = (mealId: number) => {
    if (planData.meals.length > 1) {
      setPlanData({
        ...planData,
        meals: planData.meals.filter(m => m.id !== mealId)
      });
    }
  };

  const addItemToMeal = (mealId: number) => {
    const updatedMeals = planData.meals.map(meal => {
      if (meal.id === mealId) {
        return { ...meal, items: [...meal.items, { name: "", quantity: "", calories: 0 }] };
      }
      return meal;
    });
    setPlanData({ ...planData, meals: updatedMeals });
  };

  const removeItemFromMeal = (mealId: number, itemIdx: number) => {
    const updatedMeals = planData.meals.map(meal => {
      if (meal.id === mealId) {
        const newItems = meal.items.filter((_, idx) => idx !== itemIdx);
        return { ...meal, items: newItems };
      }
      return meal;
    });
    setPlanData({ ...planData, meals: updatedMeals });
  };

  const handleItemUpdate = (mealId: number, itemIdx: number, field: string, value: any) => {
    const updatedMeals = planData.meals.map(meal => {
      if (meal.id === mealId) {
        const newItems = [...meal.items];
        newItems[itemIdx] = { ...newItems[itemIdx], [field]: field === 'calories' ? (parseInt(value) || 0) : value };
        return { ...meal, items: newItems };
      }
      return meal;
    });
    setPlanData({ ...planData, meals: updatedMeals });
  };

  return (
    <div className="min-h-screen bg-[#fafafa] p-6 md:p-10 font-sans text-right relative" dir="rtl">
      
      {/* Header */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex items-center gap-5">
          <Link href="/nutritionist/meal-plans" className="p-3 bg-white rounded-2xl shadow-sm hover:bg-gray-50 transition-all border border-gray-100 text-gray-400 hover:text-[#107c41]">
            <ArrowRight size={22} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">إعداد الوجبات</h1>
            <p className="text-xs text-[#107c41] font-bold mt-1 uppercase tracking-widest">المشترك الحالي: {subId?.slice(-5) || "غير محدد"}</p>
          </div>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`${isSaving ? 'bg-gray-400' : 'bg-[#107c41]'} text-white px-10 py-4 rounded-[22px] font-black flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-green-100 active:scale-95`}
        >
          {isSaving ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div> : <Save size={20} />}
          {isSaving ? "جاري الحفظ..." : "حفظ الخطة للمشترك"}
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Right Side: Basic Info */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50">
            <h3 className="font-black text-gray-800 mb-8 flex items-center gap-3 border-r-4 border-[#107c41] pr-4 text-lg">
              بيانات النظام
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black text-gray-400 mb-2 mr-1 uppercase">عنوان الخطة</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border-none rounded-[18px] px-5 py-4 font-bold focus:ring-2 focus:ring-green-100 transition-all text-right"
                  value={planData.title}
                  onChange={(e) => setPlanData({...planData, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 mb-2 mr-1 uppercase">إجمالي السعرات</label>
                <div className="relative">
                  <input 
                    type="number" 
                    className="w-full bg-[#fff7ed] text-[#e67e22] border-none rounded-[18px] px-5 py-4 font-black focus:ring-2 focus:ring-orange-100 transition-all text-right"
                    value={planData.dailyCalories}
                    readOnly
                  />
                  <Flame className="absolute left-5 top-1/2 -translate-y-1/2 text-[#e67e22] opacity-40" size={20} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50">
            <h3 className="font-black text-gray-800 mb-8 flex items-center gap-3 border-r-4 border-blue-500 pr-4 text-lg">
              العناصر الكبرى (جم)
            </h3>
            <div className="space-y-5">
              <NutrientInput 
                label="البروتين" color="text-red-500" bg="bg-red-50" icon={<Beef size={18}/>} 
                val={planData.macros.protein} 
                onChange={(v:any) => setPlanData({...planData, macros: {...planData.macros, protein: v}})}
              />
              <NutrientInput 
                label="النشويات" color="text-blue-500" bg="bg-blue-50" icon={<Apple size={18}/>} 
                val={planData.macros.carbs}
                onChange={(v:any) => setPlanData({...planData, macros: {...planData.macros, carbs: v}})}
              />
              <NutrientInput 
                label="الدهون" color="text-orange-500" bg="bg-orange-50" icon={<Droplets size={18}/>} 
                val={planData.macros.fat}
                onChange={(v:any) => setPlanData({...planData, macros: {...planData.macros, fat: v}})}
              />
            </div>
          </div>
        </div>

        {/* Left Side: Meals Editor */}
        <div className="lg:col-span-8 space-y-8">
          {planData.meals.map((meal, mIdx) => (
            <div key={meal.id} className="bg-white rounded-[45px] shadow-sm border border-gray-50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-gray-50/60 px-8 py-6 flex justify-between items-center border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-[#107c41] border border-gray-50 text-2xl">
                    {meal.mealType.includes("فطور") ? "🍳" : meal.mealType.includes("غداء") ? "🍱" : "🌙"}
                  </div>
                  <input 
                    className="bg-transparent font-black text-gray-800 focus:outline-none text-xl placeholder-gray-300 text-right" 
                    value={meal.mealType}
                    onChange={(e) => {
                       const newMeals = [...planData.meals];
                       newMeals[mIdx].mealType = e.target.value;
                       setPlanData({...planData, meals: newMeals});
                    }}
                  />
                </div>
                {planData.meals.length > 1 && (
                  <button onClick={() => removeMeal(meal.id)} className="text-red-300 hover:text-red-500 transition-all p-2 hover:bg-red-50 rounded-xl">
                    <Trash2 size={20} />
                  </button>
                )}
              </div>

              <div className="p-8 space-y-5">
                {meal.items.map((item, iIdx) => (
                  <div key={iIdx} className="grid grid-cols-12 gap-4 items-center group">
                    <div className="col-span-6 md:col-span-7">
                      <input 
                        type="text" placeholder="اسم المكون" 
                        className="w-full bg-gray-50 border-none rounded-[16px] px-5 py-4 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-green-50 transition-all text-right" 
                        value={item.name}
                        onChange={(e) => handleItemUpdate(meal.id, iIdx, 'name', e.target.value)}
                      />
                    </div>
                    <div className="col-span-3 md:col-span-2">
                      <input 
                        type="text" placeholder="الكمية" 
                        className="w-full bg-gray-50 border-none rounded-[16px] px-4 py-4 text-sm font-bold text-center" 
                        value={item.quantity}
                        onChange={(e) => handleItemUpdate(meal.id, iIdx, 'quantity', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2 md:col-span-2">
                      <input 
                        type="number" placeholder="سعرات" 
                        className="w-full bg-green-50 text-[#107c41] border-none rounded-[16px] px-4 py-4 text-sm font-black text-center" 
                        value={item.calories || ""}
                        onChange={(e) => handleItemUpdate(meal.id, iIdx, 'calories', e.target.value)}
                      />
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <button onClick={() => removeItemFromMeal(meal.id, iIdx)} className="text-gray-200 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                
                <button 
                  onClick={() => addItemToMeal(meal.id)}
                  className="w-full py-4 border-2 border-dashed border-gray-100 rounded-[22px] text-gray-400 font-bold text-xs hover:bg-green-50/50 hover:border-green-200 hover:text-[#107c41] transition-all flex items-center justify-center gap-2 mt-4"
                >
                  <Plus size={16} /> إضافة صنف جديد
                </button>
              </div>
            </div>
          ))}

          <div className="relative mt-12">
            <button 
              onClick={() => setShowMealTypes(!showMealTypes)}
              className="w-full py-8 bg-white border-2 border-dashed border-green-200 rounded-[45px] text-[#107c41] font-black hover:bg-[#f0fdf4] transition-all flex items-center justify-center gap-3 shadow-sm group active:scale-[0.98]"
            >
              <PlusCircle size={24} className={`transition-transform duration-300 ${showMealTypes ? 'rotate-45 text-red-400' : 'group-hover:scale-110'}`} />
              {showMealTypes ? "إلغاء الإضافة" : "إضافة وجبة إضافية للنظام"}
            </button>

            {showMealTypes && (
              <div className="absolute bottom-full mb-4 left-0 right-0 bg-white rounded-[35px] shadow-2xl border border-green-50 p-5 grid grid-cols-2 md:grid-cols-5 gap-3 animate-in slide-in-from-bottom-5 duration-300 z-50">
                {mealOptions.map((type) => (
                  <button
                    key={type}
                    onClick={() => addMeal(type)}
                    className="py-4 px-2 rounded-2xl bg-gray-50 text-gray-700 font-black text-sm hover:bg-[#107c41] hover:text-white transition-all border border-transparent shadow-sm active:scale-95 text-center"
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/20 backdrop-blur-[3px] animate-in fade-in duration-300">
          <div className="bg-white rounded-[45px] p-12 shadow-2xl border border-green-50 flex flex-col items-center text-center max-w-sm w-full animate-in zoom-in duration-300">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-8 relative">
              <CheckCircle2 size={54} className="text-[#107c41] relative z-10" />
            </div>
            <h3 className="text-2xl font-black text-gray-800 mb-3">تم الحفظ بنجاح!</h3>
            <p className="text-gray-400 font-bold text-sm leading-relaxed mb-8">تم ربط الخطة بالمشترك وتخزينها في قاعدة البيانات.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function NutrientInput({label, color, bg, icon, val, onChange}: any) {
  return (
    <div>
      <label className={`block text-[10px] font-black uppercase mb-2 mr-1 tracking-widest ${color} text-right`}>{label}</label>
      <div className="relative">
        <input 
          type="number" 
          className={`w-full ${bg} ${color} border-none rounded-[18px] px-5 py-4 font-black focus:ring-2 focus:ring-opacity-20 transition-all text-right`} 
          value={val}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        />
        <div className={`absolute left-5 top-1/2 -translate-y-1/2 opacity-40 ${color}`}>{icon}</div>
      </div>
    </div>
  );
}