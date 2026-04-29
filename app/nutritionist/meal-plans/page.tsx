"use client"
import { useEffect, useState } from "react";
import { 
  Plus, Search, Utensils, Flame, X, Apple, Beef, 
  Droplets, User, Trash2, Edit3, Eye, AlertTriangle, 
  Save, CheckCircle2, ChevronLeft, CalendarDays, MessageSquareText 
} from "lucide-react";
import Link from "next/link";

export default function MealPlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [selectedPlan, setSelectedPlan] = useState<any>(null); 
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlan, setEditedPlan] = useState<any>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPlanBasics, setNewPlanBasics] = useState({ 
    subscriberId: "", 
    date: new Date().toISOString().split('T')[0],
    notes: "" 
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<any>(null);

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  async function fetchMealPlans() {
    const email = localStorage.getItem("userEmail");
    if (!email) return;
    try {
      const res = await fetch(`/api/meal-plans?email=${email}`);
      const data = await res.json();
      if (data.success) {
        setPlans(data.dietPlans || []);
        setSubscribers(data.subscribers || []); 
      }
    } catch (err) { 
        console.error("Fetch error:", err);
    } finally { 
        setLoading(false); 
    }
  }

  useEffect(() => { fetchMealPlans(); }, []);

  const saveChanges = async () => {
    try {
      const res = await fetch('/api/meal-plans', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: editedPlan._id, ...editedPlan })
      });
      
      if (res.ok) {
        setPlans(plans.map(p => p._id === editedPlan._id ? editedPlan : p));
        setSelectedPlan(editedPlan);
        setIsEditing(false);
        showToast("تم تحديث النظام الغذائي بنجاح!");
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const confirmDelete = async () => {
    if (!planToDelete) return;
    try {
      const res = await fetch(`/api/meal-plans?id=${planToDelete._id}`, { method: 'DELETE' });
      if (res.ok) {
        setPlans(plans.filter(p => p._id !== planToDelete._id));
        setIsDeleteModalOpen(false);
        showToast("تم حذف الخطة بنجاح");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const openEditMode = (plan: any) => {
    setSelectedPlan(plan);
    setEditedPlan(JSON.parse(JSON.stringify(plan)));
    setIsEditing(true);
  };

  const openViewMode = (plan: any) => {
    setSelectedPlan(plan);
    setIsEditing(false);
  };

  const handleItemChange = (mIdx: number, iIdx: number, key: string, val: any) => {
    const newPlan = { ...editedPlan };
    newPlan.meals[mIdx].items[iIdx][key] = key === 'calories' ? parseInt(val) || 0 : val;
    setEditedPlan(newPlan);
  };

  const filteredPlans = plans.filter(p => 
    p.subscriberName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#107c41]"></div>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto bg-[#fafafa] min-h-screen font-sans text-right relative" dir="rtl">
      
      {/* Toast Notification */}
      {showSuccessToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[250] animate-in slide-in-from-top duration-500">
          <div className="bg-white border-b-4 border-green-500 px-8 py-5 rounded-[25px] shadow-2xl flex items-center gap-4 min-w-[320px]">
            <div className="bg-green-50 p-2 rounded-full text-green-500"><CheckCircle2 size={28} /></div>
            <div>
              <p className="font-black text-gray-800 text-sm">{toastMessage}</p>
              <p className="text-[10px] text-gray-400 font-bold">تمت العملية بنجاح</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">إدارة الخطط</h1>
          <p className="text-gray-400 font-bold mt-1">عرض وتعديل الأنظمة الغذائية للامهات الحوامل</p>
        </div>
        <button 
          onClick={() => {
              setNewPlanBasics({
                subscriberId: "", 
                date: new Date().toISOString().split('T')[0],
                notes: ""
              });
              setIsCreateModalOpen(true);
          }}
          className="bg-[#107c41] text-white px-7 py-3.5 rounded-[22px] font-black flex items-center gap-2 hover:bg-[#0d6334] transition-all shadow-xl shadow-green-100/50"
        >
          <Plus size={22} /> إضافة خطة جديدة
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-12 max-w-md">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
        <input 
          type="text" placeholder="بحث عن مشترك أو عنوان الخطة..." 
          className="w-full pr-12 pl-4 py-4 rounded-[24px] border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#107c41]/20 font-bold shadow-sm bg-white"
          value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Plans Grid */}
      {filteredPlans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredPlans.map((plan) => (
            <div key={plan._id} className="bg-white p-8 rounded-[45px] border border-gray-50 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#f0fdf4] rounded-[22px] flex items-center justify-center text-[#107c41] border border-green-50 shadow-inner"><User size={24} /></div>
                  <div>
                    <h3 className="font-black text-gray-800 text-lg mb-1">{plan.title}</h3>
                    <p className="text-xs text-[#107c41] font-bold italic">المشترك: {plan.subscriberName}</p>
                  </div>
                </div>
                <div className="bg-[#fff7ed] text-[#e67e22] px-4 py-2 rounded-full text-[11px] font-black flex items-center gap-2 border border-orange-50">
                  <Flame size={14} /> {plan.dailyCalories} Cal
                </div>
              </div>
              
              <p className="text-gray-400 text-[13px] font-medium mb-8 line-clamp-2 leading-relaxed h-10">
                { "نظام غذائي مخصص تم إعداده من قبل الاخصائي"}
              </p>

              <div className="flex items-center gap-3 relative z-10">
                <button onClick={() => openViewMode(plan)} className="flex-[2.5] bg-[#f0fdf4] text-[#107c41] font-black py-4 rounded-[22px] text-sm hover:bg-[#107c41] hover:text-white transition-all flex items-center justify-center gap-2">
                  <Eye size={18} /> عرض التفاصيل
                </button>
                <button onClick={() => openEditMode(plan)} className="flex-1 bg-blue-50 text-blue-500 p-4 rounded-[22px] hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center">
                  <Edit3 size={20} />
                </button>
                <button onClick={() => { setPlanToDelete(plan); setIsDeleteModalOpen(true); }} className="flex-1 bg-red-50 text-red-500 p-4 rounded-[22px] hover:bg-red-500 hover:text-white transition-all flex items-center justify-center">
                  <Trash2 size={20} />
                </button>
              </div>
              <Utensils className="absolute -bottom-6 -left-6 text-gray-50 w-24 h-24 rotate-12 opacity-50 group-hover:text-green-50 transition-colors" />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
            <Search size={32} />
          </div>
          <p className="font-black text-gray-400">لا توجد خطط غذائية مطابقة للبحث</p>
        </div>
      )}

      {/* Modal: Create New Plan */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in text-right" dir="rtl">
            <div className="flex justify-between items-center p-8 border-b border-gray-50">
              <h3 className="text-xl font-black text-gray-800">تجهيز خطة جديدة</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors"><X size={20} /></button>
            </div>
            
            <div className="p-10 space-y-8">
              <div>
                <label className="block text-sm font-black text-gray-700 mb-3 mr-1 flex items-center gap-2">
                    <User size={16} className="text-[#107c41]" /> اختيار المشترك
                </label>
                <select 
                  className="w-full bg-[#f8fafc] border border-gray-100 rounded-[20px] px-5 py-4 font-bold text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#107c41]/20 appearance-none text-right"
                  value={newPlanBasics.subscriberId}
                  onChange={(e) => setNewPlanBasics({...newPlanBasics, subscriberId: e.target.value})}
                >
                  <option value="">-- اختر المشترك --</option>
                  {subscribers.map((sub) => (
                    <option key={sub._id} value={sub._id}>{sub.fullName}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-black text-gray-700 mb-3 mr-1 flex items-center gap-2">
                    <CalendarDays size={16} className="text-[#107c41]" /> تاريخ البدء
                </label>
                <input 
                  type="date" 
                  className="w-full bg-[#f8fafc] border border-gray-100 rounded-[20px] px-5 py-4 font-bold text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#107c41]/20 text-right" 
                  value={newPlanBasics.date}
                  onChange={(e) => setNewPlanBasics({...newPlanBasics, date: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-black text-gray-700 mb-3 mr-1 flex items-center gap-2">
                    <MessageSquareText size={16} className="text-[#107c41]" /> ملاحظات إضافية للمشترك
                </label>
                <textarea 
                  rows={3}
                  placeholder="مثال: اشرب 3 لتر ماء يومياً..."
                  className="w-full bg-[#f8fafc] border border-gray-100 rounded-[20px] px-5 py-4 font-bold text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#107c41]/20 text-right resize-none text-sm"
                  value={newPlanBasics.notes}
                  onChange={(e) => setNewPlanBasics({...newPlanBasics, notes: e.target.value})}
                />
              </div>
            </div>
            
            <div className="p-8 bg-gray-50/50 flex items-center gap-4">
              <Link 
                href={`/nutritionist/meal-plans/create?subId=${newPlanBasics.subscriberId}&date=${newPlanBasics.date}&notes=${encodeURIComponent(newPlanBasics.notes)}`}
                onClick={() => setIsCreateModalOpen(false)}
                className={`bg-[#107c41] text-white font-black px-8 py-4 rounded-[20px] hover:bg-[#0d6334] transition-all flex-1 text-center ${!newPlanBasics.subscriberId && 'opacity-50 pointer-events-none'}`}
              >
                المتابعة لتصميم الوجبات
              </Link>
              <button onClick={() => setIsCreateModalOpen(false)} className="bg-white border border-gray-100 text-gray-400 font-black px-8 py-4 rounded-[20px] flex-1">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: View Details - (تم تنظيفه تماماً) */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-[50px] shadow-2xl relative p-10 md:p-14 text-right border-4 border-white">
            
            {/* الأزرار العلوية */}
            <div className="absolute left-10 top-10 flex items-center gap-3">
              {isEditing ? (
                <>
                  <button onClick={saveChanges} className="bg-[#107c41] text-white px-6 py-3 rounded-2xl font-black text-sm shadow-lg shadow-green-100 flex items-center gap-2"><Save size={18}/> حفظ التعديلات</button>
                  <button onClick={() => setIsEditing(false)} className="p-3 px-6 bg-gray-100 rounded-2xl font-bold text-gray-500 text-sm">تراجع</button>
                </>
              ) : (
                <button onClick={() => openEditMode(selectedPlan)} className="bg-blue-50 text-blue-500 px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2"><Edit3 size={18}/> تعديل</button>
              )}
              <button onClick={() => setSelectedPlan(null)} className="p-3 bg-gray-50 rounded-2xl hover:text-red-500 transition-all"><X size={22} /></button>
            </div>

            <div className="mb-10 pt-4">
              <h2 className="text-4xl font-black text-gray-900 mb-2 italic">
                {isEditing ? (
                  <input value={editedPlan.title} onChange={(e)=>setEditedPlan({...editedPlan, title: e.target.value})} className="bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 w-full text-right outline-none"/>
                ) : (
                  selectedPlan.title
                )}
              </h2>
              <p className="text-[#107c41] font-black text-lg">المشترك: {selectedPlan.subscriberName}</p>
            </div>

            {/* Macros Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
                <MacroBox label="كربوهيدرات" val={isEditing ? editedPlan.macros?.carbsCalories : selectedPlan.macros?.carbsCalories} icon={<Apple size={18}/>} color="bg-blue-50 text-blue-600" />
                <MacroBox label="بروتينات" val={isEditing ? editedPlan.macros?.proteinCalories : selectedPlan.macros?.proteinCalories} icon={<Beef size={18}/>} color="bg-red-50 text-red-600" />
                <MacroBox label="دهون" val={isEditing ? editedPlan.macros?.fatCalories : selectedPlan.macros?.fatCalories} icon={<Droplets size={18}/>} color="bg-orange-50 text-orange-600" />
            </div>

            {/* Meals List */}
            <div className="space-y-10 mb-6">
              {(isEditing ? editedPlan.meals : selectedPlan.meals)?.map((meal: any, mIdx: number) => (
                <div key={mIdx} className="bg-[#fcfcfc] border border-gray-100 p-8 rounded-[40px]">
                  <h5 className="font-black text-xl mb-8 flex items-center gap-3 border-r-4 border-[#107c41] pr-4">
                    <span className="text-3xl">
                        {meal.mealType.includes('فطور') ? '🍳' : meal.mealType.includes('غداء') ? '🍱' : '🌙'}
                    </span> 
                    {meal.mealType}
                  </h5>
                  <div className="space-y-4">
                    {meal.items?.map((item: any, iIdx: number) => (
                      <div key={iIdx} className="bg-white p-6 rounded-[25px] border border-gray-50 flex justify-between items-center shadow-sm">
                        {isEditing ? (
                          <div className="flex gap-4 w-full">
                            <input value={item.name} onChange={(e)=>handleItemChange(mIdx, iIdx, 'name', e.target.value)} className="flex-[2] bg-gray-50 p-3 rounded-xl text-sm font-bold text-right outline-none" placeholder="الصنف"/>
                            <input value={item.quantity} onChange={(e)=>handleItemChange(mIdx, iIdx, 'quantity', e.target.value)} className="flex-1 bg-gray-50 p-3 rounded-xl text-xs text-right outline-none" placeholder="الكمية"/>
                            <input value={item.calories} type="number" onChange={(e)=>handleItemChange(mIdx, iIdx, 'calories', e.target.value)} className="w-24 bg-gray-50 p-3 rounded-xl text-xs font-black text-[#107c41] text-center outline-none" placeholder="السعرات"/>
                          </div>
                        ) : (
                          <>
                            <div className="flex flex-col text-right">
                                <span className="font-black text-gray-800 text-lg leading-tight">{item.name}</span>
                                <span className="text-[11px] text-gray-400 font-bold mt-1 uppercase">{item.quantity}</span>
                            </div>
                            <span className="text-xs font-black bg-green-50 text-[#107c41] px-5 py-2.5 rounded-2xl border border-green-100/50">{item.calories} Cal</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {/* تم مسح قسم الملاحظات من هنا بالكامل */}
          </div>
        </div>
      )}

      {/* Modal: Confirm Delete */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-[45px] p-10 text-center shadow-2xl animate-in zoom-in">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white"><AlertTriangle size={36} /></div>
            <h3 className="text-2xl font-black text-gray-800 mb-2">تأكيد الحذف</h3>
            <p className="text-gray-400 font-bold text-sm mb-10">هل أنتِ متأكدة من حذف هذه الخطة؟</p>
            <div className="flex flex-col gap-3">
              <button onClick={confirmDelete} className="w-full bg-red-500 text-white font-black py-4 rounded-[22px]">نعم، احذف الخطة</button>
              <button onClick={() => setIsDeleteModalOpen(false)} className="w-full bg-gray-50 text-gray-500 font-black py-4 rounded-[22px]">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MacroBox({label, val, icon, color}: any) {
  return (
    <div className={`${color} p-7 rounded-[35px] flex flex-col items-center gap-3 border-2 border-white shadow-sm`}>
      <div className="bg-white/60 p-3 rounded-2xl shadow-sm">{icon}</div>
      <div className="text-center">
          <p className="text-[10px] font-black uppercase opacity-60 mb-1">{label}</p>
          <p className="text-xl font-black">{val || 0} <span className="text-[10px]">Cal</span></p>
      </div>
    </div>
  );
}