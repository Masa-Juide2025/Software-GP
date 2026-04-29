"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"

// استيراد الـ CSS هنا يمنع ظهور الخطأ في Next.js
import "leaflet/dist/leaflet.css"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, MapPin, Navigation, Clock, CheckCircle2, Map as MapIcon, Calendar, AlertCircle } from "lucide-react"
import { toast } from "sonner"

// استيراد الخريطة بشكل ديناميكي لضمان عملها في المتصفح فقط
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false })

export default function BookingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [subInfo, setSubInfo] = useState<any>(null)
  const [userLocation, setUserLocation] = useState("Nablus") 
  const [selectedProvider, setSelectedProvider] = useState("") 
  const [selectedTime, setSelectedTime] = useState("09:00 ص")
  const [isBooking, setIsBooking] = useState(false)
  const [bookedCenter, setBookedCenter] = useState<any>(null)
  const [position, setPosition] = useState<[number, number]>([32.2211, 35.2544])
  const [isClient, setIsClient] = useState(false)
  const [leafletLib, setLeafletLib] = useState<any>(null)
  const [ReactLeaflet, setReactLeaflet] = useState<any>(null)

  const timeSlots = ["09:00 ص", "11:30 ص", "02:00 م", "04:30 م"]

  useEffect(() => {
    setIsClient(true)
    Promise.all([
      import('leaflet'),
      import('react-leaflet')
    ]).then(([L, RL]) => {
      setLeafletLib(L.default)
      setReactLeaflet(RL)
    })
    
    const fetchData = async () => {
      try {
        const email = localStorage.getItem("userEmail")
        if (!email) return router.push("/login")
        const res = await fetch(`/api/subscriber/appointments/book?email=${email}`)
        const result = await res.json()
        if (result.success) setSubInfo(result.data)
      } catch (err) { 
        toast.error("خطأ في الاتصال بالسيرفر") 
      } finally { 
        setLoading(false) 
      }
    }
    fetchData()
  }, [router])

  const MapEvents = () => {
    if (!ReactLeaflet) return null;
    const { useMapEvents } = ReactLeaflet;
    useMapEvents({ 
      click(e: any) { setPosition([e.latlng.lat, e.latlng.lng]) } 
    })
    return null
  }

  const handleConfirm = async () => {
    if (!selectedProvider) return toast.error("يرجى اختيار المختص أولاً")
    setIsBooking(true)
    try {
      const response = await fetch("/api/subscriber/appointments/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriberEmail: localStorage.getItem("userEmail"),
          location: userLocation,
          appointmentTime: selectedTime,
          providerType: selectedProvider,
          lat: position[0],
          lng: position[1]
        })
      })
      const res = await response.json()
      if (res.success) {
        setBookedCenter(res.closest)
        toast.success(`تم الحجز في فرع: ${res.closest?.centerName}`)
      } else { 
        toast.error(res.error) 
      }
    } catch (err) { 
      toast.error("خطأ في الشبكة") 
    } finally { 
      setIsBooking(false) 
    }
  }

  const customIcon = (leafletLib && isClient) ? leafletLib.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  }) : null

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#f8f9fa]">
      <Loader2 className="animate-spin text-[#004d3d]" size={40} />
    </div>
  )

  const currentProviderData = selectedProvider === "trainer" ? subInfo?.trainer : subInfo?.nutritionist;

  // جلب تاريخ اليوم للمقارنة الذكية بالـ Slots
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-8 font-sans" dir="rtl">
      <div className="max-w-5xl mx-auto space-y-8 text-right">
        {/* الهيدر */}
        <div className="flex flex-col items-end border-r-4 border-[#004d3d] pr-4">
          <h1 className="text-3xl font-black text-gray-800">حجز موعد ذكي</h1>
          <p className="text-sm text-gray-500 italic font-medium">أهلاً {subInfo?.subscriberName}، حدد موقعك وسنختار لك الفرع الأنسب.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* العمود الجانبي */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="rounded-[25px] border-none shadow-sm bg-white overflow-hidden">
              <div className="bg-[#fbbf24] p-4 text-[#004d3d] font-black flex justify-between items-center">
                <span>تكنولوجيا الأقرب</span> <Navigation size={18} />
              </div>
              <CardContent className="p-5 text-[11px] text-gray-400 font-bold leading-relaxed">
                نقوم بحساب المسافة آلياً بين موقعك وأفرع المختص.
              </CardContent>
            </Card>

            {selectedProvider && currentProviderData && (
              <Card className="rounded-[25px] border-none shadow-md bg-white overflow-hidden animate-in slide-in-from-right duration-500">
                <div className="bg-[#004d3d] p-4 text-white font-black flex justify-between items-center">
                  <span>جدول المواعيد</span> <Calendar size={18} className="text-[#fbbf24]" />
                </div>
                <CardContent className="p-5 space-y-4 text-right">
                  <div>
                    <Label className="text-[10px] text-gray-400 font-bold block mb-1 underline">ساعات التواجد:</Label>
                    <p className="text-sm font-black text-[#004d3d] flex items-center gap-2 justify-end">
                      <Clock size={12} /> {currentProviderData.hours}
                    </p>
                  </div>
                  <div>
                    <Label className="text-[10px] text-gray-400 font-bold block mb-2 underline">أيام التواجد:</Label>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {currentProviderData.days.map((day: string) => (
                        <span key={day} className="px-2 py-1 bg-gray-50 text-[#004d3d] text-[9px] font-bold rounded-md border border-gray-100 uppercase">{day}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-dashed">
                    <Label className="text-[10px] text-red-500 font-bold block mb-2 flex items-center gap-1 justify-end">
                      <AlertCircle size={10} /> مواعيد محجوزة مسبقاً:
                    </Label>
                    <div className="space-y-1">
                      {currentProviderData.bookedSlots?.length > 0 ? currentProviderData.bookedSlots.map((slot: any, i: number) => (
                        <div key={i} className="flex justify-between items-center bg-red-50 p-2 rounded border border-red-100 shadow-sm">
                           <span className="text-[8px] font-black text-red-600">{slot.time}</span>
                           <span className="text-[8px] text-red-400 font-bold">{slot.date}</span>
                        </div>
                      )) : <p className="text-[9px] text-gray-400 italic text-center">لا يوجد حجوزات</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {bookedCenter && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-[20px] animate-in zoom-in duration-300">
                <div className="flex items-center gap-2 text-[#004d3d] mb-1">
                  <CheckCircle2 size={14} />
                  <span className="text-[11px] font-black">تم تحديد الفرع الأنسب:</span>
                </div>
                <p className="text-[12px] font-black text-gray-800 pr-5">{bookedCenter.centerName}</p>
                <p className="text-[10px] text-gray-500 pr-5 leading-tight mt-1">{bookedCenter.centerAddress}</p>
              </div>
            )}
          </div>

          {/* القسم الرئيسي */}
          <Card className="lg:col-span-3 rounded-[35px] border-none shadow-xl bg-white overflow-hidden">
            <CardContent className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <Label className="font-black">اختيار المختص</Label>
                  <Select onValueChange={setSelectedProvider}>
                    <SelectTrigger className="h-16 rounded-2xl border-2">
                      <SelectValue placeholder="اختر المدرب/الأخصائي" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      <SelectItem value="nutritionist" className="text-right py-3 font-bold">الأخصائي: {subInfo?.nutritionistName || "غير متوفر"}</SelectItem>
                      <SelectItem value="trainer" className="text-right py-3 font-bold">المدرب: {subInfo?.trainerName || "غير متوفر"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-4 text-right">
                  <Label className="font-black">المدينة (للبحث النصي)</Label>
                  <div className="relative">
                    <Input value={userLocation} onChange={(e) => setUserLocation(e.target.value)} className="h-16 text-right pr-14 rounded-2xl border-2 font-black text-[#004d3d]" />
                    <MapPin className="absolute right-5 top-5 h-6 w-6 text-[#004d3d]" />
                  </div>
                </div>
              </div>

              {/* الخريطة */}
              <div className="h-[280px] w-full rounded-[30px] overflow-hidden border-4 border-gray-50 relative z-0 shadow-inner">
                {isClient && ReactLeaflet && (
                  <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <MapEvents />
                    {customIcon && <Marker position={position} icon={customIcon} />}
                  </MapContainer>
                )}
              </div>

              {/* أوقات الحجز - التعديل هنا لربط التلوين بالتاريخ والوقت */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {timeSlots.map((time) => {
                  // الزر يغفل فقط إذا كان الموعد بنفس الوقت وبنفس تاريخ اليوم
                  const isBookedToday = currentProviderData?.bookedSlots?.some((s: any) => 
                    s.time === time && s.date === todayStr
                  );

                  return (
                    <Button 
                      key={time} 
                      disabled={isBookedToday}
                      variant={selectedTime === time ? "default" : "outline"} 
                      className={`h-14 rounded-2xl font-black transition-all ${isBookedToday ? "bg-gray-100 text-gray-300 border-dashed cursor-not-allowed" : (selectedTime === time ? "bg-[#004d3d] text-white shadow-lg" : "")}`} 
                      onClick={() => setSelectedTime(time)}
                    >
                      {time} {isBookedToday && "(محجوز)"}
                    </Button>
                  )
                })}
              </div>

              {/* زر الحجز */}
              <Button onClick={handleConfirm} disabled={isBooking || !selectedProvider} className="w-full bg-[#004d3d] h-20 font-black rounded-[20px] text-2xl shadow-2xl hover:bg-[#002d20] transition-all active:scale-95">
                {isBooking ? <Loader2 className="animate-spin" /> : "تأكيد الموعد واختيار الأقرب"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}