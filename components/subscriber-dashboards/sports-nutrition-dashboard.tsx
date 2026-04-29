"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { 
  Loader2, Trophy, Scale, Activity, Flame, 
  Target, Utensils, CheckCircle2, Dumbbell, PlayCircle, 
  Zap, AlertTriangle, Lightbulb, Camera, XCircle, 
  Apple, ShieldCheck, Ban, Heart, Search, Droplet, Pill
} from "lucide-react"

// --- 1. بيانات بناء الأجسام (Muscle Building) ---
const muscleBuildingData = {
  foods: [
    { 
      name: "الارز",
      benefits: "وقود العضلات الأول؛ يوفر كربوهيدرات سهلة الهضم لرفع مستويات الطاقة.", 
      img: "https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=500" 
    },
    { 
      name: "صدور الدجاج",
      benefits: "بروتين صافي عالي الجودة لبناء الأنسجة العضلية وسرعة الاستشفاء.", 
      img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=500&auto=format&fit=crop" 
    },
    { 
      name: "اللحم البقري", 
      benefits: "غني بالحديد والزنك والكرياتين الطبيعي لزيادة القوة البدنية.", 
      img: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=500&auto=format&fit=crop" 
    },
    { 
      name: "السلمون المشوي", 
      benefits: "أوميغا 3 لتقليل التهابات المفاصل ودعم صحة القلب بعد الأوزان.", 
      img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=500&auto=format&fit=crop" 
    },
    { 
      name: "الموز", 
      benefits: "بوتاسيوم لمنع التشنجات العضلية ويوفر طاقة فورية قبل التدريب.", 
      img: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?q=80&w=500&auto=format&fit=crop" 
    },
  ],
  tips: [
    { title: "الاستشفاء", desc: "النوم 8 ساعات يسرع بناء العضلات بنسبة 30%." },
    { title: "البروتين", desc: "احرص على تناول وجبة بروتين عالية بعد التمرين مباشرة." },
    { title: "الأوزان", desc: "ركز على زيادة الأوزان تدريجياً لتحفيز الألياف العضلية." }
  ],
  forbidden: [
    { title: "السهر", desc: "يقلل من إفراز هرمون النمو الطبيعي في الجسم." },
    { title: "السكر", desc: "يسبب التهابات ويبطئ عملية البناء العضلي الصافي." }
  ]
};

// --- 2. بيانات حرق الدهون (Fat Loss) ---
const fatBurnData = {
  foods: [
    { 
      name: "التوت الأزرق", 
      benefits: "غني بمضادات الأكسدة ويساعد في التحكم في مستويات الأنسولين.", 
      img: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?q=80&w=500&auto=format&fit=crop" 
    },
    { 
      name: "البروكلي", 
      benefits: "ألياف عالية جداً ترفع من كفاءة عملية الهضم ومعدل الأيض.", 
      img: "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?q=80&w=500&auto=format&fit=crop" 
    },
    { 
      name: "التفاح", 
      benefits: "يحتوي على البكتين الذي يقلل الشهية ويرفع كفاءة الحرق.", 
      img: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?q=80&w=500&auto=format&fit=crop" 
    },
    { 
      name: "الشاي الأخضر", 
      benefits: "يحتوي على الكافيين والكاتيكين لتعزيز حرق الدهون وتوفير الطاقة.", 
      img: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?q=80&w=500&auto=format&fit=crop" 
    },
    { 
      name: "الأفوكادو", 
      benefits: "دهون صحية تحفز الجسم على حرق الدهون المخزنة كمصدر طاقة.", 
      img: "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?q=80&w=500&auto=format&fit=crop" 
    },
  ],
  tips: [
    { title: "الماء", desc: "اشرب الكثير من الماء لرفع معدل الحرق وتقليل الجوع." },
    { title: "الكارديو", desc: "مارس المشي السريع لمدة 30 دقيقة بعد تمرين المقاومة." },
    { title: "العجز الحراري", desc: "تأكد أن سعراتك الداخلة أقل من مجهودك اليومي للحرق." }
  ],
  forbidden: [
    { title: "المقالي", desc: "عدو الحرق الأول وتسبب تخزين الدهون في المناطق الصعبة." },
    { title: "المشروبات الغازية", desc: "تحتوي على سعرات فارغة ترفع الأنسولين وتوقف الحرق." }
  ]
};

