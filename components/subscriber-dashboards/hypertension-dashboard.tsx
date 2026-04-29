"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Heart, Activity, Droplets, Beaker, Utensils, 
  ShieldCheck, Ban, AlertTriangle, CheckCircle2, 
  Flame, Calendar, Apple 
} from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"

// مصفوفة الأطعمة السوبر لمرضى الضغط
const hypertensionSuperFoods = [
  { 
   name: "الثوم الطازج", 
    benefits: "يزيد من إنتاج أكسيد النيتريك في الجسم، مما يساعد العضلات الملساء على الاسترخاء وتوسيع الأوعية.", 
    img: "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=400&q=80" 
  },
  { 
    name: "التوت الأزرق", 
    benefits: "يحتوي على الأنثوسيانين الذي يحسن بطانة الأوعية الدموية ويقلل التصلب.", 
    img: "https://images.weserv.nl/?url=https://cdn.pixabay.com/photo/2016/04/13/07/18/blueberries-1326154_1280.jpg&w=400&h=400&fit=cover" 
  },
  { 
    name: "السبانخ", 
    benefits: "محملة بمضادات الأكسدة والبوتاسيوم والمغنيسيوم التي تقلل من إجهاد القلب والشرايين.", 
    img: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80" 
  },
  { 
    name: "السمك", 
    benefits: "أوميغا 3 تقلل الالتهابات وتخفض مستويات المركبات المسببة لضيق الأوعية.", 
    img: "https://images.weserv.nl/?url=https://cdn.pixabay.com/photo/2014/11/05/15/57/salmon-518032_1280.jpg&w=400&h=400&fit=cover" 
  },
  { 
   name: "الزبادي الطبيعي", 
    benefits: "مصدر رائع للكالسيوم والبروبيوتيك التي تساعد في الحفاظ على مستويات ضغط دم صحية.", 
img: "https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=400&q=80"
  },
];

