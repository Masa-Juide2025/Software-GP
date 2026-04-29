"use client"

import { useEffect, useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, Star, TrendingDown, Target, Activity, HeartPulse, 
  ArrowUpCircle, ArrowDownCircle, LayoutDashboard, FileDown 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function ReportsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchReportData() {
      const email = localStorage.getItem("userEmail");
      if (email) {
        try {
          const res = await fetch(`/api/nutritionist/reports?email=${email}`);
          const data = await res.json();
          if (res.ok) setStats(data);
        } catch (err) { console.error(err); } 
        finally { setLoading(false); }
      }
    }
    fetchReportData();
  }, []);

  const exportPDF = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 0, 0, 210, (canvas.height * 210) / canvas.width);
    pdf.save("Clinic_Health_Report.pdf");
  };

  if (loading) return <div className="p-20 text-center font-black text-[#107c41]">جاري تحديث البيانات...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-[#fcfdfd]" dir="rtl">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-6">
        <div className="flex items-center gap-3">
          <div className="bg-[#107c41] p-2 rounded-xl text-white"><LayoutDashboard size={24} /></div>
          <div>
            <h1 className="text-2xl font-black text-gray-800 uppercase">لوحة التقارير والإحصائيات</h1>
            <p className="text-gray-400 font-bold text-sm">متابعة دقيقة للأداء الصحي ورحلة المشتركين</p>
          </div>
        </div>
        <Button onClick={exportPDF} className="bg-[#107c41] hover:bg-[#0b5c31] text-white font-black rounded-xl gap-2 h-11 px-5 shadow-sm">
          <FileDown size={18} /> تصدير التقرير PDF
        </Button>
      </div>

      <div ref={reportRef} className="space-y-8 p-2">
        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard label="إجمالي المشتركين" value={stats?.totalSubscribers} icon={<Users size={28}/>} color="green" />
          <StatCard label="الوزن المفقود (كجم)" value={stats?.totalWeightLost} icon={<TrendingDown size={28}/>} color="blue" />
          <StatCard label="تقييم الأداء" value={stats?.rating} icon={<Star size={28}/>} color="yellow" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* رحلة الوزن المثالي */}
          <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 h-full">
            <h2 className="text-xl font-black text-gray-800 mb-8 flex items-center gap-2">
              <Target className="text-[#107c41]" size={22} /> رحلة الوزن المثالي
            </h2>
            <div className="space-y-10">
              {stats?.weightJourney?.map((sub: any, i: number) => (
                <div key={i} className="space-y-4">
                  <div className="flex justify-between items-center font-black text-gray-700 text-sm">
                    <div className="flex items-center gap-2">
                      {sub.name} {sub.type === "loss" ? <ArrowDownCircle size={16} className="text-emerald-500"/> : <ArrowUpCircle size={16} className="text-blue-500"/>}
                    </div>
                    <Badge className="bg-[#107c41] text-white border-none">إنجاز {sub.progressPercentage}%</Badge>
                  </div>
                  <Progress value={sub.progressPercentage} className="h-2" />
                  <div className="grid grid-cols-3 gap-2 text-[10px] text-center font-bold">
                    <div className="bg-gray-50 p-2 rounded-lg text-gray-400">البداية: {sub.startWeight}</div>
                    <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600">الحالي: {sub.currentWeight}</div>
                    <div className="bg-orange-50 p-2 rounded-lg text-orange-500">المثالي: {sub.idealWeight}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* متابعة الحالات الصحية - سلمى هنا */}
          <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 h-full">
            <h2 className="text-xl font-black text-gray-800 mb-8 flex items-center gap-2">
              <HeartPulse className="text-red-500" size={22} /> متابعة الحالات الصحية
            </h2>
            <div className="space-y-5">
              {stats?.healthCases?.map((sub: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-5 bg-[#fbfcfc] rounded-3xl border border-gray-50 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${sub.condition.includes('سكري') ? 'bg-blue-50 text-blue-500' : 'bg-red-50 text-red-500'}`}>
                      <Activity size={24} />
                    </div>
                    <div>
                      <p className="font-black text-gray-800">{sub.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${sub.condition.includes('سكري') ? 'bg-blue-400' : 'bg-red-400'}`}></span>
                        {sub.condition}
                      </p>
                    </div>
                  </div>
                  <div className="text-left bg-white px-3 py-2 rounded-xl border border-gray-50">
                    <p className="text-[9px] text-gray-400 font-bold mb-1">مدى الالتزام</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-emerald-600">{sub.adherence}%</span>
                      <div className="w-12 h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{width: `${sub.adherence}%`}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {stats?.healthCases?.length === 0 && <p className="text-center py-10 text-gray-400 font-bold">لا يوجد حالات صحية مسجلة.</p>}
            </div>
            
            {/* النسبة العامة للحالات الصحية */}
            <div className="mt-8 pt-6 border-t border-dashed">
               <div className="bg-[#e7f5ed] p-4 rounded-2xl flex items-center justify-between">
                  <span className="text-xs font-black text-gray-700">متوسط الالتزام العام للحالات:</span>
                  <span className="text-xl font-black text-[#107c41]">{stats?.averageHealthAdherence}</span>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: any) {
  const colors: any = { green: "bg-[#e7f5ed] text-[#107c41]", yellow: "bg-[#fff9e6] text-[#ffcc00]", blue: "bg-[#eef6ff] text-[#3b82f6]" };
  return (
    <div className="bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm flex items-center justify-between transition-transform hover:scale-[1.02]">
      <div>
        <p className="text-gray-400 text-[10px] font-black mb-1 uppercase tracking-tighter">{label}</p>
        <h3 className="text-2xl font-black text-gray-800">{value || "0"}</h3>
      </div>
      <div className={`w-14 h-14 ${colors[color]} rounded-2xl flex items-center justify-center`}>{icon}</div>
    </div>
  );
}