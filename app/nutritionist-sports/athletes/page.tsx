"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Scale, Dumbbell, Send, Loader2, Zap, Target, Flame, Lock, Plus, Trash2, CheckCircle2 } from "lucide-react"

export default function AthletesPage() {
  const [athletes, setAthletes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedAthlete, setSelectedAthlete] = useState<any | null>(null)
  const [athleteMsg, setAthleteMsg] = useState("")
  const [privateNote, setPrivateNote] = useState("")
  const [newSupplement, setNewSupplement] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [isSending, setIsSending] = useState(false)

  // الحالة الخاصة بالتنبيه الجديد
  const [toast, setToast] = useState<{ show: boolean; msg: string; type: "success" | "amber" }>({ 
    show: false, 
    msg: "", 
    type: "success" 
  })

  useEffect(() => { loadAthletes() }, [])

  // دالة إظهار التنبيه
  const showNotification = (msg: string, type: "success" | "amber" = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: "", type: "success" }), 3000);
  }

  async function loadAthletes() {
    const email = localStorage.getItem("userEmail")
    if (!email) return;
    try {
      const res = await fetch(`/api/nutritionist-sports/athletes?email=${encodeURIComponent(email)}`)
      const data = await res.json()
      if (data.success) setAthletes(data.athletes)
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  const handleSendMessage = async () => {
    if (!selectedAthlete || !athleteMsg.trim()) return;
    setIsSending(true);
    try {
      const res = await fetch('/api/nutritionist-sports/athletes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: "sendMessage", subscriberId: selectedAthlete.subscriberId, nutritionistId: selectedAthlete.nutritionistId, message: athleteMsg })
      });
      if ((await res.json()).success) { 
        setAthleteMsg(""); 
        showNotification("تم إرسال الرسالة بنجاح ✅"); 
      }
    } catch (err) { console.error(err) } finally { setIsSending(false) }
  };

  const handleSaveNote = async () => {
    if (!selectedAthlete || !privateNote.trim()) return;
    setIsUpdating(true);
    try {
      const res = await fetch('/api/nutritionist-sports/athletes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: "saveNote", subscriberId: selectedAthlete.subscriberId, nutritionistId: selectedAthlete.nutritionistId, note: privateNote })
      });
      if ((await res.json()).success) { 
        setPrivateNote(""); 
        showNotification("تم حفظ الملاحظة بنجاح 📝", "amber"); 
      }
    } catch (err) { console.error(err) } finally { setIsUpdating(false) }
  };

  const handleSupplementAction = async (supplementName: string, action: "add" | "remove") => {
    if (!selectedAthlete || !supplementName.trim()) return;
    setIsUpdating(true);
    try {
      const res = await fetch('/api/nutritionist-sports/athletes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: action === "add" ? "addSupplement" : "removeSupplement", athleteId: selectedAthlete.id, supplement: supplementName })
      });
      const data = await res.json();
      if (data.success) {
        const updated = athletes.map(ath => ath.id === selectedAthlete.id ? { ...ath, supplements: data.supplements } : ath);
        setAthletes(updated);
        setSelectedAthlete({ ...selectedAthlete, supplements: data.supplements });
        setNewSupplement("");
        showNotification(action === "add" ? "تمت إضافة المكمل 💪" : "تم حذف المكمل");
      }
    } catch (err) { console.error(err) } finally { setIsUpdating(false) }
  };

  const filteredAthletes = athletes.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()))

  if (loading) return (
    <div className="flex h-screen items-center justify-center text-[#107a54] font-bold">
      <Loader2 className="h-8 w-8 animate-spin ml-2" /> جاري التحميل...
    </div>
  )

  return (
    <div className="space-y-6 p-4 lg:p-8 relative" dir="rtl">
      
      {/* --- تصميم التنبيه (Toast) العلوي --- */}
      {toast.show && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-5 duration-300">
          <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl border ${toast.type === 'success' ? 'bg-[#107a54] border-emerald-400' : 'bg-amber-600 border-amber-400'} text-white`}>
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-bold text-sm whitespace-nowrap">{toast.msg}</span>
          </div>
        </div>
      )}

      <div className="text-right">
        <h1 className="text-2xl font-bold text-gray-900">الرياضيين المتابعين</h1>
        <p className="text-sm text-muted-foreground font-medium">إدارة البيانات الصحية لعملائك</p>
      </div>

      <div className="relative max-w-sm mr-auto">
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="بحث باسم الرياضي..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-10 text-right" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAthletes.map((athlete) => (
          <Card key={athlete.id} className="cursor-pointer hover:shadow-lg border-r-4 border-r-[#107a54]" onClick={() => setSelectedAthlete(athlete)}>
            <CardContent className="p-5 text-right">
              <div className="flex items-center gap-4 flex-row-reverse">
                <Avatar className="h-12 w-12"><AvatarFallback className="bg-emerald-50 text-emerald-700 font-bold">{athlete.initials}</AvatarFallback></Avatar>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{athlete.name}</h3>
                  <p className="text-xs text-muted-foreground">{athlete.sportType}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-2 rounded-lg text-center"><p className="text-[10px] text-muted-foreground">الوزن الحالي</p><p className="text-sm font-bold">{athlete.currentWeight} كجم</p></div>
                <div className="bg-gray-50 p-2 rounded-lg text-center"><p className="text-[10px] text-muted-foreground">نسبة الدهون</p><p className="text-sm font-bold">{athlete.fatPercentage}%</p></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedAthlete} onOpenChange={() => setSelectedAthlete(null)}>
        <DialogContent className="max-w-md p-0 overflow-hidden max-h-[95vh] overflow-y-auto border-none shadow-2xl" dir="rtl">
          <DialogHeader className="sr-only"><DialogTitle>{selectedAthlete?.name}</DialogTitle></DialogHeader>
          <div className="bg-[#107a54] p-6 text-white text-right relative">
              <button onClick={() => setSelectedAthlete(null)} className="absolute left-4 top-4 text-white/70 hover:text-white text-xl font-bold">✕</button>
            <div className="flex items-center gap-4 flex-row-reverse">
              <Avatar className="h-16 w-16 border-2 border-white/20 shadow-lg"><AvatarFallback className="bg-white/10 text-white font-bold text-lg">{selectedAthlete?.initials}</AvatarFallback></Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{selectedAthlete?.name}</h2>
                <Badge className="bg-white/20 border-none text-white text-[10px] px-3 py-0.5">{selectedAthlete?.sportType}</Badge>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <Tabs defaultValue="body" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6 h-10">
                <TabsTrigger value="info">المعلومات</TabsTrigger>
                <TabsTrigger value="body">الجسم</TabsTrigger>
                <TabsTrigger value="nutrition">التغذية</TabsTrigger>
              </TabsList>

              <TabsContent value="body" className="space-y-6 text-right animate-in fade-in duration-300">
                <div className="grid grid-cols-2 gap-4">
                  <BodyStat icon={<Scale className="text-emerald-600 h-4 w-4" />} label="الوزن الحالي" value={`${selectedAthlete?.currentWeight} كجم`} />
                  <BodyStat icon={<Target className="text-emerald-600 h-4 w-4" />} label="الهدف" value={`${selectedAthlete?.targetWeight} كجم`} />
                  <BodyStat icon={<Flame className="text-orange-500 h-4 w-4" />} label="الدهون" value={`${selectedAthlete?.fatPercentage}%`} />
                  <BodyStat icon={<Dumbbell className="text-blue-500 h-4 w-4" />} label="العضلات" value={`${selectedAthlete?.muscleMass} كجم`} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold"><span className="text-[#107a54]">{selectedAthlete?.progress}%</span><span className="text-gray-500">التقدم</span></div>
                  <Progress value={selectedAthlete?.progress} className="h-2" />
                </div>
                <div className="mt-6 p-4 bg-amber-50/50 rounded-xl border border-amber-100 shadow-sm">
                  <div className="flex items-center justify-end gap-1.5 mb-2 text-amber-700 font-bold text-xs"><span>ملاحظات خاصة</span><Lock className="h-3 w-3" /></div>
                  <Textarea placeholder="اكتب ملاحظة..." value={privateNote} onChange={(e) => setPrivateNote(e.target.value)} className="text-sm min-h-[80px] bg-white border-amber-200 focus:ring-amber-500 focus:border-amber-500" />
                  <Button size="sm" className="mt-2 bg-amber-600 hover:bg-amber-700 h-7 text-[10px] w-full" onClick={handleSaveNote} disabled={isUpdating}>{isUpdating ? "جاري الحفظ..." : "حفظ الملاحظة"}</Button>
                </div>
              </TabsContent>

              <TabsContent value="nutrition" className="space-y-4 animate-in fade-in duration-300">
                <div className="rounded-xl border border-emerald-100 p-5 bg-emerald-50/30 text-right shadow-sm">
                  <div className="flex items-center gap-2 mb-4 flex-row-reverse"><p className="text-sm font-bold text-gray-700">إضافة مكمل</p><Zap className="h-4 w-4 text-amber-500" /></div>
                  <div className="flex gap-2 mb-6">
                    <Button onClick={() => handleSupplementAction(newSupplement, "add")} disabled={isUpdating} className="bg-[#107a54] hover:bg-[#0d6344] shrink-0">
                      {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    </Button>
                    <Input placeholder="اسم المكمل..." value={newSupplement} onChange={(e) => setNewSupplement(e.target.value)} className="text-right h-9" />
                  </div>
                  <div className="space-y-2">
                    {selectedAthlete?.supplements?.map((s: string, i: number) => (
                      <div key={i} className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-emerald-50 flex-row-reverse shadow-sm">
                        <span className="text-sm font-medium">{s}</span>
                        <Button variant="ghost" size="icon" onClick={() => handleSupplementAction(s, "remove")} className="text-red-400 hover:text-red-600 h-8 w-8"><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="info" className="text-right p-1 space-y-6 animate-in fade-in duration-300">
                <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center text-sm border shadow-sm">
                  <span className="font-bold text-gray-900">{selectedAthlete?.sportType}</span>
                  <span className="text-muted-foreground font-medium">نوع الرياضة</span>
                </div>
                <div className="rounded-xl border p-5 bg-gray-50/50 text-right mt-4 shadow-sm border-gray-100">
                    <p className="mb-2 text-xs font-bold text-gray-600">إرسال رسالة سريعة</p>
                    <Textarea placeholder="...اكتب رسالتك هنا" className="bg-white text-sm focus:ring-[#107a54]" value={athleteMsg} onChange={(e) => setAthleteMsg(e.target.value)} />
                    <Button size="sm" className="mt-3 bg-[#107a54] hover:bg-[#0d6344] w-full flex items-center justify-center gap-2 transition-all" onClick={handleSendMessage} disabled={isSending}>
                      {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4" /> إرسال الرسالة</>}
                    </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function BodyStat({ icon, label, value }: any) {
  return (
    <div className="bg-gray-50 p-3.5 rounded-xl flex items-center gap-3 flex-row-reverse border border-gray-100 shadow-sm">
      <div className="bg-white p-2 rounded-lg shadow-sm text-emerald-600">{icon}</div>
      <div className="text-right"><p className="text-[10px] text-muted-foreground mb-0.5 font-medium">{label}</p><p className="text-sm font-extrabold text-gray-900">{value}</p></div>
    </div>
  )
}