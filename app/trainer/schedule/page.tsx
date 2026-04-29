"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar as CalendarIcon, Video, Loader2, Clock, CalendarDays, Plus, CheckCircle2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [appointments, setAppointments] = useState<any[]>([])
  const [availableDaysNames, setAvailableDaysNames] = useState<string[]>([]) 
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false) // حالة رسالة النجاح

  // القيم المسموحة من الموديل تبعك
  const allowedTypes = [
    "متابعة أسبوعية",
    "استشارة أولى",
    "تحديث خطة غذائية",
    "جلسة تدريب"
  ]

  const [formData, setFormData] = useState({
    subscriberName: "",
    time: "",
    type: "متابعة أسبوعية", // القيمة الافتراضية
    date: "" 
  })

  const fetchScheduleData = async () => {
    setIsLoading(true)
    const email = localStorage.getItem("userEmail")
    const y = selectedDate.getFullYear()
    const m = String(selectedDate.getMonth() + 1).padStart(2, '0')
    const d = String(selectedDate.getDate()).padStart(2, '0')
    const dateStr = `${y}-${m}-${d}`
    
    try {
      const res = await fetch(`/api/appointments?email=${email}&date=${dateStr}`)
      const data = await res.json()
      if (data.success) {
        setAppointments(data.appointments || [])
        setAvailableDaysNames(data.availableDays || [])
      }
    } catch (err) { console.error(err) } finally { setIsLoading(false) }
  }

  useEffect(() => { fetchScheduleData() }, [selectedDate])

  const handleAddAppointment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    const email = localStorage.getItem("userEmail")
    
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, email })
      })
      const data = await res.json()

      if (data.success) {
        setIsDialogOpen(false)
        setShowSuccessModal(true) // إظهار تصميم النجاح
        setFormData({ subscriberName: "", time: "", type: "متابعة أسبوعية", date: "" })
        fetchScheduleData() 
      } else {
        alert("خطأ: " + data.error)
      }
    } catch (err) { console.error(err) } finally { setIsSaving(false) }
  }

  const getFilteredDays = () => {
    const days = []
    const today = new Date()
    const start = new Date(today.setDate(today.getDate() - today.getDay()))
    for (let i = 0; i < 14; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      const dayEn = d.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
      days.push({ date: d, isWorkDay: availableDaysNames.includes(dayEn) })
    }
    return days
  }

  return (
    <div className="p-6 space-y-6 text-right font-arabic" dir="rtl">
      {/* رسالة النجاح المصممة بعناية */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full mx-4 shadow-2xl text-center relative animate-in zoom-in-95 duration-300">
            <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="text-emerald-600 w-12 h-12" />
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-2">تم الحفظ بنجاح!</h2>
            <p className="text-gray-500 font-medium mb-8">تمت إضافة الموعد الجديد إلى جدولك بنجاح.</p>
            <Button 
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 rounded-2xl font-bold text-lg shadow-lg shadow-emerald-200"
            >
              موافق
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-800">جدول المواعيد</h1>
          <p className="text-muted-foreground text-sm font-medium mt-1">إدارة الجلسات والمشتركين</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#059669] hover:bg-[#047857] gap-2 font-bold px-6 py-6 rounded-2xl shadow-lg transition-all hover:scale-105">
              <Plus className="h-5 w-5" /> موعد جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px] text-right rounded-[2.5rem] p-8 border-none" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-gray-800 text-right">إضافة موعد جديد</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddAppointment} className="space-y-5 mt-6">
              <div className="space-y-2 text-right">
                <label className="text-sm font-black text-gray-600 mr-1">اسم المشترك</label>
                <Input required value={formData.subscriberName} onChange={(e)=>setFormData({...formData, subscriberName: e.target.value})} placeholder="مثال: أمير محمد" className="rounded-2xl border-gray-100 h-12 focus:ring-emerald-500" />
              </div>
              <div className="space-y-2 text-right">
                <label className="text-sm font-black text-gray-600 mr-1">التاريخ</label>
                <Input required type="date" value={formData.date} onChange={(e)=>setFormData({...formData, date: e.target.value})} className="rounded-2xl border-gray-100 h-12 focus:ring-emerald-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 text-right">
                  <label className="text-sm font-black text-gray-600 mr-1">الوقت</label>
                  <Input required placeholder="9:00 ص" value={formData.time} onChange={(e)=>setFormData({...formData, time: e.target.value})} className="rounded-2xl border-gray-100 h-12 focus:ring-emerald-500" />
                </div>
                <div className="space-y-2 text-right">
                  <label className="text-sm font-black text-gray-600 mr-1">النوع</label>
                  <select 
                    className="w-full border border-gray-100 p-2 rounded-2xl text-sm h-12 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                    value={formData.type} 
                    onChange={(e)=>setFormData({...formData, type: e.target.value})}
                  >
                    {allowedTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <Button disabled={isSaving} type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 py-7 rounded-2xl font-black text-lg mt-4 shadow-xl shadow-emerald-100 transition-all active:scale-95">
                {isSaving ? <Loader2 className="animate-spin" /> : "حفظ الموعد"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* شريط الأيام */}
      <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
        <CardHeader className="py-4 border-b flex flex-row justify-between items-center px-8 bg-gray-50/30">
          <div className="flex items-center gap-2 text-[#059669]">
            <CalendarDays className="h-5 w-5" />
            <span className="font-bold text-gray-700">{selectedDate.toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' })}</span>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {getFilteredDays().map((item, i) => {
              const isSelected = item.date.toDateString() === selectedDate.toDateString()
              return (
                <div key={i} onClick={() => setSelectedDate(new Date(item.date))}
                  className={`cursor-pointer min-w-[90px] p-5 rounded-[1.8rem] transition-all border-2 text-center ${
                    isSelected ? "bg-[#059669] text-white border-[#059669] shadow-xl scale-105" : 
                    item.isWorkDay ? "bg-white text-emerald-600 border-emerald-100" : "bg-gray-50 text-gray-300 border-transparent opacity-60"
                  }`}>
                  <div className="text-[11px] mb-1 font-bold">{item.date.toLocaleDateString('ar-EG', { weekday: 'short' })}</div>
                  <div className="text-2xl font-black">{item.date.getDate()}</div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="border-none shadow-sm min-h-[500px] rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="border-b p-8">
              <CardTitle className="text-xl font-black flex items-center gap-3 text-gray-800">
                <Clock className="text-[#059669] h-6 w-6" />
                مواعيد {selectedDate.toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' })}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-600 h-10 w-10" /></div>
              ) : appointments.length > 0 ? (
                appointments.map((app) => (
                  <div key={app._id} className="flex justify-between items-center p-6 border rounded-[2rem] bg-white shadow-sm border-gray-100 transition-all hover:border-emerald-500 group">
                    <div className="flex items-center gap-6">
                      <Badge className="bg-emerald-50 text-emerald-700 border-none px-4 py-1.5 rounded-xl font-bold">{app.status}</Badge>
                      <div className="text-right">
                        <h3 className="font-black text-xl text-gray-800 group-hover:text-emerald-600 transition-colors">{app.subscriberName}</h3>
                        <p className="text-sm text-gray-400 font-bold mt-1 flex items-center gap-1"><Video size={14} className="text-emerald-500" /> {app.type}</p>
                      </div>
                    </div>
                    <div className="text-4xl font-black text-emerald-600 pr-8 border-r-2 border-gray-50">{app.time}</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-32 text-gray-300 flex flex-col items-center">
                   <CalendarIcon className="mx-auto mb-4 opacity-10" size={64} />
                   <p className="font-black text-xl">لا توجد مواعيد لهذا اليوم</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-[#059669] text-white rounded-[2.2rem] p-8 shadow-emerald-100">
            <h3 className="text-lg font-bold opacity-90 mb-4">ملخص اليوم</h3>
            <div className="text-7xl font-black">{appointments.length}</div>
          </Card>
          <Card className="border-none shadow-sm rounded-[2.2rem] bg-white overflow-hidden">
             <CardHeader className="bg-gray-50/50 p-6 border-b"><CardTitle className="text-base font-bold text-gray-700 flex items-center gap-2"><CalendarDays size={18} className="text-emerald-600"/> أيام العمل</CardTitle></CardHeader>
             <CardContent className="p-6 flex flex-wrap gap-2">
                {availableDaysNames.map(day => <Badge key={day} className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg capitalize font-bold">{day}</Badge>)}
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}