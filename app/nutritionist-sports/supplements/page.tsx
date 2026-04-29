"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Zap, Plus, Search, Clock, Pill, Calendar } from "lucide-react"

interface SupplementType {
  _id: string;
  supplementName: string;
  dosage: string;
  timing: string;
  purpose: string;
  startDate?: string;
  createdAt?: string; 
  subscriberId?: {
    fullName?: string;
    name?: string;
  };
}

export default function SupplementsPage() {
  const [supplements, setSupplements] = useState<SupplementType[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  
  const [formData, setFormData] = useState({ supplementName: "", dosage: "", timing: "", purpose: "" })
  const [editingId, setEditingId] = useState<string | null>(null)

  const fetchSupplements = async () => {
    try {
      const res = await fetch("/api/nutritionist-sports/supplements")
      const data = await res.json()
      setSupplements(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSupplements() }, [])

  const handleSubmit = async () => {
    const method = editingId ? "PATCH" : "POST"
    const body = editingId ? { id: editingId, ...formData } : { 
        ...formData, 
        subscriberId: "69bb3fee8e5a47bec3a9cf86", 
        nutritionistId: "69a771de5b1dbb2c32b4f99c" 
    }

    const res = await fetch("/api/nutritionist-sports/supplements", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      setOpen(false)
      setEditingId(null)
      setFormData({ supplementName: "", dosage: "", timing: "", purpose: "" })
      fetchSupplements()
    }
  }

  const startEdit = (sup: SupplementType) => {
    setEditingId(sup._id)
    setFormData({ supplementName: sup.supplementName, dosage: sup.dosage, timing: sup.timing, purpose: sup.purpose })
    setOpen(true)
  }

  const formatDate = (sup: SupplementType) => {
    const dateSource = sup.startDate || sup.createdAt;
    if (!dateSource) return "قيد المعالجة";
    const date = new Date(dateSource);
    return isNaN(date.getTime()) ? "تاريخ غير صالح" : date.toLocaleDateString('ar-EG');
  }

  return (
    <div className="space-y-8" dir="rtl">
      {/* العنوان وزر الإضافة */}
      <div className="flex items-center justify-between">
        <div className="text-right">
          <h1 className="text-3xl font-bold">{"المكملات الرياضية"}</h1>
          <p className="text-muted-foreground text-base">{"إدارة ومتابعة المكملات الغذائية للرياضيين"}</p>
        </div>
        
        <Dialog open={open} onOpenChange={(val) => { setOpen(val); if(!val) setEditingId(null); }}>
          <DialogTrigger asChild>
            <Button className="bg-[#10b981] hover:bg-[#059669] text-white gap-2 px-6 py-6 text-lg">
              <Plus className="h-5 w-5" /> {"اضافة مكمل"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle className="text-center text-xl">{editingId ? "تعديل مكمل" : "إضافة مكمل جديد"}</DialogTitle></DialogHeader>
            <div className="space-y-5 py-4">
              <Input placeholder="اسم المكمل" value={formData.supplementName} onChange={(e)=>setFormData({...formData, supplementName:e.target.value})} className="text-right h-12 text-lg" />
              <Input placeholder="الجرعة" value={formData.dosage} onChange={(e)=>setFormData({...formData, dosage:e.target.value})} className="text-right h-12 text-lg" />
              <Input placeholder="التوقيت" value={formData.timing} onChange={(e)=>setFormData({...formData, timing:e.target.value})} className="text-right h-12 text-lg" />
              <Input placeholder="الغرض" value={formData.purpose} onChange={(e)=>setFormData({...formData, purpose:e.target.value})} className="text-right h-12 text-lg" />
              <Button onClick={handleSubmit} className="w-full bg-[#10b981] h-12 text-lg">{editingId ? "حفظ التعديلات" : "إضافة للسجل"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* الكروت الإحصائية - تم الإبقاء على إحصائية الكتالوج فقط */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "مكمل في الكتالوج", val: supplements.length, icon: Pill, color: "text-blue-500", bg: "bg-blue-50" },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}><stat.icon className="h-6 w-6" /></div>
              <div className="text-right">
                <p className="text-2xl font-bold">{stat.val}</p>
                <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* محتوى الكتالوج */}
      <div className="mt-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-emerald-700 border-b-2 border-emerald-500 pb-1">{"كتالوج المكملات"}</h2>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="بحث..." value={search} onChange={(e)=>setSearch(e.target.value)} className="pl-10 text-right h-11 text-base" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {supplements.filter(s => s.supplementName.toLowerCase().includes(search.toLowerCase())).map((sup) => (
            <Card key={sup._id} className="border-none shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="text-right">
                    <h3 className="font-bold text-xl mb-1">{sup.supplementName}</h3>
                    {/* تم حذف "عام" وإظهار الاسم فقط إن وجد */}
                    {sup.subscriberId?.fullName && (
                      <p className="text-xs text-blue-600 font-semibold">{"للمشترك: "}{sup.subscriberId.fullName}</p>
                    )}
                  </div>
                  <div className="h-14 w-14 bg-gray-50 rounded-xl flex items-center justify-center text-3xl">
                      {sup.supplementName.toLowerCase().includes("whey") ? "💪" : "💊"}
                  </div>
                </div>

                <div className="space-y-3 text-right">
                  <div className="flex items-center gap-3 justify-end text-muted-foreground text-[14px] font-medium">
                    <span>{sup.dosage}</span> <Pill className="h-4 w-4 text-emerald-500 rotate-45" />
                  </div>
                  <div className="flex items-center gap-3 justify-end text-muted-foreground text-[14px] font-medium">
                    <span>{sup.timing}</span> <Clock className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div className="flex items-center gap-3 justify-end text-muted-foreground text-[14px] font-medium">
                    <span>{sup.purpose}</span> <Zap className="h-4 w-4 text-emerald-500 fill-emerald-500" />
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t flex items-center justify-between">
                  <div className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                      <Calendar className="h-4 w-4" />
                      {formatDate(sup)}
                  </div>
                  <div className="flex gap-2">
                      <Badge className="bg-emerald-50 text-emerald-600 border-none text-xs px-3">{"نشط"}</Badge>
                      <Button onClick={() => startEdit(sup)} variant="ghost" size="sm" className="h-8 text-xs border px-4 font-semibold">{"تعديل"}</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}