"use client"
import { useEffect, useState } from "react";
import { 
  Plus, Search, Utensils, Flame, X, Apple, Beef, 
  Droplets, User, Trash2, Edit3, Eye, AlertTriangle, 
  Save, CheckCircle2, CalendarDays, MessageSquareText 
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
    } catch (err) { console.error(err); } finally { setLoading(false); }
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
        showToast("تم التحديث بنجاح!");
      }
    } catch (err) { console.error(err); }
  };

  const confirmDelete = async () => {
    if (!planToDelete) return;
    try {
      const res = await fetch(`/api/meal-plans?id=${planToDelete._id}`, { method: 'DELETE' });
      if (res.ok) {
        setPlans(plans.filter(p => p._id !== planToDelete._id));
        setIsDeleteModalOpen(false);
        showToast("تم الحذف بنجاح");
      }
    } catch (err) { console.error(err); }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const filteredPlans = plans.filter(p => 
    p.subscriberName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleItemChange = (mIdx: number, iIdx: number, key: string, val: any) => {
    const newPlan = { ...editedPlan };
    newPlan.meals[mIdx].items[iIdx][key] = key === 'calories' ? parseInt(val) || 0 : val;
    setEditedPlan(newPlan);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#107c41]"></div>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto bg-[#fafafa] min-h-screen font-sans text-right relative" dir="rtl">
      
      {showSuccessToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[250] animate-in slide-in-from-top">
          <div className="bg-white border-b-4 border-green-500 px-8 py-5 rounded-[25px] shadow-2xl flex items-center gap-4 min-w-[320px]">
            <CheckCircle2 className="text-green-500" size={28} />
            <div>
              <p className="font-black text-gray-800 text-sm">{toastMessage}</p>
              <p className="text-[10px] text-gray-400 font-bold">تمت العملية بنجاح</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">إدارة الخطط</h1>
          <p className="text-gray-400 font-bold mt-1">عرض وتعديل الأنظمة الغذائية للأمهات</p>
        </div>
        <button 
          onClick={() => {
            setNewPlanBasics({ subscriberId: "", date: new Date().toISOString().split('T')[0], notes: "" });
            setIsCreateModalOpen(true);
          }}
          className="bg-[#107c41] text-white px-7 py-3.5 rounded-[22px] font-black flex items-center gap-2 hover:bg-[#0d6334] transition-all shadow-xl shadow-green-100/50"
        >
          <Plus size={22} /> إضافة خطة جديدة
        </button>
      </div>

      <div className="relative mb-12 max-w-md">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
        <input 
          type="text" placeholder="بحث..." 
          className="w-full pr-12 pl-4 py-4 rounded-[24px] border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#107c41]/20 font-bold shadow-sm bg-white"
          value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredPlans.map((plan) => (
          <div key={plan._id} className="bg-white p-8 rounded-[45px] border border-gray-50 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#f0fdf4] rounded-[22px] flex items-center justify-center text-[#107c41] border border-green-50"><User size={24} /></div>
                <div>
                  <h3 className="font-black text-gray-800 text-lg mb-1">{plan.title}</h3>
                  <p className="text-xs text-[#107c41] font-bold italic">المشترك: {plan.subscriberName}</p>
                </div>
              </div>
              <div className="bg-[#fff7ed] text-[#e67e22] px-4 py-2 rounded-full text-[11px] font-black flex items-center gap-2 border border-orange-50">
                <Flame size={14} /> {plan.dailyCalories} Cal
              </div>
            </div>
            
            <div className="flex items-center gap-3 relative z-10">
              <button onClick={() => { setSelectedPlan(plan); setIsEditing(false); }} className="flex-[2.5] bg-[#f0fdf4] text-[#107c41] font-black py-4 rounded-[22px] text-sm hover:bg-[#107c41] hover:text-white transition-all">عرض التفاصيل</button>
              <button onClick={() => { setSelectedPlan(plan); setEditedPlan(JSON.parse(JSON.stringify(plan))); setIsEditing(true); }} className="flex-1 bg-blue-50 text-blue-500 p-4 rounded-[22px] hover:bg-blue-500 hover:text-white transition-all flex justify-center"><Edit3 size={20} /></button>
              <button onClick={() => { setPlanToDelete(plan); setIsDeleteModalOpen(true); }} className="flex-1 bg-red-50 text-red-500 p-4 rounded-[22px] hover:bg-red-500 hover:text-white transition-all flex justify-center"><Trash2 size={20} /></button>
            </div>
          </div>
        ))}
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden text-right" dir="rtl">
            <div className="p-8 border-b border-gray-50 flex justify-between">
               <h3 className="text-xl font-black text-gray-800">تجهيز خطة جديدة</h3>
               <button onClick={() => setIsCreateModalOpen(false)}><X className="text-gray-400" /></button>
            </div>
            <div className="p-10 space-y-6">
              <div>
                <label className="block text-sm font-black text-gray-700 mb-2 mr-1 flex items-center gap-2">
                    <User size={16} className="text-[#107c41]" /> اختيار المشترك
                </label>
                <select 
                  className="w-full bg-[#f8fafc] border border-gray-100 rounded-[20px] px-5 py-4 font-bold text-gray-600 outline-none"
                  value={newPlanBasics.subscriberId}
                  onChange={(e) => setNewPlanBasics({...newPlanBasics, subscriberId: e.target.value})}
                >
                  <option value="">-- اختر المشترك --</option>
                  {subscribers.map((sub) => <option key={sub._id} value={sub._id}>{sub.fullName}</option>)}
                </select>
              </div>

              {/* حقل تاريخ البدء اللي رجعناه */}
              <div>
                <label className="block text-sm font-black text-gray-700 mb-2 mr-1 flex items-center gap-2">
                    <CalendarDays size={16} className="text-[#107c41]" /> تاريخ البدء
                </label>
                <input 
                  type="date"
                  className="w-full bg-[#f8fafc] border border-gray-100 rounded-[20px] px-5 py-4 font-bold text-gray-600 outline-none"
                  value={newPlanBasics.date}
                  onChange={(e) => setNewPlanBasics({...newPlanBasics, date: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-black text-gray-700 mb-2 mr-1 flex items-center gap-2">
                    <MessageSquareText size={16} className="text-[#107c41]" /> ملاحظات الخطة (سترسل كرسالة تنبيه)
                </label>
                <textarea 
                  rows={3}
                  className="w-full bg-[#f8fafc] border border-gray-100 rounded-[20px] px-5 py-4 font-bold text-gray-600 outline-none resize-none"
                  value={newPlanBasics.notes}
                  onChange={(e) => setNewPlanBasics({...newPlanBasics, notes: e.target.value})}
                />
              </div>
            </div>
            <div className="p-8 bg-gray-50 flex gap-4">
              <Link 
                href={`/nutritionist/meal-plans/create?subId=${newPlanBasics.subscriberId}&date=${newPlanBasics.date}&notes=${encodeURIComponent(newPlanBasics.notes)}`}
                className={`bg-[#107c41] text-white font-black px-8 py-4 rounded-[20px] flex-1 text-center ${!newPlanBasics.subscriberId && 'opacity-50 pointer-events-none'}`}
              >
                بدء التصميم
              </Link>
              <button onClick={() => setIsCreateModalOpen(false)} className="bg-white border border-gray-100 text-gray-400 font-black px-8 py-4 rounded-[20px] flex-1">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* باقي المودالات للعرض والحذف... */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-[50px] p-10 md:p-14 text-right">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-4xl font-black text-gray-900">{isEditing ? "تعديل النظام" : selectedPlan.title}</h2>
              <div className="flex gap-3">
                {isEditing && <button onClick={saveChanges} className="bg-[#107c41] text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2"><Save size={18}/> حفظ</button>}
                <button onClick={() => setSelectedPlan(null)}><X size={28} className="text-gray-300"/></button>
              </div>
            </div>
            <div className="space-y-6">
                {(isEditing ? editedPlan.meals : selectedPlan.meals)?.map((meal: any, mIdx: number) => (
                    <div key={mIdx} className="bg-gray-50 p-6 rounded-[30px]">
                        <h4 className="font-black text-xl mb-4 text-[#107c41]">{meal.mealType}</h4>
                        {meal.items?.map((item: any, iIdx: number) => (
                            <div key={iIdx} className="bg-white p-4 rounded-2xl mb-2 flex justify-between items-center">
                                {isEditing ? (
                                    <input value={item.name} onChange={(e)=>handleItemChange(mIdx, iIdx, 'name', e.target.value)} className="w-full text-right outline-none font-bold" />
                                ) : (
                                    <>
                                        <span className="font-bold">{item.name} ({item.quantity})</span>
                                        <span className="text-[#107c41] font-black">{item.calories} Cal</span>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[45px] p-10 text-center shadow-2xl">
            <AlertTriangle className="text-red-500 mx-auto mb-6" size={48} />
            <h3 className="text-2xl font-black mb-10">تأكيد الحذف؟</h3>
            <button onClick={confirmDelete} className="w-full bg-red-500 text-white font-black py-4 rounded-[22px] mb-3">حذف</button>
            <button onClick={() => setIsDeleteModalOpen(false)} className="w-full bg-gray-50 text-gray-500 font-black py-4 rounded-[22px]">إلغاء</button>
          </div>
        </div>
      )}
    </div>
  );
}