"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation" 
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Dumbbell, 
  Apple, 
  CheckCircle2, 
  CreditCard, 
  Zap,
  Loader2,
  Trophy 
} from "lucide-react"
import { toast } from "sonner"
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog"

function SubscriptionContent() {
  const [hasTrainer, setHasTrainer] = useState(false)
  const [hasNutritionist, setHasNutritionist] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const [showSuccess, setShowSuccess] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    // تظهر الرسالة فقط عند العودة من Stripe بنجاح
    if (searchParams.get("success") === "true") {
      setShowSuccess(true)
      
      // تنظيف الرابط للحفاظ على نظافة الـ URL
      const timer = setTimeout(() => {
        router.replace("/subscriber/subscriptions")
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [searchParams, router])

  const calculatePrice = () => {
    if (hasTrainer && hasNutritionist) return 400
    if (hasTrainer || hasNutritionist) return 200
    return 0
  }

  const totalPrice = calculatePrice()

  const handleSubscribe = async () => {
    if (totalPrice === 0) {
        toast.error("يرجى اختيار خدمة واحدة على الأقل")
        return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/subscriber/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalPrice }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error(data.error || "فشل في الحصول على رابط الدفع")
        setLoading(false)
      }
    } catch (err) {
      console.error("Checkout error:", err)
      toast.error("حدث خطأ في الاتصال بالسيرفر")
      setLoading(false)
    }
  }

  return (
    <div className="p-4 lg:p-10 min-h-screen bg-[#f8fafc]" dir="rtl">
      
      {/* نافذة النجاح مع حل مشكلة Accessibility */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-[400px] rounded-[2.5rem] p-0 overflow-hidden border-none bg-white shadow-2xl">
          
          {/* هاد الجزء بيحل المشكلة اللي بالصورة (مخفي بس موجود للكود) */}
          <div className="sr-only">
            <DialogTitle>نجاح الدفع</DialogTitle>
            <DialogDescription>تم تفعيل اشتراكك بنجاح في فيت لايف برو</DialogDescription>
          </div>

          <div className="bg-[#10b981] p-10 text-center relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="relative z-10 flex justify-center">
              <div className="bg-white rounded-full p-4 shadow-lg">
                <Trophy className="w-12 h-12 text-[#10b981]" />
              </div>
            </div>
            <h2 className="text-3xl font-black text-white mt-6 relative z-10">تم الدفع بنجاح!</h2>
          </div>
          <div className="p-8 text-center space-y-6">
            <p className="text-slate-600 font-bold text-lg leading-relaxed">
              مبروك! لقد تم تفعيل باقتك بنجاح. فريق NutriSync AI مستعد لبدء الرحلة معك الآن.
            </p>
            <Button 
              onClick={() => setShowSuccess(false)}
              className="w-full bg-[#1e293b] hover:bg-[#0f172a] text-white h-14 rounded-2xl font-black text-lg transition-all"
            >
              ابدأ الآن
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* الهيدر */}
        <div className="text-right space-y-2">
          <h1 className="text-4xl font-black text-[#1e293b]">تفعيل الاشتراك</h1>
          <p className="text-slate-500 font-medium">اختر الخدمات التي ترغب بالانضمام إليها لبدء رحلتك</p>
        </div>

        {/* الكروت */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card 
            className={`border-2 transition-all cursor-pointer rounded-[2rem] overflow-hidden ${hasTrainer ? "border-[#10b981] bg-white shadow-xl" : "border-transparent bg-white/50"}`}
            onClick={() => setHasTrainer(!hasTrainer)}
          >
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={`h-16 w-16 rounded-2xl flex items-center justify-center ${hasTrainer ? "bg-[#10b981] text-white" : "bg-slate-100 text-slate-400"}`}>
                  <Dumbbell className="w-8 h-8" />
                </div>
                <Checkbox checked={hasTrainer} className="h-6 w-6 rounded-full border-slate-200" />
              </div>
              <h3 className="text-xl font-black text-[#1e293b] mb-2">مدرب رياضي شخصي</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                خطة تمارين مخصصة، متابعة أداء يومية، وتوجيه مباشر من كبار المدربين.
              </p>
              <div className="text-[#10b981] font-bold">200 شيكل / شهرياً</div>
            </CardContent>
          </Card>

          <Card 
            className={`border-2 transition-all cursor-pointer rounded-[2rem] overflow-hidden ${hasNutritionist ? "border-[#10b981] bg-white shadow-xl" : "border-transparent bg-white/50"}`}
            onClick={() => setHasNutritionist(!hasNutritionist)}
          >
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={`h-16 w-16 rounded-2xl flex items-center justify-center ${hasNutritionist ? "bg-[#10b981] text-white" : "bg-slate-100 text-slate-400"}`}>
                  <Apple className="w-8 h-8" />
                </div>
                <Checkbox checked={hasNutritionist} className="h-6 w-6 rounded-full border-slate-200" />
              </div>
              <h3 className="text-xl font-black text-[#1e293b] mb-2">أخصائي تغذية معتمد</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                أنظمة غذائية مرنة، حساب سعرات دقيق، ومتابعة قياسات الجسم أسبوعياً.
              </p>
              <div className="text-[#10b981] font-bold">200 شيكل / شهرياً</div>
            </CardContent>
          </Card>
        </div>

        {/* ملخص الفاتورة */}
        <Card className="border-0 shadow-2xl rounded-[2.5rem] bg-[#1e293b] text-white overflow-hidden">
          <CardContent className="p-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-right space-y-4">
                <h2 className="text-2xl font-black flex items-center gap-3">
                  <Zap className="text-yellow-400 fill-yellow-400" /> ملخص الاشتراك المختارة
                </h2>
                <div className="space-y-2">
                  {hasTrainer && <div className="flex items-center gap-2 text-slate-300"><CheckCircle2 className="w-4 h-4 text-[#10b981]" /> التدريب الرياضي</div>}
                  {hasNutritionist && <div className="flex items-center gap-2 text-slate-300"><CheckCircle2 className="w-4 h-4 text-[#10b981]" /> المتابعة الغذائية</div>}
                  {!hasTrainer && !hasNutritionist && <p className="text-slate-400 italic">يرجى اختيار خدمة لبدء الحساب</p>}
                </div>
              </div>

              <div className="bg-white/10 p-8 rounded-[2rem] text-center min-w-[240px] border border-white/10">
                <p className="text-slate-400 text-sm font-bold mb-1">المبلغ الإجمالي</p>
                <div className="text-5xl font-black text-white mb-6">
                  {totalPrice} <span className="text-lg font-medium text-[#10b981]">شيكل</span>
                </div>
                <Button 
                  onClick={handleSubscribe}
                  disabled={totalPrice === 0 || loading}
                  className="w-full bg-[#10b981] hover:bg-[#059669] text-white h-14 rounded-xl font-black text-lg gap-2 shadow-lg"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <><CreditCard className="w-5 h-5" /> تأكيد وتفعيل الآن</>}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function SubscriptionSelectionPage() {
  return (
    <Suspense fallback={<div>جاري التحميل...</div>}>
      <SubscriptionContent />
    </Suspense>
  )
}