"use client"
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, UserCog, DollarSign, UtensilsCrossed, Dumbbell, Activity } from "lucide-react";

export function StatsCards() {
  const [data, setData] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // نخبر المتصفح أنه جاهز الآن
    fetch("/api/admin/stats")
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error("Error:", err));
  }, []);

  // هذا السطر يمنع ظهور الخطأ الأحمر في المتصفح
  if (!mounted) return <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4 h-32"></div>;

  const formatNumber = (num: any) => {
    return (num ?? 0).toLocaleString('en-US');
  };

  const statsList = [
    { title: "اجمالي المشتركين", value: formatNumber(data?.totalSubscribers), icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "اجمالي الاخصائيين", value: formatNumber(data?.totalNutritionists), icon: UserCheck, color: "text-green-600", bg: "bg-green-50" },
    { title: "اجمالي المدربين", value: formatNumber(data?.totalTrainers), icon: UserCog, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "ايرادات شهريه", value: formatNumber(data?.monthlyRevenue), icon: DollarSign, color: "text-orange-600", bg: "bg-orange-50" },
    { title: "اجمالي الخطط الغذائية", value: formatNumber(data?.totalDietPlans), icon: UtensilsCrossed, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "اجمالي الخطط الرياضية", value: formatNumber(data?.totalWorkoutPlans), icon: Dumbbell, color: "text-red-600", bg: "bg-red-50" },
    { title: "نسبة الالتزام", value: `${formatNumber(data?.avgAdherence)}%`, icon: Activity, color: "text-cyan-600", bg: "bg-cyan-50" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4" dir="rtl">
      {statsList.map((stat, i) => (
        <Card key={i} className="border-none shadow-sm overflow-hidden bg-white">
          <CardContent className="p-4 lg:p-6 flex items-center justify-between">
            <div className="space-y-1 text-right">
              <p className="text-xs font-black text-gray-500 lg:text-sm">{stat.title}</p>
              <p className="text-2xl font-black text-black lg:text-4xl leading-tight font-sans">
                {stat.value}
              </p>
            </div>
            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} shadow-inner shrink-0`}>
              <stat.icon size={26} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}