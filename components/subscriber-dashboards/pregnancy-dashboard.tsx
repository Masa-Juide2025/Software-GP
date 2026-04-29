"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Baby, Scale, Activity, Droplet, Apple, 
  Dumbbell, Zap, Droplets, 
  ShieldAlert, CheckCircle2, Info, Calendar, History, Star, Utensils
} from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"

// بيانات دليل حجم الجنين
const babySizeGuide = [
  { month: 1, size: "حبة أرز", fruit: "🌱", desc: "يبدأ تشكيل الجهاز العصبي والقلب." },
  { month: 2, size: "حبة عنب", fruit: "🍇", desc: "تتشكل الملامح الأساسية للوجه والأطراف." },
  { month: 3, size: "حبة ليمون", fruit: "🍋", desc: "تكتمل بنية الأعضاء ويبدأ الجنين بالحركة." },
  { month: 4, size: "حبة تفاح", fruit: "🍎", desc: "يمكن الآن سماع ضربات القلب بوضوح." },
  { month: 5, size: "حبة موز", fruit: "🍌", desc: "يغطي جسم الجنين وبر ناعم للحماية." },
  { month: 6, size: "حبة رمان", fruit: "🍅", desc: "تبدأ الرئتان بالتطور وتفتح العينان." },
  { month: 7, size: "حبة أناناس", fruit: "🍍", desc: "الجنين الآن يتفاعل مع الضوء والصوت." },
  { month: 8, size: "حبة شمام", fruit: "🍈", desc: "تتطور طبقات الدهون تحت الجلد." },
  { month: 9, size: "حبة بطيخ", fruit: "🍉", desc: "جاهز تماماً للقاء العالم الخارجي!" },
];

// بيانات الأطعمة السوبر المحدثة بروابط مستقرة ومضمونة
const superFoods = [
  { 
    name: "البيض", 
    benefits: "أهم مصدر للكولين الذي يبني خلايا مخ الجنين بذكاء.", 
    img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80" 
  },
  { 
    name: "شرائح السلمون", 
    benefits: "غني بالأوميغا 3 والبروتين لنمو عيون وجهاز الجنين العصبي.", 
    img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=80" 
  },
  { 
    name: "الأفوكادو", 
    benefits: "دهون صحية وفوليك أسيد لبناء أنسجة الجنين والجلد.", 
    img: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&q=80" 
  },
  { 
    name: "الزبادي بالفواكه", 
    benefits: "كالسيوم مركز لعظامك وبروبيوتيك لهضم مريح.", 
    img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80" 
  },
  { 
    name: "البروكلي", 
    benefits: "مصدر حديد وألياف طبيعية تحميكِ من الأنيميا والإمساك.", 
    img: "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=400&q=80" 
  },
];

interface PregnancyDashboardProps {
  subscriber: any;
}

