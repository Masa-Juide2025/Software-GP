"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, Calendar, Activity, Droplets, Heart, Scale, Plus, Loader2, ArrowLeft } from "lucide-react"

interface NewEntry {
  subscriberId: string;
  patientName: string;
  condition: string;
  vitals: { weight: string; bloodPressure: string; heartRate: string; bloodSugar: string; };
  labData: any;
}

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState<any[]>([])
  const [subscribers, setSubscribers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [isSaving, setIsSaving] = useState(false)

  const [newEntry, setNewEntry] = useState<NewEntry>({
    subscriberId: "", patientName: "", condition: "",
    vitals: { weight: "", bloodPressure: "", heartRate: "", bloodSugar: "" },
    labData: {}
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const email = localStorage.getItem("userEmail");
    try {
      const res = await fetch(`/api/nutritionist/medical-records?email=${encodeURIComponent(email || "")}`);
      const data = await res.json();
      if (Array.isArray(data)) setRecords(data);
    } catch (e) {
      console.error("Error fetching records:", e);
    } finally { setIsLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const loadSubscribers = async (cond: string) => {
    setNewEntry(prev => ({ ...prev, condition: cond, subscriberId: "", patientName: "" }));
    const email = localStorage.getItem("userEmail");
    const res = await fetch(`/api/nutritionist/medical-records?email=${email}&getSubs=true&condition=${cond}`);
    const data = await res.json();
    setSubscribers(data);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const email = localStorage.getItem("userEmail");
    try {
      const res = await fetch("/api/nutritionist/medical-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newEntry, nutritionistEmail: email })
      });
      if (res.ok) {
        setIsAddOpen(false);
        setStep(1);
        fetchData();
      }
    } finally { setIsSaving(false); }
  };

  return (
    <div className="space-y-6 p-6 text-right bg-[#F8FAFC] min-h-screen" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800 italic uppercase">السجلات الطبية</h1>
          <p className="text-slate-500 text-sm font-bold italic">متابعة الحالات المرضية</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="bg-[#0A4D42] rounded-xl font-black h-11 px-6 shadow-md gap-2">
          <Plus size={18} /> سجل جديد
        </Button>
      </div>

      <div className="relative max-w-md bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <Input placeholder="بحث..." className="pr-12 border-none h-12 font-bold focus-visible:ring-0 text-right" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center p-10"><Loader2 className="animate-spin text-[#0A4D42]" /></div>
        ) : (
          records.filter(r => r.patientName.includes(search)).map((record) => (
            <Card key={record.id} className="border-none rounded-[20px] shadow-sm bg-white overflow-hidden hover:shadow-md transition-all">
              <CardContent className="p-5 flex justify-between items-center">
                <div className="flex gap-4">
                  <Avatar className="h-14 w-14 border-4 border-slate-50"><AvatarFallback className="bg-[#D1FAE5] text-[#0A4D42] font-black italic">{record.patientInitials}</AvatarFallback></Avatar>
                  <div>
                    <h3 className="font-black text-lg text-slate-800 italic">{record.patientName}</h3>
                    <Badge className={`${record.condition === 'سكري' ? 'bg-[#E0F2FE] text-[#0369A1]' : 'bg-[#FEE2E2] text-[#B91C1C]'} border-none rounded-lg font-bold`}>{record.condition}</Badge>
                  </div>
                </div>
                <Button variant="outline" className="rounded-xl font-black h-10 px-6 border-slate-200 shadow-sm" onClick={() => setSelectedRecord(record)}>عرض التفاصيل <Eye size={16} className="mr-2" /></Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* مودال الإضافة */}
      <Dialog open={isAddOpen} onOpenChange={(val) => { setIsAddOpen(val); if(!val) setStep(1); }}>
        <DialogContent className="max-w-xl rounded-[30px] p-0 border-none bg-white shadow-2xl overflow-hidden" dir="rtl">
          <div className="bg-[#0A4D42] p-6 text-white"><DialogTitle className="text-xl font-black italic">إضافة سجل جديد</DialogTitle></div>
          <div className="p-6 space-y-6">
            {step === 1 ? (
              <div className="space-y-5">
                <div className="flex gap-2">
                    <Button variant={newEntry.condition === 'سكري' ? 'default' : 'outline'} className={`flex-1 rounded-xl font-black h-12 ${newEntry.condition === 'سكري' ? 'bg-[#0A4D42]' : ''}`} onClick={() => loadSubscribers('سكري')}>سكري</Button>
                    <Button variant={newEntry.condition === 'ضغط دم' ? 'default' : 'outline'} className={`flex-1 rounded-xl font-black h-12 ${newEntry.condition === 'ضغط دم' ? 'bg-[#1E3A8A]' : ''}`} onClick={() => loadSubscribers('ضغط دم')}>ضغط دم</Button>
                </div>
                <Select onValueChange={(val) => {
                    const s = subscribers.find(x => x._id === val);
                    const name = s?.userId?.fullName || s?.userId?.name || "مريض";
                    setNewEntry(prev => ({...prev, subscriberId: val, patientName: name}));
                }} disabled={!newEntry.condition}>
                    <SelectTrigger className="rounded-xl font-bold h-12 border-slate-200"><SelectValue placeholder="اختر المريض..." /></SelectTrigger>
                    <SelectContent>{subscribers.map(s => (<SelectItem key={s._id} value={s._id} className="font-bold text-right">{s.userId?.fullName || s.userId?.name}</SelectItem>))}</SelectContent>
                </Select>
                <div className="bg-slate-50 p-5 rounded-[25px] grid grid-cols-2 gap-4">
                    <Input placeholder="الوزن" onChange={(e)=>setNewEntry(prev=>({...prev, vitals:{...prev.vitals, weight:e.target.value}}))} />
                    <Input placeholder="الضغط" onChange={(e)=>setNewEntry(prev=>({...prev, vitals:{...prev.vitals, bloodPressure:e.target.value}}))} />
                    <Input placeholder="النبض" onChange={(e)=>setNewEntry(prev=>({...prev, vitals:{...prev.vitals, heartRate:e.target.value}}))} />
                    <Input placeholder="سكر منزلي" onChange={(e)=>setNewEntry(prev=>({...prev, vitals:{...prev.vitals, bloodSugar:e.target.value}}))} />
                </div>
                <Button disabled={!newEntry.subscriberId} onClick={() => setStep(2)} className="w-full h-14 bg-[#0A4D42] rounded-2xl font-black text-lg gap-2">التالي <ArrowLeft size={20} /></Button>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="p-5 border-2 border-slate-50 rounded-[25px] grid grid-cols-2 gap-4">
                  {newEntry.condition === 'سكري' ? (
                    <>
                      <Input placeholder="HbA1c" onChange={(e)=>setNewEntry(prev=>({...prev, labData:{...prev.labData, hba1c:e.target.value}}))} />
                      <Input placeholder="سكر صائم" onChange={(e)=>setNewEntry(prev=>({...prev, labData:{...prev.labData, fastingBloodSugar:e.target.value}}))} />
                      <Input placeholder="سكر عشوائي" onChange={(e)=>setNewEntry(prev=>({...prev, labData:{...prev.labData, randomBloodSugar:e.target.value}}))} />
                      <Input placeholder="LDL" onChange={(e)=>setNewEntry(prev=>({...prev, labData:{...prev.labData, ldl:e.target.value}}))} />
                      <Input placeholder="HDL" onChange={(e)=>setNewEntry(prev=>({...prev, labData:{...prev.labData, hdl:e.target.value}}))} />
                      <Input placeholder="كرياتينين" onChange={(e)=>setNewEntry(prev=>({...prev, labData:{...prev.labData, creatinine:e.target.value}}))} />
                      <Input placeholder="اليوريا (Urea)" onChange={(e)=>setNewEntry(prev=>({...prev, labData:{...prev.labData, urea:e.target.value}}))} />
                    </>
                  ) : (
                    <>
                      <Input className="col-span-2" placeholder="دهون الدم" onChange={(e)=>setNewEntry(prev=>({...prev, labData:{...prev.labData, bloodLipids:e.target.value}}))} />
                      <Input placeholder="يوريا" onChange={(e)=>setNewEntry(prev=>({...prev, labData:{...prev.labData, urea:e.target.value}}))} />
                      <Input placeholder="كرياتينين" onChange={(e)=>setNewEntry(prev=>({...prev, labData:{...prev.labData, creatinine:e.target.value}}))} />
                    </>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-14 rounded-2xl font-black border-slate-200">رجوع</Button>
                  <Button disabled={isSaving} onClick={handleSave} className="flex-[2] h-14 bg-[#0A4D42] rounded-2xl font-black text-lg">{isSaving ? <Loader2 className="animate-spin" /> : "حفظ البيانات"}</Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* مودال العرض */}
      <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
        <DialogContent className="max-w-2xl rounded-[35px] p-0 border-none overflow-hidden bg-white shadow-2xl" dir="rtl">
          {selectedRecord && (
            <div className="text-right">
              <div className={`${selectedRecord.condition === 'سكري' ? 'bg-[#0A4D42]' : 'bg-[#1E3A8A]'} p-7 text-white flex items-center gap-5`}>
                <Avatar className="h-16 w-16 border-4 border-white/20 shadow-xl"><AvatarFallback className="bg-white text-slate-800 font-black italic">{selectedRecord.patientInitials}</AvatarFallback></Avatar>
                <div>
                  <DialogTitle className="text-2xl font-black italic text-white tracking-tight">{selectedRecord.patientName}</DialogTitle>
                  <div className="text-[11px] font-bold opacity-80 italic flex items-center gap-2 mt-1">
                    <Badge className="bg-white/20 border-none text-white">{selectedRecord.condition}</Badge> | {selectedRecord.date}
                  </div>
                </div>
              </div>
              <div className="p-8 space-y-8 bg-slate-50/50">
                <div className="grid grid-cols-4 gap-4">
                  <VitalsBox icon={<Activity className="text-green-500" size={22}/>} label="النبض" value={selectedRecord.vitals.heartRate} />
                  <VitalsBox icon={<Droplets className="text-orange-500" size={22}/>} label="السكر" value={selectedRecord.vitals.bloodSugar} />
                  <VitalsBox icon={<Heart className="text-red-500" size={22}/>} label="الضغط" value={selectedRecord.vitals.bloodPressure} />
                  <VitalsBox icon={<Scale className="text-blue-500" size={22}/>} label="الوزن" value={selectedRecord.vitals.weight} />
                </div>
                <Card className="rounded-[30px] border-none shadow-sm overflow-hidden bg-white p-6 grid grid-cols-2 gap-6">
                    {selectedRecord.labResults.map((lab: any, i: number) => (
                      <div key={i} className="flex flex-col gap-1 border-b border-slate-50 pb-3">
                        <span className="font-bold text-slate-400 text-[10px] uppercase italic">{lab.name}</span>
                        <span className="font-black text-slate-800 text-[15px] italic">{lab.value}</span>
                      </div>
                    ))}
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function VitalsBox({ icon, label, value }: any) {
  return (
    <div className="bg-white p-4 rounded-3xl border border-slate-100 flex flex-col items-center shadow-sm hover:shadow-md transition-all">
      <div className="mb-3 p-2 bg-slate-50 rounded-2xl">{icon}</div>
      <p className="text-lg font-black text-slate-800 italic leading-none">{value}</p>
      <p className="text-[10px] font-bold text-slate-400 uppercase mt-2 italic tracking-tighter">{label}</p>
    </div>
  )
}