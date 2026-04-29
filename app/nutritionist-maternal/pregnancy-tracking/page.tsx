"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { HeartPulse, Calendar, Baby, Clock, Scale, Activity, Pill, Apple, Edit3, X, Loader2, TrendingUp, CheckCircle2, AlertCircle, Download } from "lucide-react"

// استيراد مكتبات PDF
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export default function PregnancyTrackingPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMother, setSelectedMother] = useState<any>(null)
  const [filterTrimester, setFilterTrimester] = useState<string>("all")
  const [newSupp, setNewSupp] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // دالة توليد الـ PDF - تم حذف Health Status منها
  const generatePDF = (mother: any) => {
    const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
    const primaryColor: [number, number, number] = [219, 39, 119]; 
    
    // إعدادات الرأس
    doc.setFillColor(249, 250, 251);
    doc.rect(0, 0, 210, 40, "F");
    
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(22);
    doc.text("NutriSync AI", 105, 20, { align: "center" });
    
    doc.setTextColor(100);
    doc.setFontSize(14);
    doc.text("Pregnancy Progress Report", 105, 30, { align: "center" });

    // بيانات الأم (تمت إزالة Health Status بناءً على طلبك)
    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.text(`Mother Name: ${mother.name}`, 20, 50);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 50);

    // جدول المقاييس الصحية
    autoTable(doc, {
      startY: 65,
      head: [['Metric', 'Value']],
      body: [
        ['Gestational Week', `Week ${mother.gestationalWeek}`],
        ['Weight', `${mother.weight} kg`],
        ['Blood Pressure', mother.bloodPressure || "120/80"],
        ['Hemoglobin', `${mother.hemoglobin} g/dL`],
        ['Initial Weight', `${mother.initialWeight} kg`],
      ],
      headStyles: { fillColor: primaryColor },
      theme: 'striped'
    });

    const finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text("Nutrition & Supplements", 20, finalY);
    doc.setFontSize(10);
    doc.text(`Supplements: ${mother.supplements?.join(', ') || 'None'}`, 20, finalY + 8);
    
    // سجل الأوزان الأسبوعي مع تحويل الـ Status للإنجليزية لمنع الرموز الغريبة
    if (mother.weeklyWeightLog && mother.weeklyWeightLog.length > 0) {
      const statusEngMap: any = {
        "وزن مثالي": "Ideal Weight",
        "زيادة مفرطة": "Overweight",
        "زيادة بطيئة": "Slow Gain",
        "نقص حاد": "Severe Loss",
        "بيانات ناقصة": "Missing Data"
      };

      autoTable(doc, {
        startY: finalY + 20,
        head: [['Week', 'Weight (kg)', 'Status']],
        body: mother.weeklyWeightLog.map((log: any) => {
            const status = getWeightStatus(log.week, log.weight, mother.initialWeight);
            return [`Week ${log.week}`, `${log.weight} kg`, statusEngMap[status.label] || status.label];
        }),
        headStyles: { fillColor: [75, 85, 99] }
      });
    }

    doc.save(`NutriSync_Report_${mother.name}.pdf`);
  };

  const getWeightStatus = (week: number, weightAtWeek: number, initialWeight: number) => {
    if (!initialWeight || initialWeight === 0) return { label: "بيانات ناقصة", color: "text-gray-400", bg: "bg-gray-50", icon: <AlertCircle className="h-4 w-4" /> };
    const gain = weightAtWeek - initialWeight;
    let minGain = 0; let maxGain = 0;
    if (week <= 12) { minGain = -1; maxGain = 2; }
    else if (week <= 28) { minGain = 2 + ((week - 12) * 0.35); maxGain = 2 + ((week - 12) * 0.55); }
    else { minGain = 8 + ((week - 28) * 0.4); maxGain = 11 + ((week - 28) * 0.6); }
    if (gain < (minGain - 2)) return { label: "نقص حاد", color: "text-red-600", bg: "bg-red-50", icon: <AlertCircle className="h-4 w-4" /> };
    if (gain < minGain) return { label: "زيادة بطيئة", color: "text-orange-600", bg: "bg-orange-50", icon: <AlertCircle className="h-4 w-4" /> };
    if (gain <= maxGain) return { label: "وزن مثالي", color: "text-emerald-600", bg: "bg-emerald-50", icon: <CheckCircle2 className="h-4 w-4" /> };
    return { label: "زيادة مفرطة", color: "text-red-500", bg: "bg-red-50", icon: <AlertCircle className="h-4 w-4" /> };
  };

  useEffect(() => {
    async function fetchData() {
      const email = localStorage.getItem("userEmail");
      try {
        const res = await fetch(`/api/nutritionist-maternal/pregnancy-tracking?email=${email}`);
        const result = await res.json();
        if (result.success) setData(result);
      } catch (err) { console.error("Fetch error:", err); }
      finally { setLoading(false); }
    }
    fetchData();
  }, []);

  const handleUpdateSupps = async (newList: string[]) => {
    setIsUpdating(true);
    try {
      const res = await fetch('/api/nutritionist-maternal/pregnancy-tracking', {
        method: 'PATCH',
        body: JSON.stringify({ recordId: selectedMother._id, supplements: newList }),
      });
      const result = await res.json();
      if (result.success) {
        setSelectedMother({ ...selectedMother, supplements: result.supplements });
        setData({
          ...data,
          subscribersList: data.subscribersList.map((m: any) => 
            m._id === selectedMother._id ? { ...m, supplements: result.supplements } : m
          )
        });
      }
    } catch (err) { console.error(err); }
    finally { setIsUpdating(false); }
  };

  if (loading) return <div className="p-20 text-center font-bold text-pink-500 italic">جاري تحميل البيانات...</div>;

  const filteredMothers = data?.subscribersList.filter((m: any) => 
    filterTrimester === "all" || m.trimester === (filterTrimester === "1" ? "الثلث الأول" : filterTrimester === "2" ? "الثلث الثاني" : "الثلث الثالث")
  ) || [];

  return (
    <div className="space-y-6 text-right px-4 py-6 bg-[#FBFCFD]" dir="rtl">
      <div>
        <h2 className="text-xl font-bold lg:text-2xl italic text-gray-800">متابعة الحمل</h2>
        <p className="text-sm text-muted-foreground font-medium italic">تتبع تغذية وصحة الأمهات المشتركات</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="الثلث الأول" count={data?.stats.firstTrimester} color="text-blue-500" bgColor="bg-blue-50" num="1" />
        <StatCard label="الثلث الثاني" count={data?.stats.secondTrimester} color="text-green-500" bgColor="bg-green-50" num="2" />
        <StatCard label="الثلث الثالث" count={data?.stats.thirdTrimester} color="text-orange-500" bgColor="bg-orange-50" num="3" />
      </div>

      <Tabs value={filterTrimester} onValueChange={setFilterTrimester} className="w-full">
        <TabsList className="bg-gray-100/50 p-1 rounded-xl font-bold">
          <TabsTrigger value="all">الكل</TabsTrigger>
          <TabsTrigger value="1">الثلث الأول</TabsTrigger>
          <TabsTrigger value="2">الثلث الثاني</TabsTrigger>
          <TabsTrigger value="3">الثلث الثالث</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4 lg:grid-cols-2">
        {filteredMothers.map((mother: any) => (
          <Card key={mother._id} className="cursor-pointer hover:shadow-md transition-all border-r-4 border-r-pink-500 rounded-[25px]" onClick={() => setSelectedMother(mother)}>
            <CardContent className="p-5 flex items-center gap-4">
              <Avatar className="h-14 w-14 border-2 border-pink-50 shadow-sm">
                <AvatarFallback className="bg-pink-50 text-pink-500 font-bold">{mother.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-800 text-lg">{mother.name}</h3>
                  <Badge variant="secondary" className="text-[10px] font-bold bg-pink-50 text-pink-600 border-none rounded-full">{mother.trimester}</Badge>
                </div>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-400 font-bold">
                  <span className="flex items-center gap-1 font-black underline decoration-pink-200">الأسبوع {mother.gestationalWeek}</span>
                  <span className="text-pink-500 italic">{mother.healthStatus}</span>
                </div>
                <Progress value={(mother.gestationalWeek / 40) * 100} className="h-1.5 mt-3 bg-gray-100" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedMother} onOpenChange={() => setSelectedMother(null)}>
        <DialogContent className="max-w-2xl text-right p-0 rounded-[35px] overflow-hidden border-none shadow-2xl" dir="rtl">
          <DialogHeader className="p-6 bg-white border-b border-gray-50 flex flex-row items-center justify-between">
            <DialogTitle className="flex items-center gap-3 text-gray-800 font-black text-xl">
              <div className="bg-pink-100 p-2 rounded-full"><HeartPulse className="h-5 w-5 text-pink-500" /></div>
              {selectedMother?.name}
            </DialogTitle>
            <button 
              onClick={(e) => { e.stopPropagation(); generatePDF(selectedMother); }}
              className="ml-8 flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl font-bold text-xs hover:bg-emerald-100 transition-colors border border-emerald-100"
            >
              <Download className="h-4 w-4" /> تحميل PDF
            </button>
          </DialogHeader>

          <div className="px-6 py-6 bg-white overflow-y-auto max-h-[80vh]">
            <Tabs defaultValue="overview">
              <TabsList className="grid w-full grid-cols-4 mb-8 bg-gray-50 p-1.5 rounded-2xl h-12 font-bold">
                <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
                <TabsTrigger value="health">الصحة</TabsTrigger>
                <TabsTrigger value="nutrition">التغذية</TabsTrigger>
                <TabsTrigger value="progress">التقدم</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#F8F9FA] p-6 rounded-[30px] text-center border border-gray-100 shadow-sm">
                    <Calendar className="mx-auto h-6 w-6 text-gray-400 mb-2" />
                    <p className="text-2xl font-black text-gray-800">الأسبوع {selectedMother?.gestationalWeek}</p>
                    <p className="text-[12px] text-gray-400 font-bold">{selectedMother?.trimester}</p>
                  </div>
                  <div className="bg-[#F8F9FA] p-6 rounded-[30px] text-center border border-gray-100 shadow-sm">
                    <div className="bg-pink-100 w-6 h-6 rounded-full flex items-center justify-center mx-auto mb-2"><Baby className="h-4 w-4 text-pink-500" /></div>
                    <p className="text-xl font-black text-gray-800">{selectedMother?.dueDate ? new Date(selectedMother.dueDate).toLocaleDateString('en-CA') : "2026-07-10"}</p>
                    <p className="text-[12px] text-gray-400 font-bold italic">موعد الولادة المتوقع</p>
                  </div>
                </div>
                <div className="bg-[#F8F9FA] p-5 rounded-[28px] border border-gray-100 shadow-sm">
                  <p className="text-sm font-bold text-gray-800 mb-3">الزيارة القادمة</p>
                  <div className="flex items-center gap-3 text-emerald-600 font-black bg-white w-fit px-5 py-2 rounded-full shadow-sm border border-gray-50">
                    <Clock className="h-4 w-4" />
                    <span>{selectedMother?.nextVisitDate ? new Date(selectedMother.nextVisitDate).toLocaleDateString('en-CA') : "2026-04-01"}</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="health" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#F8F9FA] p-6 rounded-[30px] border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-gray-400 font-bold italic"><Scale className="h-4 w-4" /><span>الوزن</span></div>
                    <p className="text-2xl font-black text-gray-800">{selectedMother?.weight} كجم</p>
                  </div>
                  <div className="bg-[#F8F9FA] p-6 rounded-[30px] border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-gray-400 font-bold italic"><Activity className="h-4 w-4" /><span>ضغط الدم</span></div>
                    <p className="text-2xl font-black text-gray-800">{selectedMother?.bloodPressure || "120/80"}</p>
                  </div>
                </div>
                <div className="bg-[#F8F9FA] p-6 rounded-[30px] border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm font-bold text-gray-400 italic">الهيموجلوبين</p>
                    <p className="text-sm font-black text-gray-800">{selectedMother?.hemoglobin} g/dL</p>
                  </div>
                  <Progress value={((selectedMother?.hemoglobin || 0) / 15) * 100} className="h-2.5 bg-gray-200 rounded-full" />
                </div>
              </TabsContent>

              <TabsContent value="nutrition" className="space-y-6">
                <div className="bg-[#F8F9FA] p-6 rounded-[28px] border border-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2 text-gray-800 font-bold">
                      <Pill className="h-4 w-4 text-blue-400" /> <span>المكملات الغذائية</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="text" value={newSupp} onChange={(e) => setNewSupp(e.target.value)} placeholder="المكمل..." className="text-[10px] bg-white border border-gray-100 rounded-lg px-2 py-1 w-24 outline-none" />
                        <button onClick={() => { if(newSupp) { handleUpdateSupps([...selectedMother.supplements, newSupp]); setNewSupp(""); } }} className="text-[10px] bg-blue-50 text-blue-600 px-3 py-1 rounded-lg font-bold">إضافة</button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedMother?.supplements.map((s: string, i: number) => (
                      <Badge key={i} className="bg-white text-gray-600 border-none shadow-sm px-4 py-1.5 rounded-xl font-bold italic flex items-center gap-2 group">
                        {s} <X className="h-3 w-3 cursor-pointer text-gray-300 hover:text-red-500" onClick={() => handleUpdateSupps(selectedMother.supplements.filter((_: any, idx: number) => idx !== i))} />
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="bg-[#F8F9FA] p-6 rounded-[28px] border border-gray-50">
                  <div className="flex items-center gap-2 text-gray-800 font-bold mb-3"><Apple className="h-4 w-4 text-emerald-400" /><span>ملاحظات التغذية</span></div>
                  <div className="bg-white p-4 rounded-[20px] shadow-sm text-sm text-gray-500 font-black border border-gray-50 leading-relaxed">
                    {selectedMother?.nutritionNotes || "لا توجد ملاحظات."}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="progress" className="space-y-6">
                <div className="bg-blue-50/50 p-6 rounded-[30px] border border-blue-100 flex justify-between items-center">
                    <div><p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">وزن البداية</p><p className="text-2xl font-black text-gray-700">{selectedMother?.initialWeight} كجم</p></div>
                    <div className="text-left"><p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">الوزن الحالي</p><p className="text-2xl font-black text-gray-700">{selectedMother?.weight} كجم</p></div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-bold text-gray-700 flex items-center gap-2 text-sm italic mb-4"><TrendingUp className="h-4 w-4 text-pink-500" /> تحليل سجل الأوزان</h4>
                  <div className="grid gap-3">
                    {selectedMother?.weeklyWeightLog?.map((log: any, idx: number) => {
                      const status = getWeightStatus(log.week, log.weight, selectedMother.initialWeight);
                      return (
                        <div key={idx} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-pink-200 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center font-bold text-[10px] text-gray-400 border border-gray-100">W{log.week}</div>
                            <div><p className="text-sm font-black text-gray-800">{log.weight} كجم</p><p className="text-[10px] text-gray-400 font-bold italic">الأسبوع {log.week}</p></div>
                          </div>
                          <Badge className={`${status.color} ${status.bg} border shadow-none px-3 py-1 flex gap-1.5 items-center rounded-xl border-none font-bold text-[11px]`}>
                            {status.icon} {status.label}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function StatCard({ label, count, color, bgColor, num }: any) {
  return (
    <Card className="border-none shadow-sm rounded-[22px] overflow-hidden bg-white">
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black text-xl ${bgColor} ${color}`}>{num}</div>
        <div><p className="text-[10px] font-bold text-gray-400 italic">{label}</p><p className="text-2xl font-black text-gray-800">{count || 0}</p></div>
      </CardContent>
    </Card>
  )
}