// --- 3. بيانات الضخامة (Muscle Gain) ---
const muscleGainData = {
  foods: [
    { 
      name: " الدجاج", // بديل الزبادي
      benefits: "بروتين صافي عالي الجودة لبناء أنسجة عضلية قوية وصافية.", 
      img: "https://images.pexels.com/photos/106343/pexels-photo-106343.jpeg?auto=compress&cs=tinysrgb&w=500" 
    },
    { 
    name: "البروكلي الأخضر", // خضرة جبارة للرياضيين
      benefits: "يحتوي على مواد تخفض الإستروجين الضار وترفع كفاءة بناء العضلات.", 
      img: "https://images.pexels.com/photos/47347/broccoli-vegetable-food-healthy-47347.jpeg?auto=compress&cs=tinysrgb&w=500" 
    },
    { 
      name: "سمك السلمون", 
      benefits: "بروتين ممتاز وأوميغا 3 لتقليل الالتهابات بعد الأوزان الثقيلة.", 
      img: "https://images.pexels.com/photos/842142/pexels-photo-842142.jpeg?auto=compress&cs=tinysrgb&w=500" 
    },
    { 
      name: "المعكرونة الكاملة", 
      benefits: "وقود العضلات؛ توفر طاقة مستدامة للأوزان والتدريبات الشاقة.", 
      img: "https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=500" 
    },
    { 
      name: "البيض المسلوق", 
      benefits: "بروتين كامل يحتوي على جميع الأحماض الأمينية اللازمة للبناء.", 
      img: "https://images.pexels.com/photos/806457/pexels-photo-806457.jpeg?auto=compress&cs=tinysrgb&w=500" 
    },
  ],
  tips: [
    { title: "فائض السعرات", desc: "يجب تناول 300-500 سعرة إضافية للنمو." },
    { title: "التكرارات", desc: "حافظ على 8-12 تكرار للوصول للفشل العضلي." }
  ],
  forbidden: [
    { title: "الوجبات السريعة", desc: "تسبب زيادة دهون بدل الكتلة العضلية." },
    { title: "إهمال الراحة", desc: "العضلات تحتاج 48 ساعة راحة بين التمارين القوية." }
  ]
};

