"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { subscribers } from "@/lib/mock-data"
import {
  UtensilsCrossed,
  Flame,
  Beef,
  Wheat,
  Droplet,
  Clock,
  CheckCircle,
  Apple,
  Coffee,
  Moon,
  Sun,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Activity,
  Heart,
  Baby,
  Ban,
  ShieldCheck,
} from "lucide-react"

// --- حل مشكلة TypeScript (الصورة الثانية) ---
// غيرنا الاسم لـ LocalSubscriber لتجنب التضارب مع التعريفات الخارجية
interface LocalSubscriber {
  id: string | number;
  name: string;
  goal: keyof typeof mealRecommendations;
}

// استخدمنا unknown كجسر (Bridge) لإقناع TypeScript بالتحويل
const currentSubscriber = subscribers[0] as unknown as LocalSubscriber;

// Meal recommendations based on goal
const mealRecommendations = {
  weight_loss: {
    title: "أكلات موصى بها لانقاص الوزن",
    color: "primary",
    meals: [
      { name: "سلطة دجاج مشوي", calories: 280, protein: 35, image: "salad", description: "صدر دجاج مشوي مع خضار طازجة وصوص خفيف" },
      { name: "سمك مشوي مع ليمون", calories: 220, protein: 30, image: "fish", description: "فيليه سمك مشوي مع عصير ليمون وأعشاب" },
      { name: "شوربة خضار", calories: 120, protein: 5, image: "soup", description: "شوربة خضار مشكلة قليلة السعرات" },
      { name: "زبادي يوناني مع توت", calories: 150, protein: 15, image: "yogurt", description: "زبادي قليل الدسم مع توت طازج" },
    ],
    tips: ["تناول البروتين في كل وجبة للشعور بالشبع", "اشرب كوب ماء قبل الوجبة بـ 30 دقيقة", "تجنب الأكل بعد الساعة 8 مساء"]
  },
  weight_gain: {
    title: "أكلات موصى بها لزيادة الوزن",
    color: "amber",
    meals: [
      { name: "شيك بروتين مع موز", calories: 550, protein: 40, image: "shake", description: "بروتين مع موز وزبدة فول سوداني وشوفان" },
      { name: "ستيك لحم مع بطاطا", calories: 700, protein: 50, image: "steak", description: "قطعة لحم مع بطاطا مهروسة وخضار" },
      { name: "باستا بالدجاج", calories: 650, protein: 35, image: "pasta", description: "باستا مع صدر دجاج وصوص كريمي" },
      { name: "أومليت بالجبن", calories: 450, protein: 28, image: "omelet", description: "بيض مع جبن وخضار وخبز محمص" },
    ],
    tips: ["تناول 6 وجبات صغيرة بدلا من 3 كبيرة", "اضف زيت الزيتون والمكسرات لزيادة السعرات", "تناول شيك بروتين قبل النوم"]
  },
  diabetes: {
    title: "أكلات موصى بها لمرضى السكري",
    color: "teal",
    meals: [
      { name: "سلطة عدس وخضار", calories: 250, gi: "منخفض", image: "lentil", description: "عدس مسلوق مع خضار طازجة وزيت زيتون" },
      { name: "دجاج مشوي بالأعشاب", calories: 280, gi: "منخفض", image: "chicken", description: "صدر دجاج متبل بالأعشاب الطازجة" },
      { name: "سمك سلمون مع بروكلي", calories: 320, gi: "منخفض", image: "salmon", description: "سلمون مشوي مع بروكلي على البخار" },
      { name: "شوربة الفاصوليا", calories: 180, gi: "منخفض", image: "beans", description: "شوربة فاصوليا غنية بالألياف" },
    ],
    tips: ["اختر الأطعمة ذات المؤشر الجلايسيمي المنخفض", "تجنب السكريات والنشويات المكررة", "تناول الألياف مع كل وجبة"]
  },
  hypertension: {
    title: "أكلات موصى بها لمرضى الضغط",
    color: "rose",
    meals: [
      { name: "سلطة سبانخ بالرمان", sodium: "20mg", calories: 180, image: "spinach", description: "سبانخ طازج مع رمان ومكسرات" },
      { name: "سمك مشوي بالثوم", sodium: "50mg", calories: 250, image: "garlic-fish", description: "سمك مشوي مع ثوم وليمون (يخفض الضغط)" },
      { name: "شوربة شوفان", sodium: "30mg", calories: 200, image: "oat-soup", description: "شوفان مطبوخ مع خضار طازجة" },
      { name: "موز مع لوز", sodium: "5mg", calories: 180, image: "banana", description: "موز غني بالبوتاسيوم مع لوز" },
    ],
    tips: ["قلل الملح واستخدم الأعشاب والتوابل", "تناول الأطعمة الغنية بالبوتاسيوم", "تجنب الأطعمة المصنعة والمعلبة"]
  },
  pregnancy: {
    title: "أكلات موصى بها للحامل",
    color: "pink",
    meals: [
      { name: "سلمون مع سبانخ", nutrients: "أوميغا3، حديد", calories: 350, image: "salmon-spinach", description: "سلمون مشوي مع سبانخ (حمض الفوليك)" },
      { name: "شوفان مع حليب وفواكه", nutrients: "كالسيوم، ألياف", calories: 400, image: "oatmeal", description: "وجبة غنية بالطاقة والفيتامينات" },
      { name: "عصير برتقال طازج", nutrients: "فيتامين C", calories: 120, image: "orange", description: "عصير طازج يساعد على امتصاص الحديد" },
      { name: "لحم مطبوخ جيدا مع خضار", nutrients: "حديد، بروتين", calories: 450, image: "meat", description: "لحم بقري مطبوخ تماما مع خضار مطهية" },
    ],
    tips: ["تناولي حمض الفوليك والحديد يوميا", "اشربي 3 لترات ماء يوميا", "تجنبي الأسماك النيئة واللحوم غير المطهية"]
  },
  sports_nutrition: {
    title: "أكلات موصى بها للتغذية الرياضية",
    color: "blue",
    meals: [
      { name: "شيك بروتين ما بعد التمرين", macros: "40g بروتين", calories: 350, image: "protein", description: "واي بروتين مع موز وزبدة فول سوداني" },
      { name: "دجاج مع أرز وخضار", macros: "45g بروتين", calories: 600, image: "chicken-rice", description: "وجبة متكاملة لبناء العضلات" },
      { name: "بيض مع توست وأفوكادو", macros: "25g بروتين", calories: 450, image: "eggs", description: "فطور مثالي قبل التمرين" },
      { name: "سلمون مع بطاطا حلوة", macros: "35g بروتين", calories: 550, image: "sweet-potato", description: "غني بالأوميغا 3 والكربوهيدرات المعقدة" },
    ],
    tips: ["تناول 30-40g بروتين خلال ساعة بعد التمرين", "الكربوهيدرات قبل التمرين بـ 45 دقيقة", "اشرب 500ml ماء أثناء التمرين"]
  },
}

