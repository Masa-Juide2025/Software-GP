"use client"

import React, { useMemo, useEffect, useState } from "react"
import * as XLSX from 'xlsx'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend, LabelList
} from "recharts"
import { Button } from "@/components/ui/button"
import { Target, Scale, Calendar, Stethoscope, Loader2, Table } from "lucide-react"

export default function ReportsPage() {
  const [data, setData] = useState({ subscribers: [], nutritionists: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin/reports')
        const result = await response.json()
        if (response.ok) {
          setData({ subscribers: result.subscribers || [], nutritionists: result.nutritionists || [] })
        }
      } catch (error) { console.error(error) } finally { setLoading(false) }
    }
    fetchData()
  }, [])

  // --- حسابات البيانات ---
  const goalCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    data.subscribers?.forEach((s: any) => {
      const g = s.goal || "غير محدد"
      counts[g] = (counts[g] || 0) + 1
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [data.subscribers])

  const specCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    data.nutritionists?.forEach((n: any) => {
      const s = n.specialization || "تغذية عامة"
      counts[s] = (counts[s] || 0) + 1
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [data.nutritionists])

  const ageCounts = useMemo(() => {
    const groups = [{ name: "18-25", value: 0 }, { name: "26-35", value: 0 }, { name: "36-45", value: 0 }, { name: "46+", value: 0 }]
    data.subscribers?.forEach((s: any) => {
      const a = s.age || 0
      if (a >= 18 && a <= 25) groups[0].value++
      else if (a <= 35) groups[1].value++
      else if (a <= 45) groups[2].value++
      else if (a > 45) groups[3].value++
    })
    return groups
  }, [data.subscribers])

  const weightCounts = useMemo(() => {
    const ranges = [{ name: "تحت 60", value: 0 }, { name: "60-80", value: 0 }, { name: "80-100", value: 0 }, { name: "فوق 100", value: 0 }]
    data.subscribers?.forEach((s: any) => {
      const w = s.weight || 0
      if (w < 60) ranges[0].value++
      else if (w <= 80) ranges[1].value++
      else if (w <= 100) ranges[2].value++
      else ranges[3].value++
    })
    return ranges
  }, [data.subscribers])

  // --- وظيفة التصدير ---
  const exportToExcel = () => {
    const summaryData = [
      { "الفئة": "--- توزيع تخصصات الأخصائيين ---", "العدد": "" },
      ...specCounts.map(item => ({ "الفئة": item.name, "العدد": item.value })),
      { "الفئة": "", "العدد": "" },
      { "الفئة": "--- توزيع أهداف المشتركين ---", "العدد": "" },
      ...goalCounts.map(item => ({ "الفئة": item.name, "العدد": item.value })),
      { "الفئة": "", "العدد": "" },
      { "الفئة": "--- توزيع الأوزان ---", "العدد": "" },
      ...weightCounts.map(item => ({ "الفئة": item.name, "العدد": item.value })),
      { "الفئة": "", "العدد": "" },
      { "الفئة": "--- توزيع الفئات العمرية ---", "العدد": "" },
      ...ageCounts.map(item => ({ "الفئة": item.name, "العدد": item.value })),
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summaryData), "ملخص الإحصائيات");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data.subscribers), "المشتركين");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data.nutritionists), "الأخصائيين");
    XLSX.writeFile(wb, `تقرير_إحصائي_شامل_${new Date().toLocaleDateString('ar-EG')}.xlsx`);
  };

  const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#fb923c"]

  if (loading) return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      <p className="font-bold text-slate-600">جاري تحليل البيانات...</p>
    </div>
  )

  return (
    <div className="space-y-6 p-4 lg:p-8 bg-slate-50/30 min-h-screen" dir="rtl">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800">لوحة التقارير الإحصائية</h2>
          <p className="text-sm text-slate-500">تحليل الأعداد والتوزيعات في النظام</p>
        </div>
        <Button onClick={exportToExcel} className="bg-green-600 hover:bg-green-700 rounded-xl gap-2 shadow-lg">
          <Table className="w-4 h-4" /> تصدير إحصائيات 
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* الصف الأول: أهداف وتخصصات */}
        <Card className="rounded-[1.5rem] border-0 shadow-md bg-white">
          <CardHeader><CardTitle className="text-sm font-bold flex items-center gap-2"><Target className="h-4 w-4 text-rose-500" /> توزيع أهداف المشتركين</CardTitle></CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={goalCounts} innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value" label>
                  {goalCounts.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-[1.5rem] border-0 shadow-md bg-white">
          <CardHeader><CardTitle className="text-sm font-bold flex items-center gap-2"><Stethoscope className="h-4 w-4 text-indigo-500" /> توزيع تخصصات الأخصائيين</CardTitle></CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={specCounts} outerRadius={85} dataKey="value" label>
                  {specCounts.map((_, i) => <Cell key={i} fill={COLORS[(i+2)%COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* كرت الفئات العمرية - عريض */}
        <Card className="rounded-[1.5rem] border-0 shadow-md bg-white md:col-span-2">
          <CardHeader><CardTitle className="text-sm font-bold flex items-center gap-2"><Calendar className="h-4 w-4 text-emerald-500" /> توزيع الفئات العمرية</CardTitle></CardHeader>
          <CardContent className="h-80 pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageCounts}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} barSize={60}>
                  <LabelList dataKey="value" position="top" style={{ fontWeight: '800', fill: '#1e293b' }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* كرت توزيع الأوزان - عريض تحت الأعمار */}
        <Card className="rounded-[1.5rem] border-0 shadow-md bg-white md:col-span-2">
          <CardHeader><CardTitle className="text-sm font-bold flex items-center gap-2"><Scale className="h-4 w-4 text-blue-500" /> توزيع أوزان المشتركين</CardTitle></CardHeader>
          <CardContent className="h-80 pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weightCounts} margin={{ right: 30, left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} barSize={60}>
                  <LabelList dataKey="value" position="top" style={{ fontWeight: '800', fill: '#1e293b' }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}