export function SportsNutritionDashboard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const refreshData = useCallback(async () => {
    const email = localStorage.getItem("userEmail")
    if (!email) return setLoading(false)
    try {
      const res = await fetch(`/api/subscriber/dashboard-sports?email=${email}&t=${Date.now()}`)
      const result = await res.json()
      if (result.success) setData(result.data)
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }, [])

  useEffect(() => { refreshData() }, [refreshData])

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    const formData = new FormData(e.currentTarget)
    try {
      const res = await fetch("/api/subscriber/dashboard-sports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: localStorage.getItem("userEmail"),
          currentWeight: formData.get("currentWeight"),
          targetWeight: formData.get("targetWeight"),
          muscleMass: formData.get("muscleMass"),
          fatPercentage: formData.get("fatPercentage"),
        })
      })
      if ((await res.json()).success) {
        toast.success("تم التحديث بنجاح")
        refreshData()
        setShowForm(false)
      }
    } finally { setIsSaving(false) }
  }

  if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-600 h-12 w-12" /></div>
  if (!data) return <div className="p-20 text-center font-bold">لا يوجد بيانات حالياً</div>

  const athlete = data.athleteInfo || {}
  const meals = data.meals || []
  const workout = data.workout || null
  const supplements = athlete.supplements || [] // سحب المكملات من بيانات اللاعب

  const type = (athlete.sportType || "").toString().toLowerCase().trim();
  const isFatBurnMode = type.includes("fat loss") || type.includes("حرق") || type.includes("تنشيف");
  const isMuscleGainMode = type.includes("muscle gain") || type.includes("ضخامة");
  
  const currentContent = isFatBurnMode ? fatBurnData : isMuscleGainMode ? muscleGainData : muscleBuildingData;

  return (
    <div className="space-y-6 text-right font-sans p-2 pb-20" dir="rtl">
      
      {/* 1. الترويسة */}
      <div className="rounded-3xl bg-white p-6 flex items-center justify-between border border-blue-100 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner border border-blue-100">
            <Trophy className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-800">أهلاً  {data.name}</h2>
            <div className="flex items-center gap-2">
              <Badge className="bg-orange-500 text-white hover:bg-orange-600 px-3 py-0.5 text-[10px]">
                <Dumbbell className="h-3 w-3 ml-1" /> {athlete.sportType || "رياضي"}
              </Badge>
              <Badge variant="outline" className="text-blue-600 border-blue-200 font-bold bg-blue-50/50 text-[10px]">
                {data.dailyCalories} سعرة يومياً
              </Badge>
            </div>
          </div>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-slate-900 text-white font-bold rounded-xl text-xs px-6 hover:bg-slate-800">
          {showForm ? "إغلاق" : "تحديث قياساتي"}
        </Button>
      </div>

      {/* 2. فورم التحديث */}
      {showForm && (
        <Card className="border-blue-200 shadow-xl animate-in zoom-in-95 duration-300 rounded-3xl overflow-hidden">
          <form onSubmit={handleUpdate} className="p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 font-bold">
            <div className="space-y-1"><Label>الوزن الحالي (kg)</Label><Input name="currentWeight" defaultValue={athlete.currentWeight} className="rounded-xl" /></div>
            <div className="space-y-1"><Label>الوزن المستهدف (kg)</Label><Input name="targetWeight" defaultValue={athlete.targetWeight} className="rounded-xl" /></div>
            <div className="space-y-1"><Label>كتلة العضل (kg)</Label><Input name="muscleMass" defaultValue={athlete.muscleMass} className="rounded-xl" /></div>
            <div className="space-y-1"><Label>نسبة الدهون (%)</Label><Input name="fatPercentage" defaultValue={athlete.fatPercentage} className="rounded-xl" /></div>
            <Button type="submit" disabled={isSaving} className="sm:col-span-4 bg-blue-600 text-white font-black h-12 rounded-xl shadow-lg">
              {isSaving ? "جاري الحفظ..." : "تأكيد وحفظ البيانات"}
            </Button>
          </form>
        </Card>
      )}

      {/* 3. كروت الإحصائيات */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatsCard title="الوزن الحالي" value={athlete.currentWeight} unit="KG" icon={<Scale className="h-6 w-6" />} color="blue" />
        <StatsCard title="كتلة العضل" value={athlete.muscleMass} unit="KG" icon={<Activity className="h-6 w-6" />} color="emerald" />
        <StatsCard title="نسبة الدهون" value={athlete.fatPercentage} unit="%" icon={<Flame className="h-6 w-6" />} color="rose" />
        <StatsCard title="الهدف" value={athlete.targetWeight} unit="KG" icon={<Target className="h-6 w-6" />} color="amber" />
      </div>

      {/* --- قسم المكملات المحدث بستايل هادئ --- */}
      <Card className="border-0 shadow-sm rounded-[2rem] overflow-hidden bg-gradient-to-br from-blue-50 to-white font-bold border-l-4 border-blue-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2 text-blue-700 font-black">
            <Zap className="h-4 w-4 fill-blue-500 text-blue-500" /> المكملات الخاصة بك
          </CardTitle>
        </CardHeader>
        <CardContent>
          {supplements && supplements.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {supplements.map((sup: string, i: number) => (
                <div key={i} className="flex items-center gap-2 bg-blue-100/50 px-4 py-2 rounded-full border border-blue-200">
                  <Pill className="h-3 w-3 text-blue-600" />
                  <span className="text-xs font-bold text-blue-800">{sup}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-2 text-slate-400 italic font-normal text-xs">
              لا توجد مكملات مضافة حالياً.
            </div>
          )}
        </CardContent>
      </Card>
      {/* --------------------------------------- */}
      {/* 4. القسم المنقسم: التغذية والتمارين */}
      <div className="grid gap-6 lg:grid-cols-2 font-bold">
        <Card className="border-0 shadow-lg rounded-[2rem] overflow-hidden bg-white">
          <CardHeader className="bg-blue-600 text-white py-5">
            <CardTitle className="text-lg flex items-center gap-2 font-black">
              <Utensils className="h-5 w-5" /> برنامج التغذية
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 divide-y divide-slate-50">
            {meals.map((meal: any, idx: number) => (
              <div key={idx} className="p-5 hover:bg-blue-50/20">
                <Badge className="bg-blue-600 mb-3 px-4">{meal.mealType || meal.name}</Badge>
                <div className="space-y-2">
                  {meal.items.map((item: any, j: number) => (
                    <div key={j} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-blue-50">
                      <span>{item.name} <span className="text-[10px] text-slate-400">({item.quantity})</span></span>
                      <span className="text-blue-600 text-xs font-black">{item.calories} Kcal</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg rounded-[2rem] overflow-hidden bg-white font-bold">
          <CardHeader className="bg-orange-500 text-white py-5">
            <CardTitle className="text-lg flex items-center gap-2 font-black">
              <Dumbbell className="h-5 w-5" /> البرنامج التدريبي
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            {workout ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2 bg-orange-50 p-3 rounded-2xl border border-orange-100 text-center">
                  <div><p className="text-[10px] text-orange-600 font-bold">المستوى</p><p className="text-sm font-black text-orange-900">{workout.level}</p></div>
                  <div><p className="text-[10px] text-orange-600 font-bold">أيام/أسبوع</p><p className="text-sm font-black text-orange-900">{workout.sessionsPerWeek}</p></div>
                  <div><p className="text-[10px] text-orange-600 font-bold">حرق/جلسة</p><p className="text-sm font-black text-orange-900">{workout.estimatedCaloriesBurnPerSession}</p></div>
                </div>
                <div className="space-y-3">
                  {workout.exercises?.map((ex: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-2xl shadow-sm transition-all hover:border-orange-200">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 text-xs font-black">{i+1}</div>
                        <div>
                          <p className="text-sm text-slate-800 font-black">{ex.exerciseName}</p>
                          <p className="text-[10px] text-slate-400 font-normal">{ex.sets} جولات × {ex.reps} تكرار</p>
                        </div>
                      </div>
                      {ex.videoUrl && <a href={ex.videoUrl} target="_blank" className="text-orange-500 transition-transform hover:scale-110"><PlayCircle className="h-6 w-6" /></a>}
                    </div>
                  ))}
                </div>
              </div>
            ) : <p className="text-center py-10 text-slate-300 italic">بانتظار تحديث تمارينك من المدرب</p>}
          </CardContent>
        </Card>
      </div>

      {/* 5. قسم النصائح والممنوعات */}
      <div className="grid gap-6 md:grid-cols-2 font-bold">
        <Card className="border-emerald-200 bg-white shadow-sm overflow-hidden rounded-[2rem]">
          <CardHeader className="bg-emerald-50/50 py-4 border-b border-emerald-100 text-emerald-800 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" /> نصائح البطل للأداء العالي
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {currentContent.tips.map((tip, i) => (
              <TipItem key={i} icon={<CheckCircle2 className="text-emerald-500 h-5 w-5" />} title={tip.title} desc={tip.desc} />
            ))}
          </CardContent>
        </Card>

        <Card className="border-rose-200 bg-white shadow-sm overflow-hidden rounded-[2rem]">
          <CardHeader className="bg-rose-50/50 py-4 border-b border-rose-100 text-rose-800 flex items-center gap-2">
            <Ban className="h-5 w-5" /> محاذير غذائية ورياضية
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {currentContent.forbidden.map((item, i) => (
              <TipItem key={i} icon={<AlertTriangle className="text-rose-500 h-5 w-5" />} title={item.title} desc={item.desc} />
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 6. الأطعمة الرياضية */}
      <Card className="border-blue-100 shadow-xl bg-white overflow-hidden font-bold rounded-[2rem]">
        <CardHeader className="bg-blue-50/50 py-4 border-b border-blue-100 flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
            <Apple className="h-5 w-5" /> قائمة الطعام الموصى بها {isFatBurnMode ? "(Fat Loss)" : isMuscleGainMode ? "(Muscle Gain)" : "(Muscle Building)"}
          </CardTitle>
          <Badge className="bg-blue-600">اختيارات ذكية</Badge>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {currentContent.foods.map((food, i) => (
              <Card key={i} className="overflow-hidden border-blue-50 rounded-xl group hover:shadow-md transition-all">
                <div className="aspect-square relative overflow-hidden">
                  <img src={food.img} alt={food.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-3 text-center bg-white">
                  <h4 className="text-sm font-black text-blue-900 mb-1">{food.name}</h4>
                  <p className="text-[10px] text-slate-500 leading-tight font-normal">{food.benefits}</p>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StatsCard({ title, value, unit, icon, color }: any) {
  const themes: any = {
    blue: "bg-blue-50 text-blue-600 border-blue-100 shadow-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100 shadow-rose-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100 shadow-amber-100"
  }
  return (
    <Card className={`p-5 flex items-center justify-between border shadow-lg rounded-3xl transition-transform hover:-translate-y-1 ${themes[color]}`}>
      <div className="h-12 w-12 rounded-2xl bg-white/80 flex items-center justify-center shadow-sm border border-inherit">{icon}</div>
      <div className="text-left font-black">
        <p className="text-[10px] opacity-70 mb-1">{title}</p>
        <p className="text-2xl tracking-tighter">{value || "---"}</p>
        <p className="text-[10px] font-normal">{unit}</p>
      </div>
    </Card>
  )
}

function TipItem({ icon, title, desc }: any) {
  return (
    <div className="flex gap-3 items-start bg-slate-50/50 p-3 rounded-2xl border border-slate-100/50 transition-colors hover:bg-white">
      <div className="mt-1">{icon}</div>
      <div>
        <h5 className="text-sm text-slate-800 font-black">{title}</h5>
        <p className="text-[11px] text-slate-500 leading-relaxed font-normal">{desc}</p>
      </div>
    </div>
  )
}