"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea" 
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { Search, Mail, Phone, User, Calendar, Stethoscope, AlertCircle, Send } from "lucide-react"

export default function SubscribersPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState("info")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        // ✅ التعديل هنا: جلب الإيميل من التخزين المحلي بدلاً من كتابته يدوياً
        const userEmail = localStorage.getItem("userEmail");
        
        if (!userEmail) {
          console.error("لم يتم العثور على إيميل الأخصائي في المتصفح");
          setLoading(false);
          return;
        }

        // جلب البيانات بناءً على إيميل الأخصائي الفعلي
        const res = await fetch(`/api/nutritionist/subscribers?email=${userEmail}&t=${Date.now()}`)
        const result = await res.json()
        setData(Array.isArray(result) ? result : [])
      } catch (err) { 
        console.error("Error fetching data:", err) 
      } finally { 
        setLoading(false) 
      }
    }
    fetchSubscribers()
  }, [])

  const handleSendMessage = async (subscriberId: string, nutritionistId: string) => {
    if (!message.trim()) {
      alert("الرجاء كتابة رسالة أولاً");
      return;
    }

    try {
      const res = await fetch("/api/nutritionist/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriberId: subscriberId, 
          nutritionistId: nutritionistId, 
          message: message 
        }),
      });

      if (res.ok) {
        alert("تم إرسال الرسالة وتخزينها بنجاح");
        setMessage(""); 
      } else {
        const errorData = await res.json();
        alert(`خطأ: ${errorData.error || "فشل في الإرسال"}`);
      }
    } catch (err) {
      console.error("Error sending message:", err);
      alert("فشل الاتصال بالسيرفر");
    }
  }

  const filtered = data.filter(sub => {
    const name = sub.userId?.fullName || sub.userId?.name || ""
    return name.toLowerCase().includes(search.toLowerCase())
  })

  if (loading) return <div className="p-10 text-center font-bold font-sans text-[#004d3d]">جاري تحميل بيانات المشتركين...</div>

  return (
    <div className="p-6 space-y-6 bg-[#f9fafb] min-h-screen" dir="rtl">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 font-sans text-right">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">المشتركين</h1>
          <p className="text-sm text-slate-500">إدارة ومتابعة المشتركين والتقدم الفعلي</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="بحث بالاسم..." 
            className="pr-10 border-slate-200 focus:ring-emerald-500 text-right" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Subscribers Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 font-sans">
        {filtered.map((sub) => {
          const displayName = sub.userId?.fullName || sub.userId?.name || "بدون اسم"
          const startWeight = sub.registrationWeight || sub.weight || 0; 
          const currentWeight = sub.currentWeight || startWeight; 
          const height = sub.height || 0;
          // حساب الوزن المثالي
          const idealWeight = height > 0 ? parseFloat((50 + 0.9 * (height - 152.4)).toFixed(1)) : 0;
          const remainingToGoal = (currentWeight - idealWeight).toFixed(1);

          const totalToLose = startWeight - idealWeight;
          const lostSoFar = startWeight - currentWeight;
          let calculatedPercentage = 0;
          if (totalToLose > 0) {
              calculatedPercentage = Math.max(0, Math.min(100, Math.round((lostSoFar / totalToLose) * 100)));
          }

          const userPhone = sub.userId?.phone || sub.userId?.phoneNumber || sub.userId?.mobile || "غير متوفر";
          const joinDate = sub.userId?.createdAt 
            ? new Date(sub.userId.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: '2-digit', day: '2-digit' })
            : "غير متوفر";

          return (
            <Dialog key={sub._id} onOpenChange={(open) => { if(!open) setMessage("") }}>
              <DialogTrigger asChild>
                <Card className="relative overflow-hidden border-none shadow-sm hover:shadow-md transition-all cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start gap-4 text-right">
                      <div className="flex gap-4 flex-1">
                        <Avatar className="h-14 w-14 rounded-lg bg-emerald-50 text-emerald-700 font-bold">
                          <AvatarFallback>{displayName.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <h3 className="font-bold text-lg text-slate-800 group-hover:text-emerald-700 transition-colors">{displayName}</h3>
                          <div className="flex gap-2 mt-2">
                             <Badge className="bg-emerald-50 text-emerald-700 border-none">{sub.package || "بريميوم"}</Badge>
                             <span className="text-xs text-slate-500 font-medium self-center">
                                {currentWeight} كجم ← <span className="text-emerald-700 font-bold">{idealWeight} كجم</span>
                             </span>
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-700 border-none">نشط</Badge>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none rounded-2xl shadow-2xl font-sans" dir="rtl">
                <div className="p-6 bg-[#004d3d] text-white">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 rounded-full border-2 border-white/20">
                      <AvatarFallback className="bg-white text-[#004d3d] text-xl font-bold">
                        {displayName.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <DialogTitle className="text-xl font-bold text-white">{displayName}</DialogTitle>
                      <p className="text-emerald-100 text-sm">الهدف المثالي: {idealWeight} كجم</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button onClick={() => setActiveTab("info")} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'info' ? 'bg-white shadow text-[#004d3d]' : 'text-slate-500'}`}>المعلومات</button>
                    <button onClick={() => setActiveTab("health")} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'health' ? 'bg-white shadow text-[#004d3d]' : 'text-slate-500'}`}>الصحة</button>
                    <button onClick={() => setActiveTab("progress")} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'progress' ? 'bg-white shadow text-[#004d3d]' : 'text-slate-500'}`}>التقدم</button>
                  </div>

                  <div className="min-h-[280px]">
                    {activeTab === "info" && (
                      <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3">
                            <Mail className="h-4 w-4 text-slate-400" />
                            <div className="text-right">
                              <p className="text-[10px] text-slate-400">البريد الإلكتروني</p>
                              <p className="text-sm font-bold text-slate-700 truncate max-w-[150px]">{sub.userId?.email || "N/A"}</p>
                            </div>
                          </div>
                          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3">
                            <Phone className="h-4 w-4 text-slate-400" />
                            <div className="text-right">
                              <p className="text-[10px] text-slate-400">رقم الهاتف</p>
                              <p className="text-sm font-bold text-emerald-700" dir="ltr">{userPhone}</p>
                            </div>
                          </div>
                          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3">
                            <User className="h-4 w-4 text-slate-400" />
                            <div className="text-right">
                              <p className="text-[10px] text-slate-400">العمر</p>
                              <p className="text-sm font-bold text-slate-700">{sub.age || "—"} سنة</p>
                            </div>
                          </div>
                          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <div className="text-right">
                              <p className="text-[10px] text-slate-400">تاريخ الانضمام</p>
                              <p className="text-sm font-bold text-slate-700">{joinDate}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t">
                          <p className="text-sm font-bold text-slate-700">ارسال رسالة</p>
                          <div className="relative">
                            <Textarea 
                              placeholder="...اكتب رسالتك هنا" 
                              className="min-h-[100px] bg-slate-50 border-slate-200 focus:border-emerald-500 rounded-xl resize-none pr-4 pt-3 text-right"
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                            />
                            <Button 
                              onClick={() => handleSendMessage(sub._id, sub.nutritionistId)}
                              className="absolute bottom-3 left-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg px-4 gap-2 h-9"
                            >
                              <span className="text-xs font-bold">ارسال</span>
                              <Send className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "health" && (
                      <div className="space-y-4 animate-in fade-in duration-300 text-right">
                        <div className="grid grid-cols-3 gap-3">
                           <div className="p-3 bg-emerald-50 rounded-xl text-center border border-emerald-100">
                              <p className="text-[10px] text-slate-500">الطول</p>
                              <p className="font-bold text-emerald-700">{sub.height || "—"} سم</p>
                           </div>
                           <div className="p-3 bg-blue-50 rounded-xl text-center border border-blue-100">
                              <p className="text-[10px] text-slate-500">الوزن الحالي</p>
                              <p className="font-bold text-blue-700">{currentWeight} كجم</p>
                           </div>
                           <div className="p-3 bg-orange-50 rounded-xl text-center border border-orange-100 shadow-sm">
                              <p className="text-[10px] text-orange-600 font-bold">الهدف</p>
                              <p className="font-bold text-orange-700">{idealWeight} كجم</p>
                           </div>
                        </div>
                        <div className="space-y-3">
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-2 mb-1 text-slate-700 font-bold text-xs">
                              <Stethoscope className="h-3.5 w-3.5 text-blue-500" /> الحالات الصحية
                            </div>
                            <p className="text-xs text-slate-600 font-medium leading-relaxed">{sub.diseases || "لا يوجد"}</p>
                          </div>
                          <div className="p-3 bg-red-50/50 rounded-xl border border-red-100">
                            <div className="flex items-center gap-2 mb-1 text-red-700 font-bold text-xs">
                              <AlertCircle className="h-3.5 w-3.5" /> الحساسية
                            </div>
                            <p className="text-xs text-slate-600 font-medium leading-relaxed">{sub.allergies || "لا يوجد"}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "progress" && (
                      <div className="space-y-6 animate-in fade-in duration-300 text-right">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm font-bold">
                            <span className="text-slate-700">نسبة الإنجاز الفعلية</span>
                            <span className="text-emerald-600">{calculatedPercentage}%</span>
                          </div>
                          <Progress value={calculatedPercentage} className="h-3 bg-slate-100" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                           <div className="p-4 border border-slate-100 rounded-xl text-center bg-slate-50">
                              <p className="text-xs text-slate-400 mb-1">آخر وزن مسجل</p>
                              <p className="text-xl font-bold text-slate-800">{currentWeight} كجم</p>
                           </div>
                           <div className="p-4 border border-slate-100 rounded-xl text-center bg-orange-50/30">
                              <p className="text-xs text-slate-400 mb-1">المتبقي للمثالي</p>
                              <p className="text-xl font-bold text-orange-600">{remainingToGoal} كجم</p>
                           </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )
        })}
      </div>
    </div>
  )
}