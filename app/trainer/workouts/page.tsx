"use client"
import { useEffect, useState } from "react";
import { Plus, X, Edit3, Trash2, Dumbbell, Activity, Save, Loader2, Trash, TrendingUp, Clock, AlertTriangle, Youtube, Play } from "lucide-react";

export default function WorkoutsPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // التحكم في المودلز
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlan, setEditedPlan] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const initialNewPlan = {
    title: "", subscriberId: "", level: "beginner", durationWeeks: 4,
    exercises: [{ exerciseName: "", sets: 3, reps: "12", restSeconds: 60, videoUrl: "" }]
  };
  const [newPlan, setNewPlan] = useState(initialNewPlan);

  const fetchData = async () => {
    try {
      const email = localStorage.getItem("userEmail");
      const res = await fetch(`/api/trainer/workout-plans?email=${email}`);
      const data = await res.json();
      if (data.success) {
        setPlans(data.workoutPlans);
        setSubscribers(data.subscribers);
      }
    } catch (e) { console.error("Fetch error", e); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const addEx = (isEdit: boolean) => {
    const emptyEx = { exerciseName: "", sets: 3, reps: "12", restSeconds: 60, videoUrl: "" };
    if (isEdit) setEditedPlan({...editedPlan, exercises: [...editedPlan.exercises, emptyEx]});
    else setNewPlan({...newPlan, exercises: [...newPlan.exercises, emptyEx]});
  };

  const removeEx = (index: number, isEdit: boolean) => {
    if (isEdit) {
      const updated = editedPlan.exercises.filter((_: any, i: number) => i !== index);
      setEditedPlan({...editedPlan, exercises: updated});
    } else {
      const updated = newPlan.exercises.filter((_, i) => i !== index);
      setNewPlan({...newPlan, exercises: updated});
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    const res = await fetch("/api/trainer/workout-plans", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newPlan, email: localStorage.getItem("userEmail") })
    });
    if (res.ok) { await fetchData(); setIsCreateOpen(false); setNewPlan(initialNewPlan); }
    setActionLoading(false);
  };

  const handleUpdate = async () => {
    setActionLoading(true);
    const res = await fetch("/api/trainer/workout-plans", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId: editedPlan._id, ...editedPlan })
    });
    if (res.ok) { await fetchData(); setIsEditing(false); setSelectedPlan(null); }
    setActionLoading(false);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setActionLoading(true);
    const res = await fetch(`/api/trainer/workout-plans?id=${deleteId}`, { method: "DELETE" });
    if (res.ok) { await fetchData(); setDeleteId(null); }
    setActionLoading(false);
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-[#107c41]">جاري التحميل...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto bg-[#fafafa] min-h-screen text-right font-sans" dir="rtl">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">إدارة التمارين</h1>
          <p className="text-gray-400 text-sm font-bold italic">تصميم ومتابعة البرامج الرياضية للمشتركين</p>
        </div>
        <button onClick={() => setIsCreateOpen(true)} className="bg-[#107c41] text-white px-8 py-4 rounded-[24px] font-black flex items-center gap-2 shadow-xl hover:scale-105 transition-transform active:scale-95">
          <Plus size={22} /> إضافة برنامج تدريبي
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div key={plan._id} className="bg-white p-8 rounded-[45px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
               <div className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{plan.level}</div>
               <div className="w-12 h-12 bg-[#f0fdf4] rounded-[20px] flex items-center justify-center text-[#107c41] group-hover:rotate-12 transition-transform"><Dumbbell size={22} /></div>
            </div>
            <h3 className="font-black text-gray-800 text-xl mb-1">{plan.title}</h3>
            <p className="text-xs text-[#107c41] font-bold mb-8 italic">المشترك: {plan.subscriberName}</p>
            
            <div className="flex gap-2">
              <button onClick={() => { setSelectedPlan(plan); setIsEditing(false); }} className="flex-[3] bg-[#f0fdf4] text-[#107c41] font-black py-4 rounded-[22px] text-sm hover:bg-[#107c41] hover:text-white transition-all">عرض البرنامج</button>
              <button onClick={() => { setEditedPlan({...plan}); setIsEditing(true); setSelectedPlan(plan); }} className="p-4 bg-blue-50 text-blue-500 rounded-[22px] hover:bg-blue-500 hover:text-white transition-colors"><Edit3 size={20} /></button>
              <button onClick={() => setDeleteId(plan._id)} className="p-4 bg-red-50 text-red-500 rounded-[22px] hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={20} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: View & Edit (تعديل الشكل ليطابق طلبك) */}
      {(selectedPlan || isEditing) && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in zoom-in text-right">
          <div className="bg-white w-full max-w-4xl rounded-[45px] p-12 overflow-y-auto max-h-[92vh] relative shadow-2xl">
            <button onClick={() => { setSelectedPlan(null); setIsEditing(false); }} className="absolute left-10 top-10 p-2 bg-gray-50 rounded-full text-gray-400 hover:text-red-500 transition-all"><X size={20}/></button>
            
            <h2 className="text-2xl font-black text-gray-800 mb-10 text-center italic">
              {isEditing ? "تعديل البرنامج" : "تفاصيل البرنامج التدريبي"}
            </h2>
            
            {/* إحصائيات علوية */}
            <div className="grid grid-cols-3 gap-6 mb-12">
               <div className="p-6 bg-slate-50/50 rounded-[30px] text-center border-b-4 border-blue-200">
                  <span className="text-[10px] font-black text-gray-400 block mb-2 uppercase tracking-tighter">المدة (أسابيع)</span>
                  <div className="flex items-center justify-center gap-1">
                    <Clock size={16} className="text-blue-500"/>
                    <input type="number" disabled={!isEditing} className="bg-transparent font-black text-2xl text-center w-12 outline-none" value={isEditing ? editedPlan.durationWeeks : selectedPlan.durationWeeks} onChange={e => setEditedPlan({...editedPlan, durationWeeks: e.target.value})}/>
                  </div>
               </div>
               <div className="p-6 bg-slate-50/50 rounded-[30px] text-center border-b-4 border-[#107c41]">
                  <span className="text-[10px] font-black text-gray-400 block mb-2 uppercase tracking-tighter">التقدم (%)</span>
                  <div className="flex items-center justify-center gap-1">
                    <Activity size={16} className="text-green-500"/>
                    <input type="number" disabled={!isEditing} className="bg-transparent font-black text-2xl text-center w-12 outline-none" value={isEditing ? editedPlan.progress : selectedPlan.progress} onChange={e => setEditedPlan({...editedPlan, progress: e.target.value})}/>
                  </div>
               </div>
               <div className="p-6 bg-slate-50/50 rounded-[30px] text-center border-b-4 border-yellow-200">
                  <span className="text-[10px] font-black text-gray-400 block mb-2 uppercase tracking-tighter">المستوى</span>
                  <div className="flex items-center justify-center gap-1">
                    <TrendingUp size={16} className="text-yellow-500"/>
                    <select disabled={!isEditing} className="bg-transparent font-black text-lg text-center outline-none appearance-none cursor-pointer" value={isEditing ? editedPlan.level : selectedPlan.level} onChange={e => setEditedPlan({...editedPlan, level: e.target.value})}>
                      <option value="beginner">مبتدئ</option>
                      <option value="intermediate">متوسط</option>
                      <option value="advanced">متقدم</option>
                    </select>
                  </div>
               </div>
            </div>

            <div className="space-y-5">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="font-black text-lg flex items-center gap-3"><Activity className="text-[#107c41]"/> قائمة التمارين</h3>
                  {isEditing && <button type="button" onClick={() => addEx(true)} className="text-[#107c41] font-black text-xs border border-[#107c41] px-4 py-2 rounded-full hover:bg-[#107c41] hover:text-white transition-all">+ إضافة تمرين</button>}
               </div>

               {/* شكل الجدول المصغر (الصفوف) */}
               {(isEditing ? editedPlan.exercises : selectedPlan.exercises).map((ex: any, i: number) => (
                 <div key={i} className="p-6 border border-gray-100 rounded-[30px] hover:border-[#107c41]/30 transition-all bg-white shadow-sm space-y-4 relative group">
                    <div className="grid grid-cols-4 items-center gap-4 text-center">
                      <div className="text-right border-l pr-2">
                        <label className="text-[10px] font-black text-gray-400 mb-1 block">التمرين</label>
                        <input disabled={!isEditing} className="w-full font-bold bg-transparent outline-none italic" value={ex.exerciseName} onChange={e => { const exs = [...editedPlan.exercises]; exs[i].exerciseName = e.target.value; setEditedPlan({...editedPlan, exercises: exs}); }}/>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-400 mb-1 block">جولات</label>
                        <input disabled={!isEditing} type="number" className="w-full font-bold bg-transparent text-center outline-none" value={ex.sets} onChange={e => { const exs = [...editedPlan.exercises]; exs[i].sets = e.target.value; setEditedPlan({...editedPlan, exercises: exs}); }}/>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-400 mb-1 block">تكرار</label>
                        <input disabled={!isEditing} className="w-full font-bold bg-transparent text-center outline-none" value={ex.reps || ex.durationSeconds} onChange={e => { const exs = [...editedPlan.exercises]; if(exs[i].reps) exs[i].reps = e.target.value; else exs[i].durationSeconds = e.target.value; setEditedPlan({...editedPlan, exercises: exs}); }}/>
                      </div>
                      <div className="flex items-center">
                        <div className="flex-1">
                          <label className="text-[10px] font-black text-gray-400 mb-1 block">راحة (ثانية)</label>
                          <input disabled={!isEditing} className="w-full font-bold bg-transparent text-center outline-none" value={ex.restSeconds} onChange={e => { const exs = [...editedPlan.exercises]; exs[i].restSeconds = e.target.value; setEditedPlan({...editedPlan, exercises: exs}); }}/>
                        </div>
                        {isEditing && (
                          <button onClick={() => removeEx(i, true)} className="text-red-300 hover:text-red-500 transition-colors p-1"><Trash size={16}/></button>
                        )}
                      </div>
                    </div>
                    
                    {/* قسم رابط اليوتيوب المحسن */}
                    {(isEditing || ex.videoUrl) && (
                      <div className="bg-slate-50/80 p-3 rounded-2xl flex items-center justify-between mt-2 border border-slate-100">
                        <div className="flex items-center gap-3 flex-1 overflow-hidden">
                          <Youtube size={18} className="text-red-600 flex-shrink-0" />
                          {isEditing ? (
                            <input placeholder="ضع رابط اليوتيوب هنا..." className="bg-white border-none text-[11px] p-2 rounded-xl flex-1 font-medium outline-none" value={ex.videoUrl || ""} onChange={e => { const exs = [...editedPlan.exercises]; exs[i].videoUrl = e.target.value; setEditedPlan({...editedPlan, exercises: exs}); }} />
                          ) : (
                            <span className="text-[11px] font-bold text-gray-500 truncate">{ex.videoUrl || "لا يوجد فيديو"}</span>
                          )}
                        </div>
                        {!isEditing && ex.videoUrl && (
                          <a href={ex.videoUrl} target="_blank" rel="noopener noreferrer" className="bg-red-50 text-red-600 px-4 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-2 hover:bg-red-600 hover:text-white transition-all mr-2">
                            <Play size={12} fill="currentColor"/> مشاهدة
                          </a>
                        )}
                      </div>
                    )}
                 </div>
               ))}
            </div>

            {isEditing && (
              <button onClick={handleUpdate} disabled={actionLoading} className="w-full bg-[#107c41] text-white font-black py-6 rounded-[30px] mt-12 shadow-xl flex items-center justify-center gap-3 hover:bg-[#0d6334] transition-all">
                {actionLoading ? <Loader2 className="animate-spin"/> : <Save size={22}/>} حفظ التعديلات النهائية
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal: Create Plan (الإضافة) */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <form onSubmit={handleCreate} className="bg-white w-full max-w-5xl rounded-[45px] p-10 overflow-y-auto max-h-[92vh] shadow-2xl relative text-right">
            <button type="button" onClick={() => setIsCreateOpen(false)} className="absolute left-8 top-8 p-2 bg-gray-50 rounded-full"><X size={20}/></button>
            <h2 className="text-2xl font-black text-gray-800 mb-8 italic border-r-4 border-[#107c41] pr-4">إنشاء برنامج تدريبي جديد</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required placeholder="عنوان البرنامج (مثلاً: إنقاص وزن)" className="p-5 bg-gray-50 rounded-3xl border-none font-bold" value={newPlan.title} onChange={e => setNewPlan({...newPlan, title: e.target.value})} />
                <select required className="p-5 bg-gray-50 rounded-3xl border-none font-bold" value={newPlan.subscriberId} onChange={e => setNewPlan({...newPlan, subscriberId: e.target.value})}>
                  <option value="">اختر المشترك</option>
                  {subscribers.map(s => <option key={s._id} value={s._id}>{s.fullName}</option>)}
                </select>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-black text-lg flex items-center gap-2"><Dumbbell size={20} className="text-[#107c41]"/> التمارين المدرجة</h3>
                  <button type="button" onClick={() => addEx(false)} className="text-[#107c41] font-black text-xs border border-[#107c41] px-4 py-2 rounded-full hover:bg-[#107c41] hover:text-white transition-all">+ تمرين إضافي</button>
                </div>
                
                {newPlan.exercises.map((ex, idx) => (
                  <div key={idx} className="bg-gray-50 p-6 rounded-[35px] space-y-4 border border-transparent hover:border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       <input required placeholder="اسم التمرين" className="bg-white p-4 rounded-2xl border-none font-bold shadow-sm" value={ex.exerciseName} onChange={e => { const exs = [...newPlan.exercises]; exs[idx].exerciseName = e.target.value; setNewPlan({...newPlan, exercises: exs}); }} />
                       <div className="flex gap-2">
                         <input required type="number" placeholder="جولات" className="flex-1 bg-white p-4 rounded-2xl border-none font-bold text-center shadow-sm" value={ex.sets} onChange={e => { const exs = [...newPlan.exercises]; exs[idx].sets = Number(e.target.value); setNewPlan({...newPlan, exercises: exs}); }} />
                         <input required placeholder="تكرار" className="flex-1 bg-white p-4 rounded-2xl border-none font-bold text-center shadow-sm" value={ex.reps} onChange={e => { const exs = [...newPlan.exercises]; exs[idx].reps = e.target.value; setNewPlan({...newPlan, exercises: exs}); }} />
                       </div>
                       <input required type="number" placeholder="راحة (ثانية)" className="bg-white p-4 rounded-2xl border-none font-bold text-center shadow-sm" value={ex.restSeconds} onChange={e => { const exs = [...newPlan.exercises]; exs[idx].restSeconds = Number(e.target.value); setNewPlan({...newPlan, exercises: exs}); }} />
                    </div>
                    <div className="flex gap-2 items-center bg-white p-2 rounded-2xl shadow-sm border">
                      <Youtube className="text-red-500 mr-2" size={24} />
                      <input placeholder="رابط فيديو التمرين من يوتيوب" className="flex-1 p-2 bg-transparent font-medium text-xs outline-none" value={ex.videoUrl || ""} onChange={e => { const exs = [...newPlan.exercises]; exs[idx].videoUrl = e.target.value; setNewPlan({...newPlan, exercises: exs}); }} />
                      {newPlan.exercises.length > 1 && <button type="button" onClick={() => removeEx(idx, false)} className="text-red-400 p-2"><Trash size={18}/></button>}
                    </div>
                  </div>
                ))}
              </div>

              <button type="submit" disabled={actionLoading} className="w-full bg-[#107c41] text-white py-6 rounded-[30px] font-black shadow-xl flex items-center justify-center gap-2 hover:bg-[#0d6334] transition-all">
                {actionLoading ? <Loader2 className="animate-spin" /> : <Save size={20} />} حفظ البرنامج النهائي
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-md rounded-[40px] p-10 text-center shadow-2xl">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6"><AlertTriangle size={40} /></div>
            <h2 className="text-2xl font-black text-gray-800 mb-2">حذف البرنامج؟</h2>
            <p className="text-gray-500 font-bold mb-8">سيتم إزالة هذا البرنامج من قائمة المشترك نهائياً.</p>
            <div className="flex gap-3">
              <button onClick={confirmDelete} disabled={actionLoading} className="flex-1 bg-red-500 text-white font-black py-4 rounded-[22px] flex items-center justify-center gap-2">{actionLoading ? <Loader2 className="animate-spin" size={18}/> : "نعم، حذف"}</button>
              <button onClick={() => setDeleteId(null)} className="flex-1 bg-gray-100 text-gray-600 font-black py-4 rounded-[22px]">إلغاء</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}