export function HypertensionDashboard({ subscriber: initialData }: { subscriber: any }) {
  const [subscriber, setSubscriber] = useState(initialData)
  const [showMedicalForm, setShowMedicalForm] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const refreshData = useCallback(async () => {
    const email = localStorage.getItem("userEmail")
    if (!email) return
    try {
      const res = await fetch(`/api/subscriber/dashboard-hypertension?email=${email}&t=${Date.now()}`)
      const result = await res.json()
      if (result.success) setSubscriber(result.data)
    } catch (err) { console.error(err) }
  }, [])

  useEffect(() => { refreshData() }, [refreshData])

  const medical = subscriber?.medicalInfo || {}

  const handleSaveMedical = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    const formData = new FormData(e.currentTarget)
    const payload = Object.fromEntries(formData.entries())
    payload.email = localStorage.getItem("userEmail") || ""

    try {
      const res = await fetch("/api/subscriber/dashboard-hypertension", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      if ((await res.json()).success) {
        toast.success("تم تحديث القراءات بنجاح")
        refreshData()
        setShowMedicalForm(false)
      }
    } finally { setIsSaving(false) }
  }

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* 1. الترويسة */}
      <div className="rounded-2xl bg-white p-6 flex items-center justify-between border border-rose-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-rose-50 flex items-center justify-center border border-rose-100">
            <Heart className="h-7 w-7 text-rose-500" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-800">مرحباً، {subscriber.name}</h2>
            <p className="text-sm font-medium text-rose-500">نظام متابعة ضغط الدم والنبض</p>
          </div>
        </div>
        <Button onClick={() => setShowMedicalForm(!showMedicalForm)} variant="outline" className="border-rose-200 text-rose-600 font-bold hover:bg-rose-50">
          {showMedicalForm ? "إغلاق" : "تحديث القراءات"}
        </Button>
      </div>

      {/* 2. نموذج التحديث */}
      {showMedicalForm && (
        <Card className="border-rose-200 shadow-lg animate-in fade-in duration-300">
          <form onSubmit={handleSaveMedical} className="p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
             <div className="space-y-1"><Label className="font-bold text-slate-700">الكرياتينين</Label><Input name="creatinine" defaultValue={medical.creatinine} /></div>
             <div className="space-y-1"><Label className="font-bold text-slate-700">اليوريا</Label><Input name="urea" defaultValue={medical.urea} /></div>
             <div className="space-y-1"><Label className="font-bold text-slate-700">دهون الدم</Label><Input name="bloodLipids" defaultValue={medical.bloodLipids} /></div>
             <div className="space-y-1"><Label className="font-bold text-slate-700">سكر صائم</Label><Input name="fastingBloodSugar" defaultValue={medical.fastingBloodSugar} /></div>
             <div className="space-y-1"><Label className="font-bold text-slate-700">ضغط الدم</Label><Input name="bloodPressure" defaultValue={medical.currentBloodPressure} /></div>
             <div className="space-y-1"><Label className="font-bold text-slate-700">نبض القلب</Label><Input name="heartRate" defaultValue={medical.heartRate} /></div>
             <Button type="submit" disabled={isSaving} className="sm:col-span-3 bg-rose-600 text-white font-bold h-12 hover:bg-rose-700 transition-colors">
               {isSaving ? "جاري الحفظ..." : "حفظ التحديثات"}
             </Button>
          </form>
        </Card>
      )}

      {/* 3. كروت الإحصائيات */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5 flex items-center justify-between border-rose-100 bg-white shadow-sm">
          <div className="h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500"><Heart className="h-6 w-6" /></div>
          <div className="text-left">
            <p className="text-xs font-bold text-gray-400 uppercase">ضغط الدم</p>
            <p className="text-2xl font-black text-gray-800">{medical.currentBloodPressure}</p>
            <Badge className="bg-orange-50 text-orange-600 border-none font-bold text-[10px]">يحتاج متابعة</Badge>
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between border-rose-100 bg-white shadow-sm">
          <div className="h-12 w-12 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-500"><Activity className="h-6 w-6" /></div>
          <div className="text-left">
            <p className="text-xs font-bold text-gray-400 uppercase">نبض القلب</p>
            <p className="text-2xl font-black text-gray-800">{medical.heartRate}</p>
            <p className="text-[10px] text-pink-500 font-bold tracking-tight">نبضة / دقيقة</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between border-blue-100 bg-white shadow-sm">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500"><Droplets className="h-6 w-6" /></div>
          <div className="text-left">
            <p className="text-xs font-bold text-gray-400 uppercase">الماء</p>
            <p className="text-2xl font-black text-gray-800">2.5 لتر</p>
            <p className="text-[10px] text-blue-500 font-bold tracking-tight">الهدف: 3 لتر</p>
          </div>
        </Card>
      </div>

      {/* 4. التحاليل الطبية */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "الكرياتينين", value: medical.creatinine, icon: Beaker, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "اليوريا", value: medical.urea, icon: Activity, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "دهون الدم", value: medical.bloodLipids, icon: Droplets, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "سكر صائم", value: medical.fastingBloodSugar, icon: Beaker, color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map((item, idx) => (
          <Card key={idx} className="p-4 border-slate-100 bg-white group hover:shadow-sm transition-all">
            <div className={`h-10 w-10 rounded-xl ${item.bg} ${item.color} flex items-center justify-center mb-3`}><item.icon className="h-5 w-5" /></div>
            <p className="text-xs font-bold text-slate-500 mb-1">{item.label}</p>
            <p className="text-lg font-black text-slate-900">{item.value || "---"}</p>
          </Card>
        ))}
      </div>

      {/* 5. قسم النصائح الغذائية */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-emerald-200 shadow-sm overflow-hidden bg-white">
          <CardHeader className="bg-emerald-50/50 py-4 border-b border-emerald-100 text-emerald-800 font-black flex flex-row items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-emerald-600" /> أطعمة صديقة
          </CardHeader>
          <CardContent className="p-0 divide-y divide-emerald-50">
              {[
                { name: "الموز والبطاطا", reason: "غنية بالبوتاسيوم الذي يطرد الصوديوم الزائد ويخفف توتر الشرايين." },
                { name: "الثوم الطبيعي", reason: "يحتوي على الأليسين الذي يساعد في إرخاء الأوعية الدموية." },
                { name: "زيت الزيتون البكر", reason: "يقلل الالتهابات الوعائية ويحسن تدفق الدم." },
                { name: "الشمندر (البنجر)", reason: "غني بالنترات الطبيعية التي توسع الأوعية الدموية." }
              ].map((item, i) => (
                <div key={i} className="p-4 flex flex-col gap-1">
                  <div className="flex items-center gap-2 font-bold text-gray-800"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> {item.name}</div>
                  <p className="text-xs text-gray-500 mr-6"><span className="text-emerald-600 font-bold">السبب:</span> {item.reason}</p>
                </div>
              ))}
          </CardContent>
        </Card>

        <Card className="border-rose-200 shadow-sm overflow-hidden bg-white">
          <CardHeader className="bg-rose-50/50 py-4 border-b border-rose-100 text-rose-800 font-black flex flex-row items-center gap-2">
            <Ban className="h-6 w-6 text-rose-600" /> أطعمة ممنوعة
          </CardHeader>
          <CardContent className="p-0 divide-y divide-rose-50">
              {[
                { name: "المخللات والأجبان المملحة", reason: "الصوديوم العالي يسبب احتباس السوائل وزيادة حجم الدم." },
                { name: "اللحوم المصنعة", reason: "تحتوي على أملاح خفية ومواد حافظة تضر بمرونة الشرايين." },
                { name: "الوجبات السريعة", reason: "تجمع بين الدهون المشبعة والأملاح التي ترفع الضغط فوراً." },
                { name: "عرق السوس", reason: "يسبب انخفاض البوتاسيوم واحتباس السوائل، وهو خطر مباشر." }
              ].map((item, i) => (
                <div key={i} className="p-4 flex flex-col gap-1">
                  <div className="flex items-center gap-2 font-bold text-gray-800"><AlertTriangle className="h-4 w-4 text-rose-500" /> {item.name}</div>
                  <p className="text-xs text-gray-500 mr-6"><span className="text-rose-600 font-bold">السبب:</span> {item.reason}</p>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>

      {/* قسم الأطعمة السوبر المضاف (جديد) */}
      <Card className="border-rose-200 shadow-lg bg-white overflow-hidden">
        <CardHeader className="bg-rose-50/50 py-4 border-b border-rose-100 flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2 text-rose-800 font-bold">
            <Apple className="h-5 w-5 text-rose-600" /> أطعمة "سوبر" لخفض ضغط الدم
          </CardTitle>
          <Badge className="bg-rose-600 text-white font-bold">أفضل 5 خيارات</Badge>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {hypertensionSuperFoods.map((food, index) => (
              <Card key={index} className="overflow-hidden border-rose-50 rounded-xl hover:shadow-md transition-all group">
                <div className="relative aspect-square">
                  <img 
                    src={food.img} 
                    alt={food.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-2 right-2 bg-white/80 text-rose-800 backdrop-blur-sm font-bold text-[10px]">{index + 1}</Badge>
                </div>
                <CardContent className="p-3 text-center">
                  <h4 className="font-bold text-rose-900 mb-1 text-sm">{food.name}</h4>
                  <p className="text-[10px] text-gray-500 font-semibold leading-relaxed line-clamp-3">{food.benefits}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 6. قسم الوجبات المخصصة */}
      <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
        <CardHeader className="bg-slate-50/80 border-b border-slate-100 py-4 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-black text-slate-800 flex items-center gap-2">
            <Utensils className="h-5 w-5 text-rose-500" /> الخطة الغذائية المخصصة
          </CardTitle>
          <Badge className="bg-rose-500 text-white font-bold px-3">{subscriber.dailyCalories || 0} سعرة حرارية</Badge>
        </CardHeader>
        <CardContent className="p-0">
          {subscriber.meals && subscriber.meals.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {subscriber.meals.map((meal: any, idx: number) => (
                <div key={idx} className="p-5 hover:bg-slate-50/50 transition-colors">
                  <Badge className="mb-3 bg-rose-600 font-bold px-4 py-1">{meal.mealType || meal.name}</Badge>
                  <div className="grid gap-2">
                    {meal.items.map((item: any, j: number) => (
                      <div key={j} className="flex justify-between text-sm font-bold text-gray-700 bg-white p-3 rounded-xl border border-rose-50 shadow-sm">
                        <span className="flex items-center gap-2">
                           <div className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                           {item.name} <span className="text-gray-400 font-medium">({item.quantity})</span>
                        </span>
                        <span className="text-orange-600">{item.calories} سعرة</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400">
              <Calendar className="h-10 w-10 mx-auto mb-2 opacity-20" />
              <p>لا توجد وجبات مسجلة في الداتابيز حالياً.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}