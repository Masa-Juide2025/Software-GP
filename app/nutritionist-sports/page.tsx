"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Users, Trophy, TrendingUp, Clock, Dumbbell, Flame, Loader2, Zap
} from "lucide-react"

export default function SportsDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const email = localStorage.getItem("userEmail");
      if (email) {
        try {
          const res = await fetch(`/api/nutritionist-sports/dashboard?email=${email}`);
          const result = await res.json();
          if (result.success) setData(result);
        } catch (err) { console.error(err); } 
        finally { setLoading(false); }
      }
    }
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center text-orange-500 font-bold italic animate-pulse">
      <Loader2 className="h-10 w-10 animate-spin" />
      <span className="mr-3 text-right">جاري جلب بيانات الأبطال...</span>
    </div>
  );

  const capacityPct = data?.maxSubscribers > 0 
    ? Math.round((data.stats.total / data.maxSubscribers) * 100) 
    : 0;

  // استخدام البيانات القادمة من السيرفر أو مصفوفة فارغة للتجنب الأخطاء
  const supplementsToDisplay = data?.supplementsData || [];

  return (
    <div className="space-y-6 p-4 lg:p-8" dir="rtl">
      {/* الترويسة */}
      <div className="text-right">
        <h2 className="text-xl font-bold lg:text-2xl text-gray-900">{"مرحبا، د. "}{data?.displayName}</h2>
        <p className="text-sm text-muted-foreground">{"لوحة تحكم التغذية الرياضية - تحسين الأداء وبناء الأبطال"}</p>
      </div>

      {/* المربعات الأربعة */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<Users/>} label="إجمالي الرياضيين" value={data?.stats.total} sub={`من ${data?.maxSubscribers} كحد أقصى`} color="orange" />
        <StatCard icon={<Dumbbell/>} label="كمال أجسام" value={data?.stats.bodybuilding} sub="Bodybuilding" color="amber" />
        <StatCard icon={<TrendingUp/>} label="زيادة كتلة عضلية" value={data?.stats.muscleGain} sub="Muscle Gain" color="green" />
        <StatCard icon={<Flame/>} label="حرق الدهون" value={data?.stats.fatLoss} sub="Fat Loss" color="red" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* قائمة الأبطال */}
        <Card className="order-1 lg:order-none">
          <CardHeader className="pb-3 text-right">
            <CardTitle className="flex items-center gap-2 text-base justify-start">
              <Trophy className="h-5 w-5 text-amber-500" />
              {"قائمة الرياضيين المتابعين"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data?.athletesList?.length > 0 ? (
              data.athletesList.map((athlete: any) => (
                <div key={athlete._id} className="rounded-lg border border-border p-3 text-right hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4 flex-row text-right">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-orange-500/10 text-orange-500 font-bold uppercase">
                        {athlete.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-foreground">{athlete.name}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] py-0">{athlete.sportType || athlete.sport}</Badge>
                        <Badge className="text-[10px] bg-gray-100 text-gray-800 border-none py-0">{athlete.goal}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-muted-foreground italic text-sm">لا يوجد رياضيين مسجلين حالياً</div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6 order-2 lg:order-none">
          {/* مواعيد اليوم */}
          <Card>
            <CardHeader className="pb-3 text-right">
              <CardTitle className="flex items-center gap-2 text-base justify-start">
                <Clock className="h-5 w-5 text-primary" />
                {"مواعيد اليوم"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data?.todayAppointments?.length > 0 ? (
                data.todayAppointments.map((app: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-2 border-b last:border-0">
                    <span className="text-sm font-medium">{app.subscriberName}</span>
                    <Badge variant="secondary" className="text-[10px]">{app.time || "غير محدد"}</Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-muted-foreground italic text-sm">لا توجد مواعيد مسجلة حالياً</div>
              )}
            </CardContent>
          </Card>

          {/* المكملات الغذائية - الآن مربوطة بالداتا بيس */}
          <Card>
            <CardHeader className="pb-3 text-right">
              <CardTitle className="flex items-center gap-2 text-base justify-start">
                <Zap className="h-5 w-5 text-amber-500" />
                {"المكملات الأكثر استخداما"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-right">
              {supplementsToDisplay.length > 0 ? supplementsToDisplay.map((supplement: any) => (
                <div key={supplement.name}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-foreground">{supplement.name}</span>
                    <span className="text-muted-foreground text-xs">{supplement.athletes} {"رياضي"} ({supplement.percentage}%)</span>
                  </div>
                  <Progress value={supplement.percentage} className="h-2" />
                </div>
              )) : <div className="text-center text-xs text-muted-foreground">لا توجد بيانات مكملات</div>}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* سعة الرياضيين */}
      <Card>
        <CardHeader className="pb-3 text-right">
          <CardTitle className="text-base text-right">{"سعة الرياضيين"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm mb-2 font-medium">
             <span className="text-foreground">{capacityPct}%</span>
             <span className="text-muted-foreground">{data?.stats.total} من {data?.maxSubscribers} رياضي</span>
          </div>
          <Progress value={capacityPct} className="h-3" />
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({ icon, label, value, sub, color }: any) {
  const colors: any = {
    orange: "bg-orange-500/10 text-orange-500",
    amber: "bg-amber-500/10 text-amber-500",
    green: "bg-green-500/10 text-green-500",
    red: "bg-red-500/10 text-red-500"
  };
  return (
    <Card className="text-right">
      <CardContent className="flex items-center gap-4 p-4 flex-row-reverse">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colors[color]}`}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-xl font-bold text-foreground">{value || 0}</p>
          <p className={`text-[10px] font-bold ${colors[color].split(' ')[1]}`}>{sub}</p>
        </div>
      </CardContent>
    </Card>
  )
}