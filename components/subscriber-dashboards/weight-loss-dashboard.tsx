"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Scale, Droplets, Flame, Target, Dumbbell, TrendingDown, Award, Apple, Zap, ChevronLeft, CheckCircle2, Video, Utensils } from "lucide-react"

// قائمة أطعمة نقصان الوزن المحدثة (صور احترافية 100%)
const weightLossFoods = [
  { 
    name: "ستيك لحم مشوي", 
    benefits: "بروتين صافي يعزز الشبع ويرفع معدل الحرق لساعات طويلة.", 
    img: "https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=400&auto=format&fit=crop" 
  },
  { 
    name: "سلطة الكينوا الملونة", 
    benefits: "غنية بالألياف والمعادن، بديل مثالي للأرز والمكرونة.", 
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop" 
  },
  { 
 name: "شاي الاعشاب", 
    benefits: "يزيل السوائل المحتبسة، يهدئ الأعصاب ويقلل الشهية بشكل طبيعي.", 
img: "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?q=80&w=400&auto=format&fit=crop"
  },
  { 
    name: "التوت والفاكهة الحمراء", 
    benefits: "سناك ذكي جداً يطرد السموم ويقلل الرغبة في تناول الحلويات.", 
    img: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=400&auto=format&fit=crop" 
  },
  { 
    name: "الخضار", 
    benefits: "سعرات منخفضة جداً مع قيمة غذائية عالية تحمي من الجوع.", 
    img: "https://images.unsplash.com/photo-1452948491233-ad8a1ed01085?q=80&w=400&auto=format&fit=crop" 
  },
];

