"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Calendar, Target, Trophy, Loader2, Download } from "lucide-react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

export default function TrainerReportsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const email = localStorage.getItem("userEmail")
        const res = await fetch(`/api/trainer/reports?email=${email}`)
        const result = await res.json()
        if (result.success) setData(result)
      } catch (err) { console.error(err) } finally { setLoading(false) }
    }
    fetchReports()
  }, [])

  const handleDownload = async () => {
    if (!reportRef.current) return
    setDownloading(true)
    try {
      const canvas = await html2canvas(reportRef.current, { 
        scale: 3, 
        useCORS: true,
        backgroundColor: "#f8fafc" 
      })
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "mm", "a4")
      const width = pdf.internal.pageSize.getWidth()
      const height = (canvas.height * width) / canvas.width
      pdf.addImage(imgData, "PNG", 0, 0, width, height)
      pdf.save("NutriSync_Analytics.pdf")
    } catch (e) {
      console.error(e)
    } finally {
      setDownloading(false)
    }
  }

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
    </div>
  )

  // متغير لحساب إزاحة أجزاء الدائرة
  let cumulativePercent = 0;

  return (
    <div className="space-y-8 p-4 lg:p-8 text-right font-sans" dir="rtl">
      
      {/* Page Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-[24px] border shadow-sm no-print">
        <div className="text-right">
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Analytics Report</h2>
          <p className="text-sm text-slate-400 font-bold italic">NutriSync AI Professional Systems</p>
        </div>
        <Button 
          onClick={handleDownload} 
          disabled={downloading}
          className="bg-blue-600 text-white rounded-2xl h-12 px-8 font-black shadow-lg hover:bg-blue-700 transition-all"
        >
          {downloading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Download className="ml-2 h-4 w-4" />}
          DOWNLOAD PDF
        </Button>
      </div>

      {/* Main Report Design Area */}
      <div ref={reportRef} className="space-y-8 bg-slate-50 p-8 rounded-[40px] border">
        
        {/* Top Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          <StatCard icon={<Users className="h-8 w-8 text-blue-600"/>} label="TOTAL SUBSCRIBERS" value={data.stats.totalSubscribers} color="blue" />
          <StatCard icon={<Calendar className="h-8 w-8 text-emerald-600"/>} label="TOTAL APPOINTMENTS" value={data.stats.activeAppointments} color="green" />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Progress Card */}
          <Card className="rounded-[32px] border-none shadow-sm bg-white overflow-hidden border">
            <CardHeader className="bg-slate-50/50 border-b p-6 text-left">
              <CardTitle className="flex items-center gap-2 text-lg font-black text-slate-700 uppercase tracking-widest">
                <Trophy className="h-5 w-5 text-amber-500" /> GOAL PROGRESS
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-7">
              {data.subscriberProgress.map((sub: any, i: number) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between items-end font-black text-[11px] text-slate-500">
                    <span className="uppercase">{sub.name}</span>
                    <span className="text-blue-600">{Math.round(sub.progress)}%</span>
                  </div>
                  <Progress value={sub.progress} className="h-3 bg-slate-100 rounded-full" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Goal Distribution Card with THE SEGMENTED RING */}
          <Card className="rounded-[32px] border-none shadow-sm bg-white overflow-hidden border">
            <CardHeader className="bg-slate-50/50 border-b p-6 text-left">
              <CardTitle className="flex items-center gap-2 text-lg font-black text-slate-700 uppercase tracking-widest">
                <Target className="h-5 w-5 text-blue-500" /> GOAL DISTRIBUTION
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 flex flex-col items-center">
              
              {/* THE SINGLE RING - PART BLUE / PART GREEN */}
              <div className="relative h-48 w-48 mb-10 flex items-center justify-center">
                  <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    {/* Background Ring */}
                    <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#f1f5f9" strokeWidth="3.8" />
                    
                    {/* Colored Segments (Blue & Green) */}
                    {data.goalDistribution.map((goal: any, i: number) => {
                      const percentage = (goal.count / (data.stats.totalSubscribers || 1)) * 100;
                      const strokeDasharray = `${percentage} 100`;
                      const strokeDashoffset = -cumulativePercent;
                      cumulativePercent += percentage;
                      
                      return (
                        <circle
                          key={i}
                          cx="18" cy="18" r="15.9"
                          fill="transparent"
                          stroke={goal.color}
                          strokeWidth="3.8"
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                        />
                      );
                    })}
                  </svg>
                  
                  {/* Center Text */}
                  <div className="absolute text-center">
                      <span className="text-4xl font-black text-slate-800 leading-none">{data.stats.totalSubscribers}</span>
                      <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">Athletes</p>
                  </div>
              </div>

              {/* Goal Table */}
              <div className="w-full overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/50">
                <table className="w-full text-left border-collapse" dir="ltr">
                  <thead className="bg-[#0f172a] text-white text-[9px] uppercase tracking-[0.2em]">
                    <tr>
                      <th className="p-3 font-black">GOAL TYPE</th>
                      <th className="p-3 font-black text-center">COUNT</th>
                      <th className="p-3 font-black text-center">COLOR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.goalDistribution.map((goal: any, i: number) => (
                      <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-white transition-colors">
                        <td className="p-3 font-bold text-slate-600 text-xs uppercase">{goal.label}</td>
                        <td className="p-3 text-center">
                          <Badge variant="secondary" className="bg-white font-black border shadow-sm text-[10px] text-slate-900">{goal.count}</Badge>
                        </td>
                        <td className="p-3 flex justify-center">
                          <div className="w-4 h-4 rounded-full border shadow-sm" style={{ backgroundColor: goal.color }}></div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color }: any) {
  return (
    <Card className="border-none shadow-sm rounded-[28px] bg-white border border-slate-100 group">
      <CardContent className="p-8 flex items-center justify-between">
        <div className={`h-16 w-16 ${color === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'} rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>{icon}</div>
        <div className="text-left font-black">
          <p className="text-slate-400 text-[10px] uppercase mb-1 tracking-widest">{label}</p>
          <h3 className="text-5xl text-slate-800 tracking-tighter">{value}</h3>
        </div>
      </CardContent>
    </Card>
  )
}