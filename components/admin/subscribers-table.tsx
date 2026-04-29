"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Search, MoreVertical, Eye, Trash2, AlertTriangle, Apple, Dumbbell } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

import { SubscriberDetailDialog } from "./subscriber-detail-dialog"

// --- مكون مودال تأكيد الحذف المخصص ---
function DeleteConfirmDialog({ open, onOpenChange, onConfirm, loading }: any) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px] rounded-[25px] border-none p-6 font-sans shadow-2xl" dir="rtl">
        <DialogHeader className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
            <AlertTriangle size={32} />
          </div>
          <DialogTitle className="text-xl font-black text-gray-800">تأكيد الحذف النهائي</DialogTitle>
          <DialogDescription className="text-center font-bold text-gray-500 leading-relaxed">
            هل أنت متأكد من حذف هذا المشترك؟ سيتم مسح كافة البيانات من النظام نهائياً.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6 flex flex-row-reverse gap-3 w-full">
          <Button 
            onClick={onConfirm} 
            disabled={loading}
            className="flex-1 rounded-xl bg-red-500 font-black hover:bg-red-600 h-11 transition-all"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "نعم، احذف المشترك"}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="flex-1 rounded-xl border-slate-200 font-black text-slate-500 h-11"
          >
            إلغاء
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function SubscribersTable() {
  const [subscribers, setSubscribers] = useState<any[]>([]) 
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const [selectedSub, setSelectedSub] = useState<any>(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [activeFetchId, setActiveFetchId] = useState<string | null>(null)

  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [targetDeleteId, setTargetDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/admin/subscribers")
        if (!res.ok) throw new Error("Failed to fetch")
        const data = await res.json()
        setSubscribers(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Error:", error)
        setSubscribers([])
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleViewProfile = async (userId: string) => {
    setActiveFetchId(userId)
    try {
      const res = await fetch(`/api/admin/subscribers?id=${userId}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setSelectedSub(data)
      setIsViewOpen(true)
    } catch (error) {
      alert("حدث خطأ في جلب البيانات")
    } finally {
      setActiveFetchId(null)
    }
  }

  const triggerDelete = (id: string) => {
    setTargetDeleteId(id)
    setIsDeleteOpen(true)
  }

  const confirmDeletion = async () => {
    if (!targetDeleteId) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/admin/subscribers?id=${targetDeleteId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setSubscribers((prev) => prev.filter((sub) => sub.id !== targetDeleteId))
        setIsDeleteOpen(false)
      } else {
        alert("فشل الحذف من السيرفر")
      }
    } catch (error) {
      alert("خطأ في الاتصال")
    } finally {
      setIsDeleting(false)
      setTargetDeleteId(null)
    }
  }

  const filtered = subscribers.filter((sub) => {
    const name = sub.name || ""
    return name.toLowerCase().includes(search.toLowerCase()) || sub.phone?.includes(search)
  })

  if (loading) return (
    <div className="flex h-64 items-center justify-center gap-2">
      <Loader2 className="h-8 w-8 animate-spin text-[#107c41]" />
      <span className="font-bold text-muted-foreground font-sans text-lg">جاري التحميل...</span>
    </div>
  )

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex px-1">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="البحث بالاسم أو رقم الهاتف..." 
            className="pr-10 text-right font-bold rounded-xl border-slate-300 h-12 shadow-sm text-md" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>
      </div>

      <div className="rounded-2xl border-2 border-slate-100 bg-white overflow-hidden shadow-md">
        <Table>
          <TableHeader className="bg-slate-50/80">
            <TableRow className="border-b-2 border-slate-100">
              <TableHead className="text-right font-black text-slate-900 py-5 px-6 text-md">المشترك</TableHead>
              <TableHead className="text-right font-black text-slate-900 text-md">الباقة</TableHead>
              <TableHead className="text-center font-black text-slate-900 text-md">BMI</TableHead>
              <TableHead className="text-right font-black text-slate-900 text-md">الأخصائي</TableHead>
              <TableHead className="text-right font-black text-slate-900 text-md">المدرب</TableHead>
              <TableHead className="text-right font-black text-slate-900 text-md text-center">الحالة</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody className="font-sans text-right">
            {filtered.map((sub) => (
              <TableRow key={sub.id} className="hover:bg-slate-50/50 transition-colors border-b last:border-0">
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-11 w-11 border-2 border-white shadow-sm">
                      <AvatarFallback className="bg-[#ecfdf5] text-[#107c41] font-black">
                        {(sub.name || "??").substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-[15px] font-black text-slate-900 leading-tight">{sub.name}</span>
                      <span className="text-[12px] text-slate-500 font-bold">{sub.phone}</span>
                    </div>
                  </div>
                </TableCell>
                
                {/* عمود الباقة: خط غامق، كبير، وغير مائل */}
                <TableCell>
                  <span className="text-lg font-black text-slate-800 tracking-tight uppercase">
                    {sub.package || sub.plan || "VIP"}
                  </span>
                </TableCell>

                <TableCell className="text-center">
                  <span className="font-black text-slate-900 text-md">{sub.bmi || "--"}</span>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2 text-slate-800 font-black text-[13px]">
                    <Apple size={16} className="text-red-600" />
                    <span>{sub.nutritionistName || "لم يحدد"}</span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2 text-slate-800 font-black text-[13px]">
                    <Dumbbell size={16} className="text-blue-600" />
                    <span>{sub.trainerName || "لم يحدد"}</span>
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  <span className="bg-[#107c41] text-white px-4 py-1.5 rounded-full text-[12px] font-black shadow-sm">
                    نشط
                  </span>
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-slate-200 rounded-full">
                        {activeFetchId === sub.id ? <Loader2 className="h-5 w-5 animate-spin text-[#107c41]" /> : <MoreVertical className="h-6 w-6 text-slate-400" />}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="text-right font-sans min-w-[180px] rounded-xl shadow-2xl border-slate-100">
                      <DropdownMenuItem onClick={() => handleViewProfile(sub.id)} className="flex-row-reverse gap-3 cursor-pointer font-black py-3 hover:bg-slate-50 text-slate-700">
                        <Eye className="h-5 w-5 text-[#107c41]" /> عرض الملف الكامل
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => triggerDelete(sub.id)}
                        className="flex-row-reverse gap-3 cursor-pointer text-red-600 font-black py-3 hover:bg-red-50"
                      >
                        <Trash2 className="h-5 w-5" /> حذف من النظام
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <SubscriberDetailDialog 
        subscriber={selectedSub} 
        open={isViewOpen} 
        onOpenChange={setIsViewOpen} 
      />

      <DeleteConfirmDialog 
        open={isDeleteOpen} 
        onOpenChange={setIsDeleteOpen} 
        onConfirm={confirmDeletion}
        loading={isDeleting}
      />
    </div>
  )
}