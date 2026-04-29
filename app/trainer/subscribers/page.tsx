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
import { Search, User, Phone, Mail, Calendar, Dumbbell, Target, TrendingUp, Scale, Loader2, Activity, Lock, Send, CheckCircle2 } from "lucide-react"
import { toast, Toaster } from "sonner"

export default function TrainerSubscribersPage() {
  const [search, setSearch] = useState("")
  const [subscribers, setSubscribers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubscriber, setSelectedSubscriber] = useState<any | null>(null)
  
  const [coachMsg, setCoachMsg] = useState("")
  const [privateNote, setPrivateNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const fetchSubscribers = async () => {
    const email = localStorage.getItem("userEmail")
    if (!email) return
    try {
      const res = await fetch(`/api/trainer/subscribers?email=${email}`)
      const data = await res.json()
      if (data.success) setSubscribers(data.subscribers)
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  const handleAction = async (actionType: "sendMessage" | "saveNote") => {
    if (!selectedSubscriber) return;
    const content = actionType === "sendMessage" ? coachMsg : privateNote;
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/trainer/subscribers", {
        method: "POST",
        body: JSON.stringify({
          action: actionType,
          subscriberId: selectedSubscriber.id,
          nutritionistId: selectedSubscriber.trainerId,
          message: actionType === "sendMessage" ? content : undefined,
          note: actionType === "saveNote" ? content : undefined,
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(actionType === "sendMessage" ? "تم إرسال الرسالة بنجاح" : "تم حفظ الملاحظة السرية", {
          description: `المشترك: ${selectedSubscriber.name}`,
          icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
          style: { borderRadius: '18px', padding: '16px', direction: 'rtl' },
        });
        if (actionType === "sendMessage") setCoachMsg(""); else setPrivateNote("");
      }
    } catch (err) { 
      toast.error("حدث خطأ أثناء العملية");
    } finally { setIsSubmitting(false); }
  };

  const getSmartProgress = (weight: number, target: number) => {
    if (!weight || !target || weight === 0 || target === 0) return 0;
    return Math.round((Math.min(weight, target) / Math.max(weight, target)) * 100);
  };

  const filtered = subscribers.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>

  return (
    <div className="space-y-6 p-4 lg:p-8" dir="rtl">
      <Toaster position="top-center" richColors />
      
      <div className="text-right">
        {/* التعديل: شلت عدد المشتركين من هون */}
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">المشتركين</h2>
        <p className="text-sm text-slate-400 font-bold italic">إدارة بيانات وتقدم الرياضيين</p>
      </div>

      <div className="relative">
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="بحث عن رياضي..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-10 text-right rounded-2xl border-slate-200" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((sub) => {
          const prog = getSmartProgress(sub.weight, sub.targetWeight);
          return (
            <Card key={sub.id} className="cursor-pointer hover:shadow-xl border-none shadow-sm rounded-[24px] bg-white transition-all group" onClick={() => setSelectedSubscriber(sub)}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <Avatar className="h-14 w-14 ring-2 ring-primary/10"><AvatarFallback className="bg-primary/5 text-primary font-bold">{sub.name[0]}</AvatarFallback></Avatar>
                  <div className="flex-1 text-right">
                    <h3 className="font-black text-slate-800 group-hover:text-primary transition-colors">{sub.name}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{sub.goal}</p>
                    <div className="flex items-center gap-2 justify-start mt-2 flex-row-reverse">
                      <Badge className="bg-slate-100 text-slate-600 text-[10px] rounded-full">{sub.plan}</Badge>
                      <span className="text-[10px] font-bold text-slate-400">{sub.weight}kg</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-right">
                  <div className="flex justify-between mb-1 text-[9px] font-bold text-slate-400"><span>التقدم للهدف</span><span>{prog}%</span></div>
                  <Progress value={prog} className="h-1.5 bg-slate-100" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Dialog open={!!selectedSubscriber} onOpenChange={() => setSelectedSubscriber(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-[32px] p-6 text-right" dir="rtl">
          {selectedSubscriber && (
            <>
              <DialogHeader className="flex flex-row items-center gap-4 border-b pb-4">
                <Avatar className="h-16 w-16 shadow-lg"><AvatarFallback className="bg-primary text-white text-xl font-black">{selectedSubscriber.name[0]}</AvatarFallback></Avatar>
                <div>
                  <DialogTitle className="text-2xl font-black text-slate-800">{selectedSubscriber.name}</DialogTitle>
                  <Badge className="bg-primary/10 text-primary border-none mt-1">{selectedSubscriber.plan}</Badge>
                </div>
              </DialogHeader>

              <Tabs defaultValue="progress" className="mt-6">
                <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-1 rounded-2xl h-12">
                  <TabsTrigger value="info" className="rounded-xl font-bold">المعلومات</TabsTrigger>
                  <TabsTrigger value="fitness" className="rounded-xl font-bold">اللياقة</TabsTrigger>
                  <TabsTrigger value="progress" className="rounded-xl font-bold">التقدم</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="pt-4 grid gap-3 sm:grid-cols-2 text-right">
                  <InfoBox icon={<Mail className="w-4 h-4" />} label="الإيميل" value={selectedSubscriber.email} />
                  <InfoBox icon={<Phone className="w-4 h-4" />} label="الهاتف" value={selectedSubscriber.phone} />
                  <InfoBox icon={<User className="w-4 h-4" />} label="العمر" value={`${selectedSubscriber.age} سنة`} />
                  <InfoBox icon={<Calendar className="w-4 h-4" />} label="تاريخ الاشتراك" value={new Date(selectedSubscriber.joinDate).toLocaleDateString('ar-JO')} />
                </TabsContent>

                <TabsContent value="fitness" className="pt-4 space-y-6">
                  <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
                    <FitnessCard icon={<Scale />} label="الوزن" value={`${selectedSubscriber.weight}kg`} />
                    <FitnessCard icon={<Target />} label="الهدف" value={`${selectedSubscriber.targetWeight}kg`} />
                    <FitnessCard icon={<Activity />} label="الدهون" value={`${selectedSubscriber.bodyFat}%`} />
                    <FitnessCard icon={<Dumbbell />} label="العضل" value={`${selectedSubscriber.muscleMass}kg`} />
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <h4 className="text-xs font-black text-slate-500 mb-3 flex items-center gap-2"><Send className="w-3 h-3"/> إرسال رسالة توجيهية</h4>
                    <Textarea 
                      placeholder="اكتب رسالتك للمشترك..." 
                      className="bg-white border-slate-200 rounded-xl"
                      value={coachMsg}
                      onChange={(e) => setCoachMsg(e.target.value)}
                    />
                    <Button 
                      onClick={() => handleAction("sendMessage")}
                      disabled={isSubmitting || !coachMsg.trim()}
                      className="w-full mt-3 bg-primary rounded-xl gap-2 font-bold"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin w-4 h-4"/> : "إرسال الآن"}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="progress" className="pt-4 space-y-6">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-right">
                    <div className="flex justify-between items-center mb-4 text-slate-400">
                       <p className="text-xs font-black uppercase tracking-widest">نسبة القرب من الهدف</p>
                       <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="flex justify-between items-end mb-2">
                       <div>
                          <span className="text-4xl font-black text-primary block">{selectedSubscriber.weight}kg</span>
                          <span className="text-[10px] font-bold text-slate-400">الهدف: {selectedSubscriber.targetWeight}kg</span>
                       </div>
                       <span className="text-xl font-black text-slate-700">{getSmartProgress(selectedSubscriber.weight, selectedSubscriber.targetWeight)}%</span>
                    </div>
                    <Progress value={getSmartProgress(selectedSubscriber.weight, selectedSubscriber.targetWeight)} className="h-3 shadow-inner" />
                  </div>

                  <div className="bg-amber-50/50 p-5 rounded-[24px] border border-amber-100">
                    <h4 className="text-xs font-black text-amber-700 mb-3 flex items-center gap-2"><Lock className="w-3 h-3"/> ملاحظاتك الخاصة (سرية)</h4>
                    <Textarea 
                      placeholder="سجل ملاحظاتك هنا..." 
                      className="bg-white border-amber-200 rounded-xl min-h-[100px]"
                      value={privateNote}
                      onChange={(e) => setPrivateNote(e.target.value)}
                    />
                    <Button 
                      onClick={() => handleAction("saveNote")}
                      disabled={isSubmitting || !privateNote.trim()}
                      className="w-full mt-3 bg-amber-600 hover:bg-amber-700 rounded-xl font-bold"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin w-4 h-4"/> : "حفظ الملاحظة"}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function InfoBox({ icon, label, value }: any) { return ( <div className="flex items-center gap-3 rounded-2xl border p-3 bg-white shadow-sm"><div className="text-primary/60">{icon}</div><div className="text-right"><p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">{label}</p><p className="text-sm font-bold text-slate-700 truncate">{value || "—"}</p></div></div> ) }
function FitnessCard({ icon, label, value }: any) { return ( <div className="rounded-2xl border p-3 text-center bg-white shadow-sm"><div className="mx-auto text-primary mb-2 flex justify-center opacity-70">{icon}</div><p className="text-[10px] font-black text-slate-400 uppercase mb-1">{label}</p><p className="text-lg font-black text-slate-800 tracking-tight">{value}</p></div> ) }