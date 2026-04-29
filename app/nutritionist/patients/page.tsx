"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { 
  Search, Phone, Activity, Droplets, Heart, 
  Loader2, RefreshCw, Scale, Mail, Send, Pill, Ban, Zap, CheckCircle, Lock, Save
} from "lucide-react"

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [recommendation, setRecommendation] = useState("")
  const [privateNote, setPrivateNote] = useState("") 
  const [isSending, setIsSending] = useState(false)
  const [isSavingNote, setIsSavingNote] = useState(false) 
  const [isSent, setIsSent] = useState(false)
  const [noteSaved, setNoteSaved] = useState(false) 

  const fetchPatients = useCallback(async () => {
    setIsLoading(true)
    const email = localStorage.getItem("userEmail")
    if (!email) return
    try {
      const res = await fetch(`/api/nutritionist/patients?email=${encodeURIComponent(email)}`)
      const data = await res.json()
      if (Array.isArray(data)) setPatients(data)
    } catch (err) { console.error("Fetch error:", err) }
    finally { setIsLoading(false) }
  }, [])

  useEffect(() => { fetchPatients() }, [fetchPatients])

  const handleSendMessage = async () => {
    if (!recommendation.trim() || !selectedPatient) return;
    setIsSending(true)
    try {
      const res = await fetch('/api/nutritionist/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriberId: selectedPatient._id,
          nutritionistId: selectedPatient.nutritionistId,
          message: recommendation,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setIsSent(true)
        setRecommendation("")
        setTimeout(() => setIsSent(false), 3000)
      }
    } catch (err) { console.error(err) }
    finally { setIsSending(false) }
  }

  const handleSavePrivateNote = async () => {
    if (!privateNote.trim() || !selectedPatient) return;
    setIsSavingNote(true)
    try {
      const res = await fetch('/api/nutritionist/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriberId: selectedPatient._id,
          nutritionistId: selectedPatient.nutritionistId,
          message: privateNote,
          type: "note" 
        }),
      })
      const data = await res.json()
      if (data.success) {
        setNoteSaved(true)
        setPrivateNote("")
        setTimeout(() => setNoteSaved(false), 3000)
      }
    } catch (err) { console.error(err) }
    finally { setIsSavingNote(false) }
  }

  const filtered = patients.filter(p => 
    p.displayName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 space-y-6 text-right bg-[#F8FAFC]" dir="rtl">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-white p-6 rounded-[25px] shadow-sm border border-slate-50">
        <div>
          <h1 className="text-2xl font-black text-slate-950">إدارة ومتابعة المرضى</h1>
          <p className="text-slate-500 text-xs font-bold uppercase mt-1 tracking-wider italic">Patient Care & Monitoring</p>
        </div>
        <Button onClick={fetchPatients} variant="ghost" className="rounded-full h-12 w-12 hover:bg-slate-100">
          {isLoading ? <Loader2 className="animate-spin text-[#0A4D42]" /> : <RefreshCw className="text-slate-500" />}
        </Button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <Input 
          className="pr-11 rounded-2xl border-none shadow-sm h-12 bg-white font-bold placeholder:text-slate-300" 
          placeholder="بحث عن مريض..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Patients Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-[#0A4D42]" /></div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((patient) => (
            <Card 
              key={patient._id} 
              className="cursor-pointer hover:shadow-xl transition-all duration-300 rounded-[35px] border border-slate-100 bg-white group overflow-hidden"
              onClick={() => setSelectedPatient(patient)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-5">
                  <Avatar className="h-16 w-16 border-2 border-red-50 shadow-inner group-hover:scale-105 transition-transform">
                    <AvatarFallback className="bg-red-50 text-red-500 font-black text-xl italic">
                      {patient.displayName?.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-black text-lg text-slate-900 leading-none">{patient.displayName}</h3>
                    <Badge className={`border-none rounded-lg text-[10px] px-2 py-0.5 mt-2 font-bold uppercase ${
                      patient.goal === "Monitoring a patient with high blood pressure" 
                      ? "bg-orange-50 text-orange-700" 
                      : "bg-green-50 text-green-700"
                    }`}>
                      {patient.goal === "Monitoring a patient with high blood pressure" 
                        ? "متابعة مريض ضغط" 
                        : "متابعة مريض سكري"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Patient Detail Dialog */}
      <Dialog open={!!selectedPatient} onOpenChange={() => setSelectedPatient(null)}>
        <DialogContent className="max-w-3xl rounded-[40px] p-0 overflow-hidden border-none bg-white shadow-2xl" dir="rtl">
          {selectedPatient && (
            <div className="text-right max-h-[90vh] overflow-y-auto">
              {/* Header Area */}
              <div className="bg-[#0A4D42] p-8 text-white flex justify-between items-center relative">
                <div className="flex items-center gap-6 z-10">
                  <Avatar className="h-24 w-24 border-4 border-white/20 shadow-2xl">
                    <AvatarFallback className="text-4xl font-black text-[#0A4D42] bg-white uppercase italic">
                       {selectedPatient.displayName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="text-3xl font-black text-white italic">{selectedPatient.displayName}</DialogTitle>
                    <p className="text-sm font-bold opacity-70 italic tracking-wide">
                       الهدف: {selectedPatient.goal === "Monitoring a patient with high blood pressure" ? "متابعة مريض ضغط" : "متابعة مريض سكري"}
                    </p>
                  </div>
                </div>
                {/* تم حذف الجنس من هنا والإبقاء على العمر فقط */}
                <Badge className="bg-white/10 text-white border-none rounded-full px-4 py-2 font-bold uppercase">
                   {selectedPatient.age} سنة
                </Badge>
              </div>

              <div className="p-8 space-y-8 bg-slate-50/30">
                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4">
                  <ContactBox icon={<Phone size={14} className="text-[#0A4D42]"/>} label="رقم الجوال" value={selectedPatient.phone || "---"} />
                  <ContactBox icon={<Mail size={14} className="text-[#0A4D42]"/>} label="البريد الإلكتروني" value={selectedPatient.email || "---"} />
                </div>

                {/* Health Metrics Card */}
                <Card className="rounded-[30px] border border-slate-100 shadow-inner bg-white">
                  <CardHeader className="pb-3 border-b border-slate-50">
                    <CardTitle className="text-slate-900 font-black text-xs flex items-center gap-2 uppercase tracking-widest italic">
                        <Activity size={18} className="text-[#0A4D42]" /> القياسات الحيوية الأخيرة
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <MetricBox icon={<Droplets className="text-red-500"/>} label="السكر" value={selectedPatient.healthMetrics?.bloodSugar} unit="mg/dL" />
                    <MetricBox icon={<Scale className="text-[#0A4D42]"/>} label="الوزن" value={selectedPatient.weight} unit="kg" />
                    <MetricBox icon={<Heart className="text-rose-500"/>} label="الضغط" value={selectedPatient.healthMetrics?.bloodPressure} />
                    <MetricBox icon={<Activity className="text-blue-500"/>} label="النبض" value={selectedPatient.healthMetrics?.heartRate} unit="bpm" />
                  </CardContent>
                </Card>

                {/* Medications & Supplements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <MedicalCard title="المكملات الغذائية" icon={<Zap className="text-yellow-500"/>}>
                      {selectedPatient.medicalInfo?.supplements?.map((s: any, i: number) => (
                        <Badge key={i} className="bg-white text-slate-800 border border-slate-100 rounded-xl px-4 py-1.5 font-bold shadow-sm">{s}</Badge>
                      ))}
                    </MedicalCard>
                    <MedicalCard title="الأدوية الحالية" icon={<Pill className="text-[#0A4D42]"/>}>
                      {selectedPatient.medicalInfo?.medications?.map((m: any, i: number) => (
                        <Badge key={i} className="bg-white text-slate-800 border border-slate-100 rounded-xl px-4 py-1.5 font-bold shadow-sm">{m}</Badge>
                      ))}
                    </MedicalCard>
                </div>

                {/* Forbidden Foods */}
                <div className="bg-red-50/40 p-6 rounded-[30px] border border-red-100 space-y-4">
                   <h4 className="font-black text-sm flex items-center gap-2 text-red-700 uppercase tracking-wider italic"><Ban size={18} className="text-red-500"/> الممنوعات الغذائية</h4>
                   <div className="flex flex-wrap gap-2">
                      {selectedPatient.medicalInfo?.forbiddenFoods?.map((f: any, i: number) => (
                        <Badge key={i} variant="destructive" className="rounded-xl px-4 py-1.5 font-bold">{f}</Badge>
                      ))}
                   </div>
                </div>

                {/* قسم الملاحظات الخاصة */}
                <div className="bg-[#FFFBEB] p-6 rounded-[35px] border border-amber-100 shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-black text-sm text-amber-900 flex items-center gap-2 tracking-tight">
                      <Lock size={18} className="text-amber-500"/> ملاحظات خاصة
                    </h4>
                    <Badge className="bg-amber-200 text-amber-700 border-none rounded-lg text-[10px] font-bold">لا يراها المريض</Badge>
                  </div>
                  <Textarea 
                    placeholder="اكتب ملاحظاتك الخاصة هنا..." 
                    className="rounded-[25px] border-amber-100 shadow-inner min-h-[120px] bg-white font-bold p-5 text-right text-slate-800 focus:ring-2 focus:ring-amber-200"
                    value={privateNote}
                    onChange={(e) => setPrivateNote(e.target.value)}
                  />
                  <Button 
                    onClick={handleSavePrivateNote}
                    variant="outline"
                    className="w-fit rounded-xl border-amber-200 text-amber-700 hover:bg-amber-100 font-bold gap-2 px-6"
                    disabled={isSavingNote || !privateNote.trim()}
                  >
                    {isSavingNote ? <Loader2 className="animate-spin h-4 w-4" /> : <><Save size={16} /> حفظ الملاحظات</>}
                  </Button>
                  {noteSaved && <span className="text-xs text-green-600 font-bold mr-3 animate-pulse">تم الحفظ بنجاح</span>}
                </div>

                {/* Message Send Section */}
                <div className="bg-white p-6 rounded-[35px] border border-slate-200 shadow-md space-y-4">
                  <h4 className="font-black text-sm text-slate-800 flex items-center gap-2 italic">
                    <Send size={18} className="text-[#0A4D42]"/> إرسال توصية طبية
                  </h4>
                  <Textarea 
                    placeholder="اكتب التوجيهات الطبية أو الغذائية للمريض..." 
                    className="rounded-[25px] border-slate-100 shadow-inner min-h-[160px] bg-slate-50 font-bold p-5 text-right text-slate-800 focus:ring-2 focus:ring-[#0A4D42]/20"
                    value={recommendation}
                    onChange={(e) => setRecommendation(e.target.value)}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    className="w-full rounded-[25px] bg-[#0A4D42] hover:bg-[#083a32] shadow-xl font-black gap-3 h-14 text-lg transition-all active:scale-95 italic"
                    disabled={isSending || !recommendation.trim()}
                  >
                    {isSending ? <Loader2 className="animate-spin h-6 w-6" /> : <><Send size={22} /> إرسال التوصية</>}
                  </Button>
                  {isSent && (
                    <div className="flex items-center justify-center gap-2 text-green-600 font-bold animate-bounce mt-2">
                      <CheckCircle size={20} /> تم الإرسال والحفظ بنجاح
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

/* UI Helper Components */
function ContactBox({ icon, label, value }: any) {
  return (
    <div className="flex items-center gap-4 p-5 bg-white rounded-[25px] border border-slate-100 shadow-sm flex-1">
      <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 mb-0.5 uppercase tracking-tighter italic">{label}</p>
        <p className="text-xs font-black text-slate-800">{value}</p>
      </div>
    </div>
  )
}

function MetricBox({ icon, label, value, unit }: any) {
  return (
    <div className="bg-white border border-slate-50 p-5 rounded-[25px] flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-all">
      <div className="mb-3 p-3 bg-slate-50 rounded-full">{icon}</div>
      <p className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest italic">{label}</p>
      <p className="text-xl font-black text-slate-900 leading-none italic">{value || "--"}</p>
      {value && unit && <span className="text-[9px] text-slate-400 font-bold mt-2 uppercase italic">{unit}</span>}
    </div>
  )
}

function MedicalCard({ title, icon, children }: any) {
  return (
    <div className="bg-white p-6 rounded-[30px] border border-slate-100 space-y-5 shadow-sm h-full flex flex-col">
      <h4 className="font-black text-sm flex items-center gap-2 text-slate-800 uppercase tracking-wider italic">{icon} {title}</h4>
      <div className="flex flex-wrap gap-2 flex-1 items-start">{children}</div>
    </div>
  )
}