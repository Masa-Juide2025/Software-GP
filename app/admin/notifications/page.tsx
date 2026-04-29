"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Bell,
  CheckCheck,
  Info,
  AlertTriangle,
  Calendar,
  Utensils,
  Trash2,
  Send,
  Loader2,
  Mail
} from "lucide-react"

// إعدادات الأيقونات بناءً على الموديول الخاص بك
const typeConfig: any = {
  general: { icon: <Info className="h-4 w-4" />, color: "bg-blue-100 text-blue-600", label: "عام" },
  weight_alert: { icon: <AlertTriangle className="h-4 w-4" />, color: "bg-amber-100 text-amber-600", label: "تنبيه وزن" },
  diet_plan: { icon: <Utensils className="h-4 w-4" />, color: "bg-emerald-100 text-emerald-600", label: "خطة غذائية" },
  appointment: { icon: <Calendar className="h-4 w-4" />, color: "bg-purple-100 text-purple-600", label: "موعد" },
}

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "unread">("all")
  const [isMounted, setIsMounted] = useState(false) // لحل مشكلة الـ Hydration

  // جلب البيانات من المسار الجديد: /api/admin/notifications
  const fetchNotifs = async () => {
    try {
      const res = await fetch('/api/admin/notifications') // تم تعديل المسار هنا
      if (!res.ok) throw new Error('Not Found')
      const data = await res.json()
      if (Array.isArray(data)) setNotifs(data)
    } catch (err) { 
      console.error("Fetch Error:", err)
    } finally { 
      setLoading(false) 
    }
  }

  useEffect(() => {
    setIsMounted(true)
    fetchNotifs()
  }, [])

  const filtered = filter === "unread" ? notifs.filter(n => !n.isRead) : notifs
  const unreadCount = notifs.filter(n => !n.isRead).length

  const handleToggleRead = async (id: string, currentStatus: boolean) => {
    setNotifs(prev => prev.map(n => n._id === id ? { ...n, isRead: !currentStatus } : n))
    await fetch('/api/admin/notifications', { // تم تعديل المسار هنا
      method: 'PATCH',
      body: JSON.stringify({ id, isRead: !currentStatus })
    })
  }

  const handleDelete = async (id: string) => {
    setNotifs(prev => prev.filter(n => n._id !== id))
    await fetch('/api/admin/notifications', { // تم تعديل المسار هنا
        method: 'PATCH', 
        body: JSON.stringify({ deleteId: id }) 
    })
  }

  // منع رندر التاريخ قبل ما التيرا تخلص (لحل Hydration Error)
  if (!isMounted) return null

  if (loading) return (
    <div className="flex h-[70vh] items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-[#10b981]" />
    </div>
  )

  return (
    <div className="p-4 lg:p-8 space-y-6 bg-[#f8fafc] min-h-screen" dir="rtl">
      <div className="text-right mb-6">
        <h1 className="text-3xl font-black text-[#1e293b]">الإشعارات</h1>
        <p className="text-slate-500 text-sm mt-1">إدارة التنبيهات من قاعدة بيانات النظام</p>
      </div>

      <Tabs defaultValue="inbox" className="w-full">
        <TabsList className="bg-white border w-full justify-start rounded-xl h-auto p-1 mb-8 space-x-reverse">
          <TabsTrigger value="inbox" className="rounded-lg px-8 py-3 flex gap-2 font-bold transition-all data-[state=active]:bg-slate-100">
            <Mail className="w-4 h-4" /> الواردة 
            {unreadCount > 0 && <Badge className="bg-[#10b981] mr-2">{unreadCount}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="send" className="rounded-lg px-8 py-3 flex gap-2 font-bold transition-all data-[state=active]:bg-slate-100">
            <Send className="w-4 h-4" /> إرسال تنبيه
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inbox" className="space-y-4">
          <div className="flex gap-2 mb-6">
            <Button 
                variant={filter === "all" ? "default" : "outline"} 
                onClick={() => setFilter("all")} 
                className={filter === "all" ? "bg-[#1e293b] rounded-xl" : "rounded-xl bg-white"}
            > 
                الكل ({notifs.length}) 
            </Button>
            <Button 
                variant={filter === "unread" ? "default" : "outline"} 
                onClick={() => setFilter("unread")} 
                className={filter === "unread" ? "bg-[#10b981] rounded-xl" : "rounded-xl bg-white"}
            > 
                غير مقروء ({unreadCount}) 
            </Button>
          </div>

          <div className="grid gap-3">
            {filtered.map((notif) => {
              const config = typeConfig[notif.type] || typeConfig.general
              return (
                <Card key={notif._id} className={`border-0 shadow-sm rounded-2xl transition-all ${!notif.isRead ? "bg-white border-r-4 border-r-[#10b981]" : "bg-white/60 opacity-80"}`}>
                  <CardContent className="p-5 flex items-start gap-4">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${config.color}`}>
                      {config.icon}
                    </div>
                    <div className="flex-1 text-right min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h4 className="font-black text-[#1e293b] text-base">{notif.title}</h4>
                          <p className="text-slate-600 text-sm">{notif.message}</p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <Button variant="ghost" size="icon" onClick={() => handleToggleRead(notif._id, notif.isRead)}>
                            <CheckCheck className={`w-5 h-5 ${notif.isRead ? "text-[#10b981]" : "text-slate-300"}`} />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(notif._id)} className="text-slate-300 hover:text-rose-500">
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-3 text-[10px] text-slate-400 font-medium">
                        {new Date(notif.createdAt).toLocaleString('ar-EG')}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {filtered.length === 0 && (
              <div className="text-center py-20 bg-white rounded-[2rem]">
                <Bell className="w-12 h-12 text-slate-100 mx-auto mb-3" />
                <p className="text-slate-400 font-bold">لا يوجد إشعارات لعرضها</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="send">
          <Card className="border-0 shadow-sm rounded-[2rem] bg-white p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-xl font-black text-[#1e293b]">إنشاء إشعار يدوي</CardTitle>
            </CardHeader>
            <CardContent className="px-0 space-y-6">
               {/* فورم الإرسال كما هو لديك */}
               <div className="grid md:grid-cols-2 gap-6 text-right">
                <div className="space-y-2">
                  <Label className="font-bold">عنوان الإشعار</Label>
                  <Input placeholder="أدخل العنوان..." className="rounded-xl h-12 bg-slate-50 border-0" />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">نوع التنبيه</Label>
                  <Select defaultValue="general">
                    <SelectTrigger className="rounded-xl h-12 bg-slate-50 border-0"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">عام</SelectItem>
                      <SelectItem value="weight_alert">تنبيه وزن</SelectItem>
                      <SelectItem value="diet_plan">خطة غذائية</SelectItem>
                      <SelectItem value="appointment">موعد</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2 text-right">
                <Label className="font-bold">محتوى الرسالة</Label>
                <Textarea placeholder="اكتب نص الإشعار هنا..." rows={4} className="rounded-2xl bg-slate-50 border-0" />
              </div>
              <Button className="bg-[#10b981] hover:bg-[#059669] text-white rounded-xl px-10 py-6 font-bold flex gap-2">
                <Send className="w-4 h-4" /> إرسال الإشعار
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}