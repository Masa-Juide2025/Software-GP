"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Users, Star, Clock, Calendar, Loader2, StickyNote, Plus, CheckCircle2, TrendingUp } from "lucide-react"

export default function TrainerDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const email = localStorage.getItem("userEmail");
      if (!email) { window.location.href = "/login"; return; }

      try {
        const res = await fetch(`/api/trainer/profile?email=${email}`);
        const result = await res.json();
        if (res.ok) setData(result);
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#f8fafc]">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="space-y-8 p-4 lg:p-8 text-right bg-[#f8fafc] min-h-screen" dir="rtl">
      {/* الترويسة */}
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-black text-slate-800">
          مرحباً، كابتن {data?.displayName?.split(" ")[0]} 👋
        </h2>
        <p className="text-sm text-slate-400 font-bold uppercase tracking-widest italic">
          {data?.specialization}
        </p>
      </div>

      {/* المربعات الثلاثة */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard title="المشتركين النشطين" value={data?.currentSubscribers} icon={<Users />} color="blue" />
        <StatCard title="التقييم العام" value={data?.rating} icon={<Star className="fill-amber-500" />} color="amber" />
        <StatCard title="مواعيد اليوم" value={data?.appointmentsCount} icon={<Clock />} color="emerald" />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* الملاحظات */}
        <Card className="border-none shadow-sm rounded-[32px] bg-white p-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-black">
                <StickyNote className="text-primary"/> ملاحظات سريعة
            </CardTitle>
            <Button size="icon" variant="secondary" className="rounded-full"><Plus className="h-4 w-4" /></Button>
          </CardHeader>
          <CardContent className="p-4">
            <div className="p-4 bg-slate-50 rounded-[20px] flex justify-between items-center text-slate-400 font-bold text-sm italic">
              لا يوجد ملاحظات لليوم..
              <CheckCircle2 className="h-5 w-5 text-slate-200" />
            </div>
          </CardContent>
        </Card>

        {/* المواعيد (البيانات اللي انتقلت من الروت) */}
        <Card className="border-none shadow-sm rounded-[32px] bg-white p-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-black">
                <Calendar className="text-blue-500"/> جدول المواعيد المكتشفة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-4">
            {data?.todayAppointments?.length > 0 ? data.todayAppointments.map((app: any, i: number) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-[20px] border border-transparent hover:border-slate-100 transition-all">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black">
                    {app.time || "غير محدد"}
                </span>
                <div className="flex-1 text-right">
                  <p className="text-sm font-black text-slate-800">{app.subscriberName}</p>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                    {app.type || "جلسة تدريب"}
                  </p>
                </div>
                <Badge className="bg-blue-50 text-blue-600 border-none text-[10px]">مؤكد</Badge>
              </div>
            )) : (
              <p className="text-center text-slate-400 py-10 text-sm font-bold italic">لا يوجد مواعيد مسجلة لتاريخ اليوم</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* السعة الاستيعابية */}
      <Card className="border-none shadow-sm rounded-[32px] bg-white overflow-hidden">
        <CardHeader className="pt-8 px-8">
            <CardTitle className="text-xl font-black text-slate-800 flex items-center gap-2">
                <TrendingUp className="text-primary h-5 w-5"/> سعة استيعاب المشتركين
            </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Capacity Metrics</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-primary">{data?.currentSubscribers || 0}</span>
                <span className="text-xl font-bold text-slate-300">/ {data?.maxSubscribers || 0} مشترك</span>
              </div>
            </div>
            <div className="text-4xl font-black text-slate-700">
              {data?.maxSubscribers > 0 ? Math.round((data.currentSubscribers / data.maxSubscribers) * 100) : 0}%
            </div>
          </div>
          <Progress value={data?.maxSubscribers > 0 ? (data.currentSubscribers / data.maxSubscribers) * 100 : 0} className="h-4 bg-slate-100" />
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  const themes: any = { 
    blue: "border-r-blue-500 text-blue-600 bg-blue-50/50", 
    amber: "border-r-amber-400 text-amber-500 bg-amber-50/50", 
    emerald: "border-r-emerald-500 text-emerald-600 bg-emerald-50/50" 
  };
  return (
    <Card className={`border-none shadow-sm rounded-[24px] border-r-4 ${themes[color]}`}>
      <CardContent className="flex items-center gap-4 p-6">
        <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
          {icon}
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500">{title}</p>
          <p className="text-2xl font-black text-slate-900">{value ?? 0}</p>
        </div>
      </CardContent>
    </Card>
  );
}