// Today's meal plan based on goal
const getTodayMeals = (goal: string) => {
  const baseMeals = {
    weight_loss: [
      { time: "7:30 ص", type: "فطور", name: "شوفان مع فواكه طازجة", calories: 320, protein: 12, carbs: 45, fat: 8, done: true },
      { time: "10:00 ص", type: "سناك", name: "تفاحة مع لوز", calories: 180, protein: 5, carbs: 20, fat: 10, done: true },
      { time: "1:00 م", type: "غداء", name: "صدر دجاج مشوي مع سلطة خضار", calories: 420, protein: 40, carbs: 15, fat: 12, done: true },
      { time: "4:00 م", type: "سناك", name: "زبادي يوناني قليل الدسم", calories: 120, protein: 15, carbs: 8, fat: 2, done: false },
      { time: "7:30 م", type: "عشاء", name: "سمك مشوي مع خضار سوتيه", calories: 350, protein: 35, carbs: 12, fat: 15, done: false },
    ],
    weight_gain: [
      { time: "7:00 ص", type: "فطور", name: "بيض مقلي مع خبز وزبدة فول سوداني", calories: 650, protein: 35, carbs: 50, fat: 35, done: true },
      { time: "10:00 ص", type: "سناك", name: "شيك بروتين مع موز وشوفان", calories: 480, protein: 35, carbs: 55, fat: 12, done: true },
      { time: "1:00 م", type: "غداء", name: "أرز مع دجاج وزيت زيتون", calories: 750, protein: 45, carbs: 80, fat: 25, done: true },
      { time: "4:00 م", type: "سناك", name: "مكسرات مع تمر وحليب", calories: 450, protein: 15, carbs: 45, fat: 25, done: false },
      { time: "7:30 م", type: "عشاء", name: "ستيك لحم مع بطاطا مهروسة", calories: 700, protein: 50, carbs: 50, fat: 30, done: false },
    ],
    diabetes: [
      { time: "7:30 ص", type: "فطور", name: "بيض مسلوق مع خضار وجبن قليل الدسم", calories: 280, gi: "منخفض", done: true },
      { time: "1:00 م", type: "غداء", name: "صدر دجاج مع سلطة وأرز بني", calories: 420, gi: "متوسط", done: true },
      { time: "7:30 م", type: "عشاء", name: "سمك مشوي مع خضار سوتيه", calories: 320, gi: "منخفض", done: false },
    ],
    hypertension: [
      { time: "7:30 ص", type: "فطور", name: "شوفان مع موز وعسل", calories: 350, sodium: "45mg", done: true },
      { time: "1:00 م", type: "غداء", name: "سمك مشوي مع أرز بني وسلطة", calories: 450, sodium: "180mg", done: true },
      { time: "7:30 م", type: "عشاء", name: "شوربة خضار منزلية", calories: 280, sodium: "120mg", done: false },
    ],
    pregnancy: [
      { time: "7:30 ص", type: "فطور", name: "شوفان مع حليب وفواكه وعسل", calories: 450, nutrients: "كالسيوم، ألياف", done: true },
      { time: "1:00 م", type: "غداء", name: "سلمون مشوي مع أرز وسبانخ", calories: 550, nutrients: "أوميغا 3، حديد", done: true },
      { time: "7:30 م", type: "عشاء", name: "دجاج مشوي مع خضار", calories: 450, nutrients: "بروتين، فيتامينات", done: false },
    ],
    sports_nutrition: [
      { time: "5:30 ص", type: "قبل التمرين", name: "شوفان مع موز وعسل", calories: 450, macros: "C: 70g", done: true },
      { time: "1:00 م", type: "غداء", name: "صدر دجاج مع أرز وخضار", calories: 700, macros: "P: 50g", done: false },
      { time: "8:00 م", type: "عشاء", name: "سمك سلمون مع بطاطا حلوة", calories: 650, macros: "P: 40g", done: false },
    ],
  }
  return baseMeals[goal as keyof typeof baseMeals] || baseMeals.weight_loss
}

