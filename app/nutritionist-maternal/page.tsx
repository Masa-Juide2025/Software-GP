"use client"
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, Star, Clock, HeartPulse, Utensils } from "lucide-react"

export default function MaternalDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const email = localStorage.getItem("userEmail");
      if (email) {
        try {
          const res = await fetch(`/api/nutritionist-maternal/profile?email=${email}`);
          const data = await res.json();
          setProfile(data);
        } catch (err) { console.error(err); } 
        finally { setLoading(false); }
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="p-10 text-center font-black text-pink-500 animate-pulse italic">جاري تحميل البيانات الحقيقية...</div>;

  const capacityPct = profile?.maxSubscribers > 0 
    ? Math.round((profile.currentSubscribers / profile.maxSubscribers) * 100) 
    : 0;

  return (
    <div className="space-y-6 p-4 lg:p-8 max-w-7xl mx-auto" dir="rtl">
      {/* الترويسة */}
      <div className="text-right mb-6">
        <h2 className="text-2xl font-black text-gray-800 lg:text-3xl">{"د. "}{profile.displayName} 👋</h2>
        <p className="text-sm text-muted-foreground font-bold">{profile.specialization}</p>
      </div>

      {/* الكروت الإحصائية */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<HeartPulse/>} label="الحوامل" value={profile.currentSubscribers} color="pink" />
        <StatCard icon={<Utensils/>} label="الخطط" value={profile.dietPlansCount} color="orange" />
        <StatCard icon={<Star/>} label="التقييم" value={profile.rating} color="yellow" />
        <StatCard icon={<Clock/>} label="مواعيد اليوم" value={profile.appointmentsCount} color="blue" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* قائمة الحوامل */}
        <Card className="border-pink-100 shadow-sm">
          <CardHeader className="pb-3 border-b bg-pink-50/10">
            <CardTitle className="text-base font-black flex items-center gap-2">
              <Users className="h-5 w-5 text-pink-500" /> متابعة الحوامل
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {profile.subscribersList?.map((sub: any) => (
              <div key={sub._id} className="flex items-center justify-between p-4 border rounded-xl bg-white hover:border-pink-300 transition-all shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold">
                    {sub.name.charAt(0)}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-gray-800">{sub.name}</p>
                    <p className="text-[10px] text-pink-500 font-bold italic">{sub.trimester}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className="bg-blue-50 text-blue-600 border-none font-black px-3 py-1 text-[11px]">
                    {"أسبوع "}{sub.gestationalWeek}
                  </Badge>
                  <div className="border-r pr-3 border-gray-100 text-left">
                    <p className="text-[9px] text-gray-400 font-bold uppercase">الزيارة القادمة</p>
                    <p className="text-xs font-black text-gray-700">
                      {sub.nextVisitDate 
                        ? new Date(sub.nextVisitDate).toLocaleDateString('ar-SA', { day: 'numeric', month: 'long' }) 
                        : "لم يحدد"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* مواعيد اليوم - رجعت زي ما طلبتِ */}
        <Card className="border-gray-100 shadow-sm">
          <CardHeader className="pb-3 border-b bg-blue-50/10">
            <CardTitle className="text-base font-black flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" /> مواعيد اليوم
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {profile.todayAppointments?.length > 0 ? (
              profile.todayAppointments.map((app: any) => (
                <div key={app._id} className="flex justify-between items-center p-3 border-b last:border-0 hover:bg-gray-50 rounded-lg">
                   <p className="text-sm font-bold text-gray-700">{app.subscriberName}</p>
                   <Badge className="bg-blue-50 text-blue-600 border-none font-black">{app.time}</Badge>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-gray-400 italic text-sm font-black italic">لا توجد مواعيد لليوم</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* سعة المشتركين - رجعت زي ما طلبتِ */}
      <Card className="p-6 border-none shadow-sm bg-white">
        <div className="flex justify-between mb-3 text-sm font-black text-gray-700">
          <span> السعة (الحد الأقصى {profile.maxSubscribers})</span>
          <span className="text-pink-600">{capacityPct}%</span>
        </div>
        <Progress value={capacityPct} className="h-3 bg-pink-50" />
      </Card>
    </div>
  )
}

function StatCard({ icon, label, value, color }: any) {
  const bgColors: any = { pink: "bg-pink-500", orange: "bg-orange-500", yellow: "bg-yellow-500", blue: "bg-blue-500" };
  return (
    <Card className="border-none shadow-sm bg-white hover:scale-105 transition-transform duration-200">
      <CardContent className="flex items-center gap-4 p-4">
        <div className={`h-12 w-12 rounded-2xl ${bgColors[color]} text-white flex items-center justify-center shadow-lg`}>
          {icon}
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-black">{label}</p>
          <p className="text-xl font-black text-gray-800">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}