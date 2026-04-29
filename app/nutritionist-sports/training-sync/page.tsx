"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { 
  Link2, 
  Users, 
  UserCircle, 
  Search, 
  BarChart3, 
  ChevronLeft, 
  Loader2,
  TrendingUp
} from "lucide-react"

export default function TrainingSyncPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>({ 
    athletes: [], 
    stats: { trainersCount: 0, linkedAthletesCount: 0 } 
  })
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchSyncData = async () => {
      try {
        const response = await fetch('/api/nutritionist-sports/training-sync')
        const result = await response.json()
        if (response.ok) {
          setData(result)
        }
      } catch (error) {
        console.error("Fetch Error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchSyncData()
  }, [])

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#f8fafc]">
      <Loader2 className="h-10 w-10 animate-spin text-[#107a54]" />
    </div>
  )

  const filteredAthletes = data.athletes.filter((a: any) => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] p-4 lg:p-8 text-right" dir="rtl">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0f172a]">ربط التدريب</h1>
          <p className="text-sm text-gray-400 font-bold mt-1 uppercase italic">تنسيق الأهداف بين التغذية والمدرب</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
        <StatCard 
          icon={<Link2 className="text-blue-600 w-6 h-6" />} 
          label="مدربين مرتبطين" 
          value={data.stats.trainersCount} 
          color="bg-blue-50" 
        />
        <StatCard 
          icon={<Users className="text-[#107a54] w-6 h-6" />} 
          label="رياضي مرتبط" 
          value={data.stats.linkedAthletesCount} 
          color="bg-emerald-50" 
        />
      </div>

      {/* Search Bar */}
      <div className="relative w-full mb-12">
        <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input 
          placeholder="ابحث عن رياضي بالاسم..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-16 pr-14 bg-white border-none shadow-sm rounded-[24px] font-black text-lg focus-visible:ring-2 focus-visible:ring-[#107a54]/20 transition-all" 
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Right Side: List */}
        <div className="space-y-4">
          <h2 className="text-xl font-black text-gray-800 flex items-center gap-2 mb-2 px-2">
            <UserCircle className="h-6 w-6 text-[#107a54]" /> قائمة الرياضيين
          </h2>
          <div className="grid gap-4">
            {filteredAthletes.map((athlete: any) => (
              <Card key={athlete._id} className={`border-none shadow-sm rounded-[24px] bg-white border-r-4 ${athlete.trainerId ? 'border-r-[#107a54]' : 'border-r-gray-200'}`}>
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 border-2 border-slate-50">
                      <AvatarFallback className="bg-slate-50 text-[#107a54] font-black text-lg">
                        {athlete.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-black text-[#0f172a] text-lg">{athlete.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase bg-slate-50 px-2 py-0.5 rounded-full">{athlete.sport}</span>
                        {athlete.trainerId && (
                          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                            <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full" /> مرتبط
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-black text-[#107a54] mb-1">{athlete.compliance}%</span>
                    <ChevronLeft className="h-5 w-5 text-gray-300" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Left Side: Analysis */}
        <div className="space-y-4">
          <h2 className="text-xl font-black text-gray-800 flex items-center gap-2 mb-2">
            <BarChart3 className="h-6 w-6 text-orange-500" /> تحليل الوزن والإنجاز
          </h2>
          <Card className="border-none shadow-sm rounded-[32px] bg-white p-8 lg:p-10 sticky top-8">
            <div className="space-y-8">
              {filteredAthletes.slice(0, 6).map((athlete: any) => (
                <div key={athlete._id}>
                  <div className="flex justify-between items-end mb-3">
                    <div>
                      <p className="font-black text-gray-800 text-base">{athlete.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold mt-0.5">
                        الحالي: <span className="text-gray-900">{athlete.currentWeight}kg</span> | 
                        الهدف: <span className="text-gray-900">{athlete.targetWeight}kg</span>
                      </p>
                    </div>
                    <span className="text-sm font-black text-[#107a54] flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" /> {athlete.compliance}%
                    </span>
                  </div>
                  <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                    <div 
                      className={`h-full transition-all duration-1000 ease-out ${
                        athlete.compliance >= 100 ? "bg-blue-500" : "bg-[#107a54]"
                      }`}
                      style={{ width: `${Math.min(athlete.compliance, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color }: any) {
  return (
    <Card className="border-none shadow-sm rounded-[24px] bg-white transition-all hover:scale-[1.02]">
      <CardContent className="p-7 flex items-center justify-between">
        <div>
          <p className="text-4xl font-black text-[#0f172a] mb-1">{value}</p>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">{label}</p>
        </div>
        <div className={`h-16 w-16 rounded-[20px] flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </CardContent>
    </Card>
  )
}