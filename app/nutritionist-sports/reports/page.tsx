"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip } from "recharts"
import { Users, Trophy, Download, FileText, BarChart3, Loader2, Star } from "lucide-react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import html2canvas from "html2canvas"
import ExcelJS from "exceljs"
import { saveAs } from "file-saver"

export default function ReportsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const chartOnlyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch('/api/nutritionist-sports/reports');
        const json = await res.json();
        setData(json);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    loadData();
  }, []);

  const exportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("NutriSync Analytics");

    worksheet.mergeCells('A1:D1');
    const mainTitle = worksheet.getCell('A1');
    mainTitle.value = "NutriSync AI - Performance Analytics Report";
    mainTitle.font = { bold: true, size: 16, color: { argb: 'FF107A54' } };
    mainTitle.alignment = { horizontal: 'center' };

    const today = new Date().toLocaleDateString('en-GB');
    worksheet.addRow([`Generated on: ${today}`]);
    worksheet.addRow([`Total Athletes: ${data?.totalAthletes}`]);
    worksheet.addRow([]);

    if (chartOnlyRef.current) {
      const canvas = await html2canvas(chartOnlyRef.current as HTMLElement, { scale: 2 });
      const base64 = canvas.toDataURL("image/png");
      const imageId = workbook.addImage({ base64: base64, extension: 'png' });
      worksheet.addImage(imageId, {
        tl: { col: 0.5, row: 4 },
        ext: { width: 450, height: 220 }
      });
      for(let i=0; i<13; i++) worksheet.addRow([]);
    }

    const goalHeader = worksheet.addRow(["Sport Type", "Athletes Count"]);
    goalHeader.eachCell((cell: any) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF107A54' } };
      cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
    });

    data?.sportDistribution.forEach((s: any) => worksheet.addRow([s.sport, s.count]));
    worksheet.addRow([]);

    const subHeader = worksheet.addRow(["Rank", "Name", "Sport", "Progress %"]);
    subHeader.eachCell((cell: any) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF107A54' } };
      cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
    });

    data?.topPerformers.forEach((p: any, i: number) => {
      worksheet.addRow([i === 0 ? "1 (TOP ⭐)" : i + 1, p.name, p.sport, p.progress]);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "NutriSync-Report.xlsx");
  };

  const exportPDF = async () => {
    const doc = new jsPDF();
    
    // العنوان الرئيسي
    doc.setFontSize(20);
    doc.setTextColor(15, 23, 42);
    doc.text("NutriSync AI - Analytics Report", 105, 20, { align: "center" });
    
    // إضافة "إجمالي الرياضيين" في الـ PDF
    const pdfDate = new Date().toLocaleDateString('en-GB');
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text(`Report Date: ${pdfDate}`, 20, 32);
    doc.text(`Total Active Athletes: ${data?.totalAthletes}`, 20, 40); // السطر الجديد المطلوب

    if (chartOnlyRef.current) {
      const canvas = await html2canvas(chartOnlyRef.current as HTMLElement, { scale: 3, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/png");
      doc.addImage(imgData, 'PNG', 15, 50, 180, 75); 
    }
    
    autoTable(doc, {
      startY: 135,
      head: [['Rank', 'Name', 'Sport', 'Progress']],
      body: data?.topPerformers.map((p: any, i: number) => [
        i === 0 ? `* TOP 1 *` : `#${i + 1}`,
        p.name + (i === 0 ? " *" : ""),
        p.sport,
        `${p.progress}%`
      ]),
      headStyles: { fillColor: [16, 122, 84], halign: 'center' },
      styles: { halign: 'center' }
    });
    doc.save("NutriSync-Official-Report.pdf");
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-[#107a54]" /></div>;

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] p-6 lg:p-8 text-right" dir="rtl">
      
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#0f172a]">التقارير الإحصائية</h1>
          <p className="text-sm text-gray-400 font-bold mt-1 uppercase italic">تحليل البيانات والأداء</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={exportPDF} variant="outline" className="font-black border-2 rounded-xl px-6 h-12 shadow-sm hover:bg-white">
            <FileText className="ml-2 h-4 w-4 text-red-500" /> تصدير PDF
          </Button>
          <Button onClick={exportExcel} className="bg-[#107a54] hover:bg-[#0d6344] font-black rounded-xl px-8 h-12 text-white shadow-lg">
            <Download className="ml-2 h-4 w-4" /> تصدير Excel
          </Button>
        </div>
      </div>

      {/* بطاقة إجمالي الرياضيين في الموقع */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-none shadow-sm bg-white border-r-4 border-r-blue-500 rounded-2xl">
          <CardContent className="flex items-center gap-5 p-6">
            <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-3xl font-black text-gray-900 leading-none">{data?.totalAthletes}</p>
              <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-widest">إجمالي الرياضيين</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Card className="lg:col-span-8 border-none shadow-sm rounded-[32px] bg-white p-6">
          <CardHeader className="pr-0 pt-0 mb-4">
            <CardTitle className="flex items-center gap-2 font-black text-gray-800">
              <BarChart3 className="h-5 w-5 text-[#107a54]" /> توزيع الأهداف
            </CardTitle>
          </CardHeader>
          <div ref={chartOnlyRef} className="h-[250px] w-full bg-white" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.sportDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="sport" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 'bold' }} />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={45}>
                  {data?.sportDistribution.map((_: any, i: number) => (
                    <Cell key={i} fill={['#107a54', '#3b82f6', '#f59e0b', '#ef4444'][i % 4]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="lg:col-span-4 border-none shadow-sm rounded-[32px] bg-white overflow-hidden p-6">
          <h2 className="text-lg font-black text-gray-800 flex items-center gap-2 mb-4"><Trophy className="h-5 w-5 text-yellow-500" /> أفضل المشتركين</h2>
          <div className="divide-y divide-slate-50">
            {data?.topPerformers.map((p: any, i: number) => (
              <div key={i} className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3 text-right">
                  <div className="relative">
                    <Avatar className={`h-10 w-10 border shadow-sm ${i === 0 ? 'ring-2 ring-yellow-400' : ''}`}>
                      <AvatarFallback className="bg-emerald-50 text-[#107a54] font-black text-xs">{p.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    {i === 0 && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 absolute -top-2 -right-2" />}
                  </div>
                  <div>
                    <p className="font-black text-gray-900 text-xs">{p.name} {i === 0 && '⭐'}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase">{p.sport}</p>
                  </div>
                </div>
                <p className="text-sm font-black text-[#107a54]">{p.progress}%</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}