interface WeightLossDashboardProps {
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

export function WeightLossDashboard({ subscriber }: WeightLossDashboardProps) {
  // حسابات الوزن والتقدم
  const weightLostSoFar = parseFloat((subscriber.startingWeight - subscriber.weight).toFixed(1));
  const remainingToGoal = parseFloat((subscriber.weight - subscriber.targetWeight).toFixed(1));
  const progressPercent = Math.min(100, Math.max(0, Math.round((weightLostSoFar / (subscriber.startingWeight - subscriber.targetWeight)) * 100)));

  return (
    <div className="space-y-6" dir="rtl">
      {/* الترحيب العلوي */}
      <div className="rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4">
        <div className="flex items-center gap-3 text-right">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
            <TrendingDown className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{"مرحباً، "}{subscriber.name.split(" ")[0]}</h2>
            <p className="text-sm text-muted-foreground">
              {"رحلة انقاص الوزن - باقي "}
              <span className="font-bold text-primary">{remainingToGoal}</span>
              {" كجم للهدف"}
            </p>
          </div>
        </div>
      </div>

      {/* الكروت الأربعة الملونة */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-destructive/20 bg-destructive/5 text-right">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-destructive/10">
              <Flame className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{"إجمالي السعرات"}</p>
              <p className="text-2xl font-black text-foreground">{subscriber.dailyCalories}</p>
              <p className="text-[10px] text-destructive italic font-medium">{"سعرة مخصصة لهدفك"}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="text-right">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-info/10">
              <Droplets className="h-6 w-6 text-info" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{"الماء"}</p>
              <p className="text-xl font-bold text-foreground">{"2.1 لتر"}</p>
              <p className="text-xs text-muted-foreground">{"الهدف: 3 لتر"}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-success/20 bg-success/5 text-right">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-success/10">
              <Scale className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{"الوزن الحالي"}</p>
              <p className="text-xl font-bold text-foreground">{subscriber.weight} {"كجم"}</p>
              <p className="text-xs text-success italic font-medium">{"خسرت "}{weightLostSoFar}{" كجم"}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="text-right">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-warning/10">
              <Target className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{"الهدف"}</p>
              <p className="text-xl font-bold text-foreground">{subscriber.targetWeight}</p>
              <Progress value={progressPercent} className="mt-1 h-1.5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* شريط تقدم انقاص الوزن */}
      <Card className="border-primary/20 text-right">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base font-bold">
            <Award className="h-5 w-5 text-primary" />
            {"تقدم انقاص الوزن"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">{"وزن البداية: "}{subscriber.startingWeight}{" كجم"}</span>
            <span className="text-sm font-medium text-primary">{"الهدف: "}{subscriber.targetWeight}{" كجم"}</span>
          </div>
          <Progress value={progressPercent} className="h-3" />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>{"خسرت "}{weightLostSoFar}{" كجم"}</span>
            <span>{"باقي "}{remainingToGoal}{" كجم"}</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2 text-right">
        {/* قسم وجبات اليوم والماكروز الكلية */}
        <Card className="border-success/20">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-success text-base font-bold">
                  <Apple className="h-5 w-5" />
                  {"خطة الوجبات اليومية"}
                </span>
                <Badge className="bg-success/10 text-success border-success/20">{subscriber.dailyCalories} سعرة</Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-2 border-t pt-3">
                <div className="bg-blue-50 p-2 rounded text-center border border-blue-100">
                  <p className="text-[10px] text-blue-600 font-bold">{"كارب"}</p>
                  <p className="text-xs font-black">{subscriber.macros?.carbsCalories || 0}</p>
                </div>
                <div className="bg-orange-50 p-2 rounded text-center border border-orange-100">
                  <p className="text-[10px] text-orange-600 font-bold">{"بروتين"}</p>
                  <p className="text-xs font-black">{subscriber.macros?.proteinCalories || 0}</p>
                </div>
                <div className="bg-yellow-50 p-2 rounded text-center border border-yellow-100">
                  <p className="text-[10px] text-yellow-700 font-bold">{"دهون"}</p>
                  <p className="text-xs font-black">{subscriber.macros?.fatCalories || 0}</p>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {subscriber.meals?.map((meal: any, mIdx: number) => (
                <div key={mIdx} className="p-4 space-y-4">
                  <Badge variant="secondary" className="font-bold">
                  {
                meal.mealType === "Breakfast" ? "فطور" : 
                meal.mealType === "Lunch" ? "غداء" : 
               meal.mealType === "Dinner" ? "عشاء" : 
               meal.mealType // هذا السطر سيعرض "سناك 1" أو "عشاء" كما هي من الداتابيز
                 }                  </Badge>
                  <div className="space-y-3">
                    {meal.items.map((item: any, iIdx: number) => (
                      <div key={iIdx} className="bg-muted/30 rounded-lg p-3 border hover:border-success/20 transition-all">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-bold flex items-center gap-2">
                            <ChevronLeft className="h-3 w-3 text-success" />
                            {item.name} {item.quantity ? `(${item.quantity})` : ''}
                          </span>
                          <span className="text-xs font-black text-destructive">{item.calories} {"سعرة"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* قسم التمارين مع إضافة رابط الفيديو */}
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-bold text-primary">
              <Dumbbell className="h-5 w-5" />
              {"قائمة التمارين"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {subscriber.workoutPlan && subscriber.workoutPlan.length > 0 ? (
              subscriber.workoutPlan.map((ex: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between rounded-lg border p-3 bg-primary/5 hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <div className="text-right">
                      <p className="text-sm font-bold">{ex.exerciseName}</p>
                      <p className="text-[10px] text-muted-foreground italic">
                        {ex.sets} جولات × {ex.reps ? `${ex.reps} تكرار` : `${ex.durationSeconds} ثانية`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* إضافة أيقونة الفيديو إذا كان الرابط موجوداً في الداتابيز */}
                    {ex.videoUrl && (
                      <a 
                        href={ex.videoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                        title="مشاهدة فيديو التمرين"
                      >
                        <Video className="h-4 w-4" />
                      </a>
                    )}
                    <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary border-none">
                      {ex.restSeconds}ث راحة
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-muted-foreground italic text-sm">
                {"لا توجد تمارين مسجلة حالياً"}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* قسم أطعمة مقترحة لخسارة الوزن المدمج حديثاً */}
      <Card className="border-success/20 shadow-md bg-white">
        <CardHeader className="bg-success/5 py-3 border-b border-success/10 flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2 text-success font-bold">
            <Utensils className="h-5 w-5" /> أطعمة مقترحة لخسارة الوزن
          </CardTitle>
          <Badge className="bg-success text-white font-bold">خيارات صحية</Badge>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {weightLossFoods.map((food, index) => (
              <Card key={index} className="overflow-hidden border-success/10 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={food.img} 
                    alt={food.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <Badge className="absolute top-2 right-2 bg-white/80 text-success backdrop-blur-sm font-bold text-xs">{index + 1}</Badge>
                </div>
                <CardContent className="p-4 text-center bg-white">
                  <h4 className="font-bold text-success mb-1.5 text-sm">{food.name}</h4>
                  <p className="text-[11px] text-gray-600 font-medium leading-relaxed">{food.benefits}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* قسم النصائح */}
      <Card className="bg-gradient-to-l from-success/5 via-transparent to-transparent border-success/10 text-right">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold">{"نصائح لانقاص الوزن"}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-success" />
              {"اشرب كوب ماء قبل كل وجبة بـ 30 دقيقة"}
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-success" />
              {"شاهد فيديوهات التمارين المرفقة لضمان الأداء الصحيح"}
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}