"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle2,
  XCircle,
  Clock,
  UtensilsCrossed,
  Dumbbell,
  Eye,
  User,
  Mail,
  Phone,
  Briefcase,
  CalendarDays,
  FileCheck,
  ExternalLink,
} from "lucide-react"

const roleLabels: Record<string, { label: string; icon: any }> = {
  nutritionist: { label: "أخصائي تغذية", icon: UtensilsCrossed },
  trainer: { label: "مدرب رياضي", icon: Dumbbell },
}

const statusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  pending: { label: "قيد الانتظار", variant: "outline" },
  approved: { label: "مقبول", variant: "default" },
  rejected: { label: "مرفوض", variant: "destructive" },
}

export default function PendingRequestsPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{ type: "approve" | "reject"; request: any } | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("/api/admin/requests")
        const data = await res.json()

        if (res.ok) {
          setRequests(
            data.map((item: any) => ({
              id: item._id,
              name: item.fullName || item.name || "بدون اسم",
              email: item.email || "غير متوفر",
              phone: item.phone || "غير مسجل",
              role: item.role || "nutritionist",
              status: item.status || "pending",
              specialization: item.specialization || "غير محدد",
              experience: item.experienceYears || 0,
              bio: item.bio || "",
              // دمج حقلي الشهادات لضمان القراءة من أي مصدر متاح
              certificateUrl: item.certificateUrl || item.certificates || "",
              workingHours: `${item.workingHoursFrom || "00:00"} - ${item.workingHoursTo || "00:00"}`,
              availableDays: item.availableDays || [],
              maxSubscribers: item.maxSubscribers,
            }))
          )
        }
      } catch (error) {
        console.error("Error fetching requests:", error)
      }
    }

    fetchRequests()
  }, [])

  const handleAction = async (type: "approve" | "reject") => {
    if (!confirmAction) return

    try {
      const res = await fetch("/api/admin/requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: confirmAction.request.id,
          decision: type === "approve" ? "approved" : "rejected",
        }),
      })

      if (res.ok) {
        setRequests((prev) =>
          prev.map((r) =>
            r.id === confirmAction.request.id
              ? { ...r, status: type === "approve" ? "approved" : "rejected" }
              : r
          )
        )
        setDetailOpen(false)
        setConfirmAction(null)
      } else {
        const errorData = await res.json()
        alert(errorData.error || "حدث خطأ")
      }
    } catch (error) {
      console.error("Action error:", error)
    }
  }

  const filteredRequests = requests.filter((r) => {
    if (activeTab === "all") return true
    if (activeTab === "nutritionist") return r.role === "nutritionist"
    if (activeTab === "trainer") return r.role === "trainer"
    if (activeTab === "approved") return r.status === "approved"
    if (activeTab === "rejected") return r.status === "rejected"
    return true
  })

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col gap-2 text-right" dir="rtl">
        <h2 className="text-2xl font-bold text-gray-800">طلبات الانضمام</h2>
        <p className="text-muted-foreground text-sm">إدارة مراجعة طلبات الأخصائيين والمدربين الجدد.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" dir="rtl">
        <Card className="bg-orange-50/50 border-orange-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-orange-100 rounded-lg text-orange-600"><Clock size={24} /></div>
            <div>
              <p className="text-2xl font-bold">{requests.filter(r => r.status === "pending").length}</p>
              <p className="text-xs text-orange-700">طلبات تحتاج مراجعة</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl">
          <TabsTrigger value="all">الكل</TabsTrigger>
          <TabsTrigger value="nutritionist">أخصائيين</TabsTrigger>
          <TabsTrigger value="trainer">مدربين</TabsTrigger>
          <TabsTrigger value="approved">مقبولين</TabsTrigger>
          <TabsTrigger value="rejected">مرفوضين</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6 space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed">
              <User className="mx-auto text-gray-300 mb-2" size={48} />
              <p className="text-gray-500">لا توجد طلبات في هذا القسم حالياً</p>
            </div>
          ) : (
            filteredRequests.map((request) => {
              const RoleIcon = roleLabels[request.role]?.icon || User
              const status = statusConfig[request.status]
              return (
                <Card key={request.id} className="overflow-hidden hover:border-primary/30 transition-all">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row items-center p-4 gap-4 text-right" dir="rtl">
                      <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
                        <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">
                          {request.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-1">
                        <h4 className="font-bold text-lg">{request.name}</h4>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="font-normal gap-1">
                            <RoleIcon size={12} /> {roleLabels[request.role]?.label}
                          </Badge>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => { setSelectedRequest(request); setDetailOpen(true); }}>
                          <Eye size={16} className="ml-2" /> التفاصيل
                        </Button>
                        
                        {request.status === "pending" && (
                          <>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => setConfirmAction({ type: "approve", request })}>
                              <CheckCircle2 size={16} className="ml-2" /> قبول
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => setConfirmAction({ type: "reject", request })}>
                              <XCircle size={16} className="ml-2" /> رفض
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto text-right" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2 justify-end">
              تفاصيل طلب الانضمام <Briefcase className="text-primary" />
            </DialogTitle>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h5 className="font-bold border-b pb-1 text-primary">المعلومات الشخصية (المرحلة 1)</h5>
                  <p className="flex items-center gap-2 text-sm justify-start"><User size={14}/> <b>الاسم:</b> {selectedRequest.name}</p>
                  <p className="flex items-center gap-2 text-sm justify-start"><Mail size={14}/> <b>الايميل:</b> {selectedRequest.email}</p>
                  <p className="flex items-center gap-2 text-sm justify-start"><Phone size={14}/> <b>الهاتف:</b> {selectedRequest.phone}</p>
                </div>
                <div className="space-y-3">
                  <h5 className="font-bold border-b pb-1 text-primary">المعلومات المهنية (المرحلة 2)</h5>
                  <p className="text-sm"><b>التخصص:</b> {selectedRequest.specialization}</p>
                  <p className="text-sm"><b>سنوات الخبرة:</b> {selectedRequest.experience} سنوات</p>
                  <p className="text-sm"><b>ساعات العمل:</b> {selectedRequest.workingHours}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h5 className="font-bold border-b pb-1 text-primary">النبذة التعريفية</h5>
                <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg">{selectedRequest.bio || "لا توجد نبذة"}</p>
              </div>

              {/* قسم عرض الشهادات والوثائق المدمج */}
              <div className="space-y-2">
                <h5 className="font-bold border-b pb-1 text-primary flex items-center gap-2 justify-start">
                  <FileCheck size={16} /> الوثائق والشهادات المهنية
                </h5>
                {selectedRequest.certificateUrl ? (
                  <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <span className="text-sm text-blue-800 font-medium">ملف الشهادات والاعتمادات المرفوع</span>
                    <Button 
                      variant="link" 
                      className="text-blue-600 hover:text-blue-800 gap-1 h-auto p-0 font-bold"
                      onClick={() => window.open(selectedRequest.certificateUrl, "_blank")}
                    >
                      عرض الملف <ExternalLink size={14} />
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-lg text-center italic">لم يتم توفير روابط شهادات</p>
                )}
              </div>

              <div className="space-y-2">
                <h5 className="font-bold border-b pb-1 text-primary flex items-center gap-2 justify-start">
                  <CalendarDays size={16} /> أيام التوافر
                </h5>
                <div className="flex flex-wrap gap-2 justify-start">
                  {selectedRequest.availableDays?.length > 0 ? (
                    selectedRequest.availableDays.map((day: string) => (
                      <Badge key={day} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{day}</Badge>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">لم يتم تحديد أيام</span>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailOpen(false)}>إغلاق</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <DialogContent className="sm:max-w-[400px] text-right" dir="rtl">
          <DialogHeader>
            <DialogTitle>{confirmAction?.type === "approve" ? "قبول طلب الانضمام" : "رفض طلب الانضمام"}</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من {confirmAction?.type === "approve" ? "قبول" : "رفض"} طلب <b>{confirmAction?.request.name}</b>؟
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 justify-start">
            <Button variant="ghost" onClick={() => setConfirmAction(null)}>تراجع</Button>
            <Button 
              variant={confirmAction?.type === "approve" ? "default" : "destructive"}
              className={confirmAction?.type === "approve" ? "bg-green-600 hover:bg-green-700" : ""}
              onClick={() => handleAction(confirmAction?.type === "approve" ? "approve" : "reject")}
            >
              تأكيد القرار
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}