const getGoalIcon = (goal: string) => {
  switch (goal) {
    case "weight_loss": return <TrendingDown className="h-5 w-5" />
    case "weight_gain": return <TrendingUp className="h-5 w-5" />
    case "diabetes": return <Activity className="h-5 w-5" />
    case "hypertension": return <Heart className="h-5 w-5" />
    case "pregnancy": return <Baby className="h-5 w-5" />
    case "sports_nutrition": return <Sparkles className="h-5 w-5" />
    default: return <UtensilsCrossed className="h-5 w-5" />
  }
}

const getGoalColor = (goal: string) => {
  switch (goal) {
    case "weight_loss": return "text-primary"
    case "weight_gain": return "text-amber-600"
    case "diabetes": return "text-teal-600"
    case "hypertension": return "text-rose-600"
    case "pregnancy": return "text-pink-600"
    case "sports_nutrition": return "text-blue-600"
    default: return "text-primary"
  }
}

export default function MealPlanPage() {
  // استخدام الـ Interface الجديد هنا
  const goal = currentSubscriber.goal;
  const recommendations = mealRecommendations[goal] || mealRecommendations.weight_loss;
  const todayMeals = getTodayMeals(goal);
  
  const consumedCalories = todayMeals.filter(m => m.done).reduce((a, m) => a + m.calories, 0);
  const totalCalories = todayMeals.reduce((a, m) => a + m.calories, 0);
  const goalColor = getGoalColor(goal);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className={goalColor}>{getGoalIcon(goal)}</span>
          <h2 className="text-xl font-bold lg:text-2xl">الخطة الغذائية</h2>
        </div>
        <p className="text-sm text-muted-foreground">خطتك الغذائية المخصصة بناء على هدفك الصحي</p>
      </div>

      {/* Daily Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-primary" />
              <span className="font-medium">تقدم اليوم</span>
            </div>
            <Badge variant="outline">{consumedCalories}/{totalCalories} سعرة</Badge>
          </div>
          <Progress value={(consumedCalories / totalCalories) * 100} className="h-2" />
          <div className="mt-3 grid grid-cols-3 gap-4 text-center">
            <StatBox icon={<Beef className="h-4 w-4 text-red-500" />} label="بروتين" value="85g" />
            <StatBox icon={<Wheat className="h-4 w-4 text-amber-500" />} label="كربوهيدرات" value="180g" />
            <StatBox icon={<Droplet className="h-4 w-4 text-blue-500" />} label="دهون" value="45g" />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="today" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="today">وجبات اليوم</TabsTrigger>
          <TabsTrigger value="recommendations">توصيات</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          {todayMeals.map((meal, index) => (
            <Card key={index} className={meal.done ? "border-green-500/30 bg-green-500/5" : ""}>
              <CardContent className="p-4 flex items-start gap-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${meal.done ? "bg-green-500/20" : "bg-muted"}`}>
                  {meal.done ? <CheckCircle className="h-5 w-5 text-green-600" /> : <MealIcon type={meal.type} />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge variant="secondary" className="mb-1">{meal.type}</Badge>
                      <p className="text-sm font-medium">{meal.name}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {meal.time}</p>
                      <p className="text-sm font-semibold text-primary">{meal.calories} سعرة</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base flex gap-2"><ShieldCheck className={goalColor}/> {recommendations.title}</CardTitle></CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {recommendations.meals.map((m, i) => (
                <div key={i} className="flex items-center gap-3 border p-3 rounded-lg">
                  <div className="h-12 w-12 bg-muted flex items-center justify-center rounded-md"><UtensilsCrossed className={goalColor}/></div>
                  <div>
                    <p className="text-sm font-medium">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.calories} سعرة</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// مكونات صغيرة للتنظيم
function StatBox({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="rounded-lg bg-muted/50 p-2">
      <div className="mx-auto flex justify-center">{icon}</div>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  )
}

function MealIcon({ type }: { type: string }) {
  if (type === "فطور") return <Coffee className="h-5 w-5 text-amber-600" />
  if (type === "غداء") return <Sun className="h-5 w-5 text-yellow-500" />
  if (type === "عشاء") return <Moon className="h-5 w-5 text-indigo-500" />
  return <Apple className="h-5 w-5 text-green-500" />
}