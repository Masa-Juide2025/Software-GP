"use client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash2, AlertTriangle } from "lucide-react"

export function DeleteConfirmDialog({ open, onOpenChange, onConfirm, loading }: any) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px] rounded-[25px] border-none p-6 font-sans" dir="rtl">
        <DialogHeader className="flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
            <AlertTriangle size={32} />
          </div>
          <DialogTitle className="text-xl font-black text-gray-800">تأكيد الحذف</DialogTitle>
          <DialogDescription className="text-center font-bold text-gray-500">
            هل أنت متأكد من حذف هذا المشترك؟ هذا الإجراء سيقوم بإزالة كافة البيانات نهائياً ولا يمكن التراجع عنه.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6 flex flex-row-reverse gap-3">
          <Button 
            onClick={onConfirm} 
            disabled={loading}
            className="flex-1 rounded-xl bg-red-500 font-bold hover:bg-red-600"
          >
            {loading ? "جاري الحذف..." : "نعم، احذف"}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="flex-1 rounded-xl border-slate-200 font-bold text-slate-500"
          >
            إلغاء الأمر
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}