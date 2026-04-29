"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Scale, Droplets, Flame, Target, Dumbbell, TrendingUp, Award, Apple, Zap, Video, Wheat, LayoutGrid } from "lucide-react"

interface WeightGainDashboardProps {
  subscriber: {
    name: string
    weight: number 
    startingWeight: number 
    targetWeight: number
    dailyCalories: number
    meals: any[]
    macros: { carbsCalories: number; proteinCalories: number; fatCalories: number }
    workoutPlan: any[]
  }
}

export function WeightGainDashboard({ subscriber }: WeightGainDashboardProps) {
  // --- الحسابات البرمجية ---
  const current = Number(subscriber?.weight) || 0;
  const start = Number(subscriber?.startingWeight) || 0;
  const target = Number(subscriber?.targetWeight) || 0;

  const weightGained = current - start;
  const totalRequired = target - start;

  let percent = 0;
  if (totalRequired > 0 && weightGained > 0) {
    percent = Math.round((weightGained / totalRequired) * 100);
  }

  const safePercent = Math.min(100, Math.max(0, percent));
  const remaining = parseFloat((target - current).toFixed(1));

  // --- مصفوفة الأطعمة المحدثة (تم تحديث رابط صورة المكسرات بصورة أجمل وأوضح) ---
  const recommendedFoods = [
    { 
      name: "المكسرات المشكلة", 
      // رابط جديد لصورة مكسرات احترافية وشهية
      img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600&auto=format&fit=crop", 
      desc: "سناك ذكي وسعرات عالية للضخامة" 
    },
    { 
      name: "صدور الدجاج والأرز", 
      img: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600&q=80", 
      desc: "الوجبة الأساسية لبناء العضلات" 
    },
    { 
      name: "الأفوكادو والبيض", 
      img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80", 
      desc: "دهون صحية وطاقة مستمرة" 
    }
  ];

  return (
    <div className="space-y-6" dir="rtl">
      {/* الترحيب العلوي */}
      <div className="rounded-xl bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-transparent p-4 border border-orange-500/10">
        <div className="flex items-center gap-3 text-right">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/20 shadow-inner">
            <TrendingUp className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{"مرحباً بطل، "}{(subscriber?.name || "مشترك").split(" ")[0]}</h2>
            <p className="text-sm text-muted-foreground">
              {"رحلة بناء الكتلة - باقي "}
              <span className="font-bold text-orange-600">{remaining > 0 ? remaining : 0}</span>
              {" كجم للهدف"}
            </p>
          </div>
        </div>
      </div>

      {/* الكروت الأربعة */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-orange-200 bg-orange-50/30 text-right shadow-sm">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 font-sans">
              <Flame className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-bold">{"احتياج السعرات"}</p>
              <p className="text-2xl font-black text-foreground">{subscriber?.dailyCalories || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="text-right border-blue-100 shadow-sm font-sans">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
              <Droplets className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-bold">{"الماء"}</p>
              <p className="text-xl font-bold text-foreground">{"4 لتر"}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50/30 text-right shadow-sm font-sans">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
              <Scale className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-bold">{"الوزن الحالي"}</p>
              <p className="text-xl font-bold text-foreground">{current} {"كجم"}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="text-right border-purple-100 shadow-sm font-sans">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-bold">{"هدف الوزن"}</p>
              <p className="text-xl font-bold text-foreground">{target} {"كجم"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* مؤشر التقدم الرئيسي */}
      <Card className="border-orange-500/20 text-right">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base font-bold">
            <Award className="h-5 w-5 text-orange-600" />
            {"مؤشر بناء الكتلة العضلية"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground font-bold">{"وزن البداية: "}{start}{" كجم"}</span>
            <span className="text-sm font-bold text-orange-600">{"الهدف: "}{target}{" كجم"}</span>
          </div>
          <Progress value={safePercent} className="h-3 bg-orange-100 mb-1" />
          <div className="mt-2 flex justify-between text-xs font-bold">
            <span className="text-orange-600">{"نسبة الإنجاز: "}{safePercent}{"%"}</span>
            <span className="text-gray-400">{"باقي "}{remaining > 0 ? remaining : 0}{" كجم"}</span>
          </div>
        </CardContent>
      </Card>

      {/* قسم السوبر فود المصلح لضمان ظهور الصور */}
      <Card className="border-orange-500/10 overflow-hidden text-right shadow-sm">
        <CardHeader className="pb-3 border-b bg-orange-50/30">
          <CardTitle className="flex items-center gap-2 text-base font-bold text-orange-800">
            <LayoutGrid className="h-5 w-5" />
            {"سوبر فود لضخامة عضلية"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedFoods.map((food, idx) => (
              <div key={idx} className="group flex flex-col rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all hover:border-orange-300 bg-white">
                <div className="aspect-video w-full overflow-hidden bg-gray-50">
                  <img 
                    src={food.img} 
                    alt={food.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80";
                    }}
                  />
                </div>
                <div className="p-3">
                  <p className="text-xs font-black text-gray-900 truncate">{food.name}</p>
                  <p className="text-[10px] text-orange-700 italic font-medium">{food.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2 text-right">
        {/* قسم التغذية */}
        <Card className="border-emerald-500/20 shadow-sm">
          <CardHeader className="pb-3 border-b bg-emerald-50/20">
            <CardTitle className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-emerald-700 text-base font-bold pr-1">
                  <Apple className="h-5 w-5" />
                  {"خطة التغذية"}
                </span>
                <Badge className="bg-emerald-600 text-white font-sans">{subscriber?.dailyCalories || 0} سعرة</Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-2 border-t border-emerald-100 pt-3 font-sans">
                <div className="bg-blue-50 p-2 rounded text-center border border-blue-100">
                  <p className="text-[10px] text-blue-600 font-bold">{"كارب"}</p>
                  <p className="text-xs font-black">{subscriber?.macros?.carbsCalories || 0}</p>
                </div>
                <div className="bg-orange-50 p-2 rounded text-center border border-orange-100">
                  <p className="text-[10px] text-orange-600 font-bold">{"بروتين"}</p>
                  <p className="text-xs font-black">{subscriber?.macros?.proteinCalories || 0}</p>
                </div>
                <div className="bg-yellow-50 p-2 rounded text-center border border-yellow-100">
                  <p className="text-[10px] text-yellow-700 font-bold">{"دهون"}</p>
                  <p className="text-xs font-black">{subscriber?.macros?.fatCalories || 0}</p>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 divide-y divide-emerald-50">
            {subscriber?.meals?.map((meal: any, mIdx: number) => (
              <div key={mIdx} className="p-4 space-y-3">
                <Badge variant="outline" className="font-bold text-emerald-700 border-emerald-200">
{
                meal.mealType === "Breakfast" ? "فطور" : 
                meal.mealType === "Lunch" ? "غداء" : 
               meal.mealType === "Dinner" ? "عشاء" : 
               meal.mealType // هذا السطر سيعرض "سناك 1" أو "عشاء" كما هي من الداتابيز
                 }                  </Badge>
                {meal.items.map((item: any, iIdx: number) => (
                  <div key={iIdx} className="bg-muted/20 rounded-lg p-3 flex justify-between items-center hover:border-emerald-200 border transition-all">
                    <span className="text-sm font-bold flex items-center gap-2">
                      <Wheat className="h-3 w-3 text-emerald-600" />
                      {item.name}
                    </span>
                    <span className="text-xs font-black text-orange-600 font-sans">{item.calories} {"سعرة"}</span>
                  </div>
                ))}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* قسم التمرين */}
        <Card className="border-orange-500/20 shadow-sm">
          <CardHeader className="pb-3 border-b bg-orange-50/20 text-right">
            <CardTitle className="flex items-center gap-2 text-base font-bold text-orange-700">
              <Dumbbell className="h-5 w-5" />
              {"تمارين اليومية"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4 text-right">
            {subscriber?.workoutPlan?.map((ex: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between rounded-xl border p-3 bg-white hover:border-orange-300 transition-all">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{ex.exerciseName}</p>
                    <p className="text-[10px] text-muted-foreground font-sans font-medium italic">
                      {ex.sets} جولات × {ex.reps || ex.durationSeconds} تكرار
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {ex.videoUrl && (
                    <a href={ex.videoUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                      <Video className="h-4 w-4" />
                    </a>
                  )}
                  <Badge variant="secondary" className="text-[10px] bg-orange-100 text-orange-700 border-none font-bold font-sans">
                    {ex.restSeconds}ث راحة
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* قسم النصائح */}
      <Card className="bg-gradient-to-l from-orange-500/5 via-transparent to-transparent border-orange-500/10 text-right shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold text-orange-800">{"نصائح ذهبية للنمو العضلي"}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground font-medium">
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
              {"الالتزام بفائض السعرات اليومي هو المحرك الأساسي لزيادة وزنك"}
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
              {"النوم لـ 8 ساعات يومياً يضمن لك أفضل استشفاء وبناء للأنسجة العضلية"}
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}