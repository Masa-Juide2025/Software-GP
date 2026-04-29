"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Activity, Droplet, Target, Beaker, Utensils,
  ShieldCheck, Ban, AlertTriangle, CheckCircle2,
  Calendar, Apple, Heart, Search
} from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
const diabetesSuperFoods = [
  {
    name: "الأرز البني",
    benefits: "من الحبوب الكاملة التي تطلق السكر ببطء في الدم، مما يحافظ على استقرار مستويات الطاقة.",
    img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=500&auto=format&fit=crop"
  },
  {
   name: "الشوكولاتة الداكنة",
    benefits: "تحسن حساسية الأنسولين (يفضل النوع الذي يحتوي على 70% كاكاو فأكثر).",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Chocolate.jpg/500px-Chocolate.jpg"
  },
  {
    name: "البروكلي",
    benefits: "يحتوي على السلفورافان الذي يحمي الأوعية الدموية من مضاعفات السكري.",
    img: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?q=80&w=500&auto=format&fit=crop"
  },
  {
    name: "الخضار الورقية",
    benefits: "خيار ممتاز منخفض السعرات، تساعد في الشعور بالشبع وتحتوي على فيتامينات ضرورية للأعصاب.",
    img: "https://images.unsplash.com/photo-1557844352-761f2565b576?q=80&w=500&auto=format&fit=crop"
  },
  {
    name: "الفراولة",
    benefits: "فاكهة ذات مؤشر جلايسيمي منخفض، غنية بمضادات الأكسدة وفيتامين C.",
    img: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=500&auto=format&fit=crop"
  },
];
export function DiabetesDashboard({ subscriber: initialData }: { subscriber: any }) {
  const [subscriber, setSubscriber] = useState(initialData)
  const [showMedicalForm, setShowMedicalForm] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const refreshData = useCallback(async () => {
    const email = localStorage.getItem("userEmail")
    if (!email) return
    try {
      const res = await fetch(`/api/subscriber/dashboard-diabetes?email=${email}&t=${Date.now()}`)
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
    const payload = {
      email: localStorage.getItem("userEmail") || "",
      fastingBloodSugar: formData.get("fastingBloodSugar"),
      randomBloodSugar: formData.get("randomBloodSugar"),
      hba1c: formData.get("hba1c"),
      creatinine: formData.get("creatinine"),
      urea: formData.get("urea"),
      bloodPressure: formData.get("bloodPressure"),
      ldl: formData.get("ldl"),
    }
    try {
      const res = await fetch("/api/subscriber/dashboard-diabetes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      if ((await res.json()).success) {
        toast.success("تم تحديث البيانات بنجاح")
        refreshData()
        setShowMedicalForm(false)
      }
    } finally { setIsSaving(false) }
  }
  if (!subscriber) return <div className="p-20 text-center font-bold text-emerald-600">جاري التحميل...</div>
  return (
    <div className="space-y-6 text-right font-sans" dir="rtl">
      {/* 1. الترويسة */}
      <div className="rounded-2xl bg-white p-6 flex items-center justify-between border border-emerald-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
            <Activity className="h-7 w-7 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-800">مرحباً، {subscriber.name}</h2>
            <p className="text-sm font-bold text-emerald-600">نظام المتابعة الذكي للسكري</p>
          </div>
        </div>
        <Button onClick={() => setShowMedicalForm(!showMedicalForm)} variant="outline" className="border-emerald-200 text-emerald-600 font-bold hover:bg-emerald-50">
          {showMedicalForm ? "إغلاق" : "تحديث الفحوصات"}
        </Button>
      </div>
      {/* 2. النموذج */}
      {showMedicalForm && (
        <Card className="border-emerald-200 shadow-lg animate-in fade-in duration-300">
          <form onSubmit={handleSaveMedical} className="p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-1"><Label className="font-bold">سكر صائم</Label><Input name="fastingBloodSugar" defaultValue={medical.fastingBloodSugar} /></div>
              <div className="space-y-1"><Label className="font-bold">سكر عشوائي</Label><Input name="randomBloodSugar" defaultValue={medical.randomBloodSugar} /></div>
              <div className="space-y-1"><Label className="font-bold">HbA1c (تراكمي)</Label><Input name="hba1c" defaultValue={medical.hba1c} /></div>
              <div className="space-y-1"><Label className="font-bold">الضغط</Label><Input name="bloodPressure" defaultValue={medical.bloodPressure} /></div>
              <div className="space-y-1"><Label className="font-bold">الكرياتينين</Label><Input name="creatinine" defaultValue={medical.creatinine} /></div>
              <div className="space-y-1"><Label className="font-bold">اليوريا</Label><Input name="urea" defaultValue={medical.urea} /></div>
              <div className="space-y-1"><Label className="font-bold">LDL</Label><Input name="ldl" defaultValue={medical.ldl} /></div>
              <Button type="submit" disabled={isSaving} className="sm:col-span-4 bg-emerald-600 text-white font-bold h-12">
                {isSaving ? "جاري الحفظ..." : "تحديث الملف الطبي"}
              </Button>
          </form>
        </Card>
      )}
      {/* 3. كروت الإحصائيات */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="سكر صائم" value={medical.fastingBloodSugar} unit="mg/dL" icon={<Droplet />} color="emerald" />
        <StatsCard title="التراكمي" value={medical.hba1c} unit="%" icon={<Target />} color="blue" />
        <StatsCard title="سكر عشوائي" value={medical.randomBloodSugar} unit="mg/dL" icon={<Search />} color="indigo" />
        <StatsCard title="الضغط" value={medical.bloodPressure} unit="mmHg" icon={<Heart />} color="rose" />
      </div>
      {/* 4. التحاليل */}
      <div className="grid gap-4 sm:grid-cols-3 font-bold">
        {[
          { label: "الكرياتينين", value: medical.creatinine, icon: Beaker, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "اليوريا", value: medical.urea, icon: Activity, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "دهون LDL", value: medical.ldl, icon: Droplet, color: "text-rose-600", bg: "bg-rose-50" },
        ].map((item, idx) => (
          <Card key={idx} className="p-4 border-slate-100 flex items-center gap-4 bg-white">
            <div className={`h-10 w-10 rounded-xl ${item.bg} ${item.color} flex items-center justify-center`}><item.icon className="h-5 w-5" /></div>
            <div>
              <p className="text-xs text-slate-500 mb-1">{item.label}</p>
              <p className="text-lg text-slate-900">{item.value || "---"}</p>
            </div>
          </Card>
        ))}
      </div>
      {/* 5. قسم النصائح المتحدث */}
      <div className="grid gap-6 lg:grid-cols-2 font-bold">
        <Card className="border-emerald-200 bg-white shadow-sm overflow-hidden">
          <CardHeader className="bg-emerald-50/50 py-4 border-b border-emerald-100 text-emerald-800 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" /> نصائح ذهبية للسكري
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <TipItem icon={<CheckCircle2 className="text-emerald-500" />} title="قاعدة المشي" desc="المشي لمدة 15 دقيقة بعد كل وجبة يحرق السكر الزائد فوراً." />
            <TipItem icon={<CheckCircle2 className="text-emerald-500" />} title="شرب الماء" desc="يساعد الكلى على التخلص من السكر الزائد عن طريق البول." />
            <TipItem icon={<CheckCircle2 className="text-emerald-500" />} title="النوم المنتظم" desc="قلة النوم تزيد من مقاومة الأنسولين في اليوم التالي." />
          </CardContent>
        </Card>
        <Card className="border-rose-200 bg-white shadow-sm overflow-hidden">
          <CardHeader className="bg-rose-50/50 py-4 border-b border-rose-100 text-rose-800 flex items-center gap-2">
            <Ban className="h-5 w-5" /> الممنوعات والمحاذير
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <TipItem icon={<AlertTriangle className="text-rose-500" />} title="السكريات المخفية" desc="احذر من الصوصات والكاتشب الجاهز، فهي مليئة بالسكر." />
            <TipItem icon={<AlertTriangle className="text-rose-500" />} title="المشروبات الغازية" desc="عدو السكري الأول، حتى 'الدايت' منها قد يثير الرغبة في السكر." />
            <TipItem icon={<AlertTriangle className="text-rose-500" />} title="الفواكه المجففة" desc="مركزة جداً بالسكر، يفضل استبدالها بالفواكه الطازجة كالتفاح." />
          </CardContent>
        </Card>
      </div>
      {/* 6. الأطعمة السوبر */}
      <Card className="border-emerald-200 shadow-lg bg-white overflow-hidden font-bold">
        <CardHeader className="bg-emerald-50/50 py-4 border-b border-emerald-100 flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2 text-emerald-800">
            <Apple className="h-5 w-5" /> قائمة الطعام الموصى بها
          </CardTitle>
          <Badge className="bg-emerald-600">اختيارات ذكية</Badge>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {diabetesSuperFoods.map((food, i) => (
              <Card key={i} className="overflow-hidden border-emerald-50 rounded-xl group hover:shadow-md">
                <div className="aspect-square relative">
                  <img src={food.img} alt={food.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-3 text-center">
                  <h4 className="text-sm font-black text-emerald-900 mb-1">{food.name}</h4>
                  <p className="text-[10px] text-slate-500 leading-tight">{food.benefits}</p>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* 7. الوجبات الغذائية */}
      <Card className="border-slate-200 bg-white font-bold shadow-sm">
        <CardHeader className="bg-slate-50 border-b py-4 flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2"><Utensils className="h-5 w-5 text-emerald-500" /> الوجبات المخصصة لك</CardTitle>
          <Badge className="bg-emerald-500">{subscriber.dailyCalories || 0} سعرة</Badge>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-slate-100">
          {subscriber.meals?.length > 0 ? subscriber.meals.map((meal: any, idx: number) => (
            <div key={idx} className="p-5 hover:bg-emerald-50/10">
              <Badge className="mb-3 bg-emerald-600 px-4 py-1">{meal.mealType || meal.name}</Badge>
              <div className="space-y-2">
                {meal.items.map((item: any, j: number) => (
                  <div key={j} className="flex justify-between text-sm bg-slate-50/50 p-3 rounded-xl border border-emerald-50">
                    <span>{item.name} ({item.quantity})</span>
                    <span className="text-emerald-600">{item.calories} سعرة</span>
                  </div>
                ))}
              </div>
            </div>
          )) : <div className="py-10 text-center text-slate-400">لا يوجد وجبات حالية مضافة.</div>}
        </CardContent>
      </Card>
    </div>
  )
}
function StatsCard({ title, value, unit, icon, color }: any) {
  const themes: any = {
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100"
  }
  return (
    <Card className={`p-5 flex items-center justify-between border shadow-sm ${themes[color]}`}>
      <div className="h-12 w-12 rounded-2xl bg-white/80 flex items-center justify-center">{icon}</div>
      <div className="text-left font-black">
        <p className="text-[10px] opacity-70 uppercase mb-1">{title}</p>
        <p className="text-2xl">{value || "---"}</p>
        <p className="text-[10px] font-normal">{unit}</p>
      </div>
    </Card>
  )
}
function TipItem({ icon, title, desc }: any) {
  return (
    <div className="flex gap-3 items-start">
      <div className="mt-1">{icon}</div>
      <div>
        <h5 className="text-sm text-slate-800">{title}</h5>
        <p className="text-[11px] text-slate-500">{desc}</p>
      </div>
    </div>
  )
}