export function PregnancyDashboard({ subscriber: initialData }: PregnancyDashboardProps) {
  const [subscriber, setSubscriber] = useState(initialData);
  const [showMedicalForm, setShowMedicalForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const refreshData = useCallback(async () => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;
    try {
      const res = await fetch(`/api/subscriber/dashboard-mother?email=${email}&t=${Date.now()}`);
      const result = await res.json();
      if (result.success) setSubscriber(result.data);
    } catch (err) { console.error("Fetch failed", err); }
  }, []);

  useEffect(() => { refreshData(); }, [refreshData]);

  const pregInfo = subscriber?.pregnancyInfo || {};
  const currentWeek = Number(pregInfo.gestationalWeek) || 0;
  const currentWeight = subscriber?.weight;
  const startingWeight = Number(subscriber?.startingWeight) || 0;
  const weightGain = currentWeight ? (currentWeight - startingWeight).toFixed(1) : "0.0";
  const weekProgress = Math.min((currentWeek / 40) * 100, 100);
  const caloriesFromPlan = subscriber?.dailyCalories || 0;

  const currentMonth = Math.ceil(currentWeek / 4.4) || 1;
  const currentFruit = babySizeGuide.find(f => f.month === Math.min(currentMonth, 9));

  const handleSaveMedical = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    const email = localStorage.getItem("userEmail");

    const payload = {
      email,
      currentWeight: formData.get("currentWeight"),
      bloodPressure: formData.get("bloodPressure"),
      hemoglobin: formData.get("hemoglobin"),
      gestationalWeek: formData.get("gestationalWeek"),
      trimester: formData.get("trimester"),
      numberOfChildren: formData.get("numberOfChildren")
    };

    try {
      const res = await fetch("/api/subscriber/dashboard-mother", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if ((await res.json()).success) {
        toast.success("تم تحديث البيانات بنجاح");
        await refreshData();
        setShowMedicalForm(false);
      }
    } finally { setIsSaving(false); }
  };

  const handleAddWeightLog = async () => {
    if (!currentWeight) {
      toast.error("يرجى إدخال الوزن الحالي أولاً في نموذج التعديل");
      return;
    }
    setIsSaving(true);
    const email = localStorage.getItem("userEmail");
    const payload = {
      email,
      currentWeight,
      bloodPressure: pregInfo.bloodPressure,
      hemoglobin: pregInfo.hemoglobin,
      gestationalWeek: currentWeek,
      trimester: pregInfo.trimester,
      numberOfChildren: pregInfo.numberOfChildren,
      newWeightEntry: { week: currentWeek, weight: currentWeight }
    };
    try {
      const res = await fetch("/api/subscriber/dashboard-mother", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if ((await res.json()).success) {
        toast.success(`تم تسجيل وزن الأسبوع ${currentWeek} في السجل`);
        refreshData();
      }
    } finally { setIsSaving(false); }
  };

  if (!subscriber) return <div className="p-20 text-center font-bold text-pink-500">جاري التحميل...</div>;

  return (
    <div className="space-y-6 text-right font-sans" dir="rtl">
      
      {/* الترويسة */}
      <div className="rounded-2xl bg-gradient-to-r from-pink-500/10 via-pink-400/5 to-transparent p-6 flex items-center justify-between border border-pink-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-pink-500/20 flex items-center justify-center border-2 border-pink-200">
            <Baby className="h-8 w-8 text-pink-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">أهلاً بكِ، {subscriber.name}</h2>
            <p className="text-sm font-semibold text-pink-600">الأسبوع {currentWeek} من رحلة الأمومة</p>
          </div>
        </div>
        <Button variant="outline" className="border-pink-300 text-pink-700 font-bold" onClick={() => setShowMedicalForm(!showMedicalForm)}>
          {showMedicalForm ? "إلغاء" : "تعديل وحفظ القياسات"}
        </Button>
      </div>

      {/* نموذج التعديل */}
      {showMedicalForm && (
        <Card className="border-pink-200 shadow-xl">
          <form onSubmit={handleSaveMedical}>
            <CardContent className="p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label className="font-bold">الوزن الحالي (كجم)</Label>
                <Input name="currentWeight" type="number" step="0.1" placeholder="أدخلي وزنكِ" defaultValue={currentWeight || ""} className="text-left font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="font-bold">ضغط الدم</Label>
                <Input name="bloodPressure" placeholder="120/80" defaultValue={pregInfo.bloodPressure} className="text-left font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="font-bold">الهيموجلوبين (Hb)</Label>
                <Input name="hemoglobin" type="number" step="0.1" defaultValue={pregInfo.hemoglobin} className="text-left font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="font-bold">أسبوع الحمل</Label>
                <Input name="gestationalWeek" type="number" defaultValue={currentWeek} className="text-left font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="font-bold">الثلث الحالي</Label>
                <Input name="trimester" type="number" defaultValue={pregInfo.trimester} className="text-left font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="font-bold">عدد الأطفال</Label>
                <Input name="numberOfChildren" type="number" defaultValue={pregInfo.numberOfChildren} className="text-left font-bold" />
              </div>
              <Button type="submit" disabled={isSaving} className="sm:col-span-3 bg-pink-600 font-bold text-white h-12 text-lg">تأكيد وحفظ القياسات</Button>
            </CardContent>
          </form>
        </Card>
      )}

      {/* كروت الإحصائيات */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="bg-pink-50/50 p-4 flex items-center gap-4 border-pink-100"><Droplet className="text-pink-600 h-6 w-6" /><div><p className="text-[10px] font-bold">Hb (الدم)</p><p className="text-2xl font-bold text-pink-900">{pregInfo.hemoglobin || "--"}</p></div></Card>
        <Card className="bg-rose-50/50 p-4 flex items-center gap-4 border-rose-100"><Activity className="text-rose-600 h-6 w-6" /><div><p className="text-[10px] font-bold">الضغط</p><p className="text-2xl font-bold text-rose-900">{pregInfo.bloodPressure || "--"}</p></div></Card>
        <Card className="bg-purple-50/50 p-4 flex items-center gap-4 border-purple-100">
          <Scale className="text-purple-600 h-6 w-6" />
          <div><p className="text-[10px] font-bold">الوزن الحالي</p><p className="text-2xl font-bold text-purple-900">{currentWeight ? `${currentWeight} كجم` : "---"}</p></div>
        </Card>
        <Card className="bg-orange-50/50 p-4 flex items-center gap-4 border-orange-100"><Zap className="text-orange-600 h-6 w-6" /><div><p className="text-[10px] font-bold">سعرات الخطة</p><p className="text-2xl font-bold text-orange-900">{caloriesFromPlan}</p></div></Card>
        <Card className="bg-blue-50/50 p-4 flex items-center gap-4 border-blue-100"><Calendar className="text-blue-600 h-6 w-6" /><div><p className="text-[10px] font-bold">موعد الولادة</p><p className="text-sm font-bold text-blue-900">{pregInfo.expectedDeliveryDate ? new Date(pregInfo.expectedDeliveryDate).toLocaleDateString('en-GB') : "غير محدد"}</p></div></Card>
      </div>

      {/* سجل الوزن الأسبوعي */}
      <Card className="border-purple-200 shadow-md">
        <CardHeader className="bg-purple-50/50 py-3 flex flex-row items-center justify-between border-b border-purple-100">
          <CardTitle className="text-sm flex items-center gap-2 text-purple-800 font-bold"><History className="h-5 w-5" /> سجل متابعة الوزن الأسبوعي</CardTitle>
          <Button onClick={handleAddWeightLog} disabled={isSaving || !currentWeight} className="bg-purple-600 h-8 text-xs font-bold">تسجيل وزن الأسبوع {currentWeek}</Button>
        </CardHeader>
        <CardContent className="p-0 max-h-[200px] overflow-y-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-gray-50 text-xs font-bold sticky top-0"><tr><th className="p-3">الأسبوع</th><th className="p-3">الوزن</th><th className="p-3">التاريخ</th></tr></thead>
            <tbody className="divide-y font-bold">
              {pregInfo.weeklyWeightLog?.length > 0 ? [...pregInfo.weeklyWeightLog].reverse().map((log: any, i: number) => (
                <tr key={i} className="hover:bg-purple-50/30"><td className="p-3 text-purple-700">أسبوع {log.week}</td><td className="p-3">{log.weight} كجم</td><td className="p-3 text-gray-500 text-xs">{new Date(log.date).toLocaleDateString('en-GB')}</td></tr>
              )) : <tr><td colSpan={3} className="p-8 text-center text-muted-foreground">لا يوجد سجلات وزن حالياً.</td></tr>}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* شريط التقدم */}
      <Card className="p-6 border-pink-200 shadow-sm">
        <div className="flex justify-between mb-3 text-sm font-bold"><span className="text-pink-600">الثلث الحالي: {pregInfo.trimester}</span><span className="text-gray-500">زيادة الوزن الكلية: {weightGain} كجم</span></div>
        <Progress value={weekProgress} className="h-3 bg-pink-50" />
        <p className="text-[10px] text-center mt-2 font-bold text-muted-foreground">اكتمال {currentWeek} من أصل 40 أسبوع</p>
      </Card>

      {/* قسم حجم الجنين */}
      <Card className="border-pink-200 shadow-md bg-gradient-to-br from-white to-pink-50/30 overflow-hidden">
        <CardHeader className="bg-pink-100/50 py-3 border-b border-pink-100">
          <CardTitle className="text-base flex items-center gap-2 text-pink-800 font-bold">
            <Baby className="h-5 w-5" /> طفلكِ الآن بحجم...
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="text-8xl animate-bounce drop-shadow-lg">
              {currentFruit?.fruit || "👶"}
            </div>
            <div className="flex-1 text-center md:text-right">
              <h3 className="text-2xl font-bold text-pink-900 mb-2">حجم الـ {currentFruit?.size}</h3>
              <p className="text-slate-600 font-bold leading-relaxed">{currentFruit?.desc}</p>
              <div className="mt-4 flex gap-2 justify-center md:justify-start">
                <Badge className="bg-pink-500">{currentWeek} أسبوع</Badge>
                <Badge variant="outline" className="border-pink-500 text-pink-700">الشهر {currentMonth}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* المكملات الغذائية */}
      <Card className="border-blue-200 shadow-md">
        <CardHeader className="bg-blue-50/50 py-3 border-b border-blue-100"><CardTitle className="text-sm flex items-center gap-2 text-blue-800 font-bold"><Droplets className="h-5 w-5" /> المكملات الغذائية الموصوفة لكِ</CardTitle></CardHeader>
        <CardContent className="p-4 flex flex-wrap gap-2">
          {pregInfo.supplements?.length > 0 ? pregInfo.supplements.map((s: string, i: number) => <Badge key={i} className="bg-blue-600 text-white font-bold px-4 py-2 rounded-full">{s}</Badge>) : <p className="text-xs font-bold text-muted-foreground">لا توجد مكملات موصوفة حالياً.</p>}
        </CardContent>
      </Card>

      {/* الدليل الغذائي والرياضي */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-emerald-200">
          <CardHeader className="bg-emerald-50/50 py-3 border-b border-emerald-100"><CardTitle className="text-base flex items-center gap-2 text-emerald-800 font-bold"><Apple className="h-5 w-5" /> دليل التغذية الصحي</CardTitle></CardHeader>
          <CardContent className="p-4 space-y-4 font-bold text-sm">
            <div className="p-3 bg-emerald-50/30 rounded-lg border-r-4 border-emerald-500">
              <h4 className="text-emerald-700 flex items-center gap-1 mb-1 font-bold text-xs"><CheckCircle2 className="h-4 w-4"/> يُنصح به:</h4>
              <ul className="list-disc pr-5 space-y-1 text-gray-700 text-xs"><li>الخضروات الورقية لمنع الأنيميا.</li><li>البروتين المطبوخ جيداً.</li><li>الألبان المدعمة بالكالسيوم.</li></ul>
            </div>
            <div className="p-3 bg-red-50/30 rounded-lg border-r-4 border-red-500">
              <h4 className="text-red-700 flex items-center gap-1 mb-1 font-bold text-xs"><ShieldAlert className="h-4 w-4"/> تجنبي:</h4>
              <ul className="list-disc pr-5 space-y-1 text-gray-700 text-xs"><li>اللحوم الباردة وغير المطهوة.</li><li>الأجبان غير المبسترة.</li><li>الإفراط في الكافيين.</li></ul>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 shadow-sm">
          <CardHeader className="bg-orange-50/50 py-3 border-b border-orange-100"><CardTitle className="text-base flex items-center gap-2 text-orange-800 font-bold"><Dumbbell className="h-5 w-5" /> نصائح رياضية آمنة</CardTitle></CardHeader>
          <CardContent className="p-4 space-y-3 font-bold text-sm">
            <div className="flex gap-3 items-start p-3 bg-white border border-orange-100 rounded-xl">
              <Zap className="h-5 w-5 text-orange-600 mt-1"/>
              <div><p className="text-orange-900 text-xs">المشي اليومي اللطيف:</p><p className="text-[10px] text-muted-foreground">ينشط الدورة الدموية ويقلل تورم القدمين.</p></div>
            </div>
            <div className="flex gap-3 items-start p-3 bg-white border border-orange-100 rounded-xl">
              <CheckCircle2 className="h-5 w-5 text-orange-600 mt-1"/>
              <div><p className="text-orange-900 text-xs">تمارين كيجل (Kegels):</p><p className="text-[10px] text-muted-foreground">لتقوية عضلات الحوض وتسهيل الولادة الطبيعية.</p></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* قسم الأطعمة السوبر المحدث */}
      <Card className="border-emerald-200 shadow-lg">
        <CardHeader className="bg-emerald-50 py-3 border-b border-emerald-100 flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2 text-emerald-800 font-bold">
            <Utensils className="h-5 w-5" /> أطعمة "سوبر" مفيدة لكِ ولجنينكِ
          </CardTitle>
          <Badge className="bg-emerald-600 text-white font-bold">5 أطعمة أساسية</Badge>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {superFoods.map((food, index) => (
              <Card key={index} className="overflow-hidden border-emerald-100 rounded-xl hover:shadow-md transition-shadow">
                <div className="relative aspect-square">
                  <img 
                    src={food.img} 
                    alt={food.name} 
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-white/70 text-emerald-800 backdrop-blur-sm font-bold text-xs">{index + 1}</Badge>
                </div>
                <CardContent className="p-3 text-center">
                  <h4 className="font-bold text-emerald-900 mb-1 text-sm">{food.name}</h4>
                  <p className="text-[10px] text-gray-600 font-semibold leading-relaxed">{food.benefits}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* الوجبات المخصصة */}
      <Card className="border-emerald-200">
        <CardHeader className="bg-emerald-50/50 border-b border-emerald-100 py-4"><CardTitle className="text-lg flex items-center gap-2 text-emerald-800 font-bold"><Apple className="h-6 w-6" /> برنامج الوجبات المخصص لكِ</CardTitle></CardHeader>
        <CardContent className="p-0">
          {subscriber.meals?.length > 0 ? subscriber.meals.map((meal: any, i: number) => (
            <div key={i} className="p-5 border-b last:border-0 hover:bg-emerald-50/30">
              <Badge className="mb-2 bg-emerald-600 font-bold px-4 py-1">{meal.mealType}</Badge>
              <div className="grid gap-2">
                {meal.items.map((item: any, j: number) => (
                  <div key={j} className="flex justify-between text-sm font-bold text-gray-700"><span>• {item.name} ({item.quantity})</span><span className="text-orange-600">{item.calories} س</span></div>
                ))}
              </div>
            </div>
          )) : <div className="p-10 text-center text-muted-foreground font-bold">لا توجد وجبات مخصصة حالياً.</div>}
        </CardContent>
      </Card>
    </div>
  );
}