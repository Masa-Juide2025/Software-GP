"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Heart,
  Star,
  Loader2,
  UtensilsCrossed,
  Dumbbell,
  ArrowLeft,
  CheckCircle2,
  UserX,
} from "lucide-react"
import { cn } from "@/lib/utils"

const goalLabels: Record<string, string> = {
  "lose_weight": "انقاص الوزن",
  "weight_loss": "انقاص الوزن",
  "gain_weight": "زيادة الوزن",
  "maintain": "الحفاظ على الوزن",
  "build_muscle": "متابعة تغذية رياضي ",
  "improve_health": "تحسين الصحة العامة",
  "Follow-up of a diabetic patient": "متابعة مريض سكري",
  "Monitoring a patient with high blood pressure": "متابعة مريض ضغط",
  "Follow-up of a kidney patient": "متابعة مريض كلى",
  "breastfeeding": "تغذية مرضعة",
  "Monitoring pregnant woman's nutrition": "متابعة تغذية الحامل",
  "Treatment of childhood obesity": "علاج سمنة الطفل",
}

function getInitials(name: string) {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function SpecialistCard({ spec, isSelected, onSelect, roleColor, roleIcon: RoleIcon, roleLabel }: any) {
  // فحص إذا كان العدد مكتملاً
  const isFull = (spec.availableSlots || 0) <= 0;

  return (
    <Card
      className={cn(
        "relative transition-all duration-300 rounded-[25px] overflow-hidden border-2",
        isFull 
          ? "opacity-60 grayscale-[0.6] cursor-not-allowed border-slate-200 bg-slate-50/50 shadow-none" 
          : "cursor-pointer border-slate-100 hover:border-[#107c41]/30 hover:shadow-md bg-white",
        isSelected && !isFull && "border-[#107c41] shadow-xl bg-[#107c41]/5 scale-[1.02]"
      )}
      onClick={() => !isFull && onSelect()}
    >
      {isFull ? (
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-red-500 text-white border-none rounded-full px-3 py-1 text-[10px] font-black">
            <UserX className="w-3 h-3 ml-1 inline" /> تم اكتمال العدد
          </Badge>
        </div>
      ) : spec.isRecommended && (
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-[#107c41] text-white border-none rounded-full px-3 py-1 text-[10px] font-black animate-pulse">
            مناسب لهدفك
          </Badge>
        </div>
      )}

      {isSelected && !isFull && (
        <div className="absolute right-3 top-3 z-10">
          <CheckCircle2 className="h-6 w-6 text-[#107c41] fill-white" />
        </div>
      )}

      <CardContent className="p-6 text-right">
        <div className="mb-4 flex items-center gap-4 flex-row-reverse">
          <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
            <AvatarFallback className={cn("text-lg font-black", isFull ? "bg-slate-200 text-slate-400" : roleColor)}>
              {getInitials(spec.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-lg font-black text-slate-800">{spec.name}</h3>
            <div className="mt-1 flex items-center justify-end gap-2">
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-amber-700">{spec.rating || "4.9"}</span>
              </div>
              <Badge variant="outline" className={cn("text-[10px] font-black border-none px-2 py-1 rounded-lg", isFull ? "bg-slate-100 text-slate-400" : roleColor)}>
                <RoleIcon className="ml-1 h-3 w-3" />
                {roleLabel}
              </Badge>
            </div>
          </div>
        </div>
        <p className={cn("mb-2 text-sm font-black", isFull ? "text-slate-400" : "text-[#107c41]")}>{spec.specialization}</p>
        <p className="mb-4 text-[12px] leading-relaxed text-slate-500 line-clamp-2 font-medium">{spec.bio}</p>
        
        <div className="grid grid-cols-3 gap-2 rounded-2xl bg-slate-50 p-3" dir="rtl">
          <div className="flex flex-col items-center border-l border-slate-200">
            <span className="text-sm font-black text-slate-700">{spec.experience}</span>
            <span className="text-[9px] font-bold text-slate-400">خبرة</span>
          </div>
          <div className="flex flex-col items-center border-l border-slate-200">
            <span className="text-sm font-black text-slate-700">{spec.activeSubscribers}</span>
            <span className="text-[9px] font-bold text-slate-400">مشترك</span>
          </div>
          <div className="flex flex-col items-center">
            <span className={cn("text-sm font-black", isFull ? "text-red-500" : "text-[#107c41]")}>
              {isFull ? "0" : spec.availableSlots}
            </span>
            <span className="text-[9px] font-bold text-slate-400">متاح</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SelectionWrapper() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [nutritionists, setNutritionists] = useState<any[]>([])
  const [trainers, setTrainers] = useState<any[]>([])
  const [subscriberGoal, setSubscriberGoal] = useState("")
  const [selectedNutritionist, setSelectedNutritionist] = useState<string | null>(null)
  const [selectedTrainer, setSelectedTrainer] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const email = searchParams.get("email") || (typeof window !== 'undefined' ? localStorage.getItem("userEmail") : "");
      
      if (!email || email === "null") {
        setLoading(false);
        return;
      }

      try {
        // إضافة t= لكسر الكاش وضمان أحدث أرقام للأعداد المتاحة
        const res = await fetch(`/api/subscriber/suggested-experts?email=${encodeURIComponent(email)}&t=${new Date().getTime()}`, {
           cache: 'no-store'
        });
        const data = await res.json()
        
        if (data && data.hasSelectedExperts) {
          setIsRedirecting(true);
          router.replace("/subscriber");
          return;
        }

        if (data) {
          setNutritionists(data.nutritionists || [])
          setTrainers(data.trainers || [])
          setSubscriberGoal(data.userGoal || "lose_weight")
        }
      } catch (err) {
        console.error("Fetch error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [searchParams, router])

  const chosenNutritionist = nutritionists.find((s) => s.id === selectedNutritionist)
  const chosenTrainer = trainers.find((s) => s.id === selectedTrainer)
  const hasSelection = selectedNutritionist || selectedTrainer

  const handleConfirm = async () => {
    setIsSubmitting(true)
    try {
      const email = searchParams.get("email") || localStorage.getItem("userEmail") || "";
      const res = await fetch("/api/subscriber/select-experts", {
        method: "POST",
        body: JSON.stringify({ 
          nutritionistId: selectedNutritionist,
          trainerId: selectedTrainer, 
          email: email
        }),
        headers: { "Content-Type": "application/json" }
      })
      if (res.ok) {
        setDone(true)
      } else {
        const errData = await res.json()
        alert(errData.error || "فشل حفظ الاختيارات")
      }
    } catch (err) {
      console.error("Submission error:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading || isRedirecting) return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-[#fafbfc]">
      <div className="relative">
        <Loader2 className="h-14 w-14 animate-spin text-[#107c41]" />
        <Heart className="h-6 w-6 text-[#107c41] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <p className="font-black text-slate-600 text-lg animate-pulse">جاري التحقق من التوافر...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#fafbfc] font-sans pb-32" dir="rtl">
      <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur-md h-20 flex items-center">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#107c41] shadow-lg text-white">
              <Heart className="h-5 w-5" />
            </div>
            <span className="text-xl font-black text-slate-800">NutriSync Ai <span className="text-[#107c41]">Pro</span></span>
          </div>
          <Badge className="bg-[#107c41]/10 text-[#107c41] border-none px-4 py-2 rounded-2xl font-black shadow-sm">
            الهدف الحالي: {goalLabels[subscriberGoal] || "جاري التحديد..."}
          </Badge>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-black text-slate-800 italic">اختر فريقك المتخصص</h1>
          <p className="mt-3 text-lg font-bold text-slate-400">
            برامج مخصصة لهدفك في <span className="text-[#107c41]">{goalLabels[subscriberGoal]}</span>
          </p>
        </div>

        <section className="mb-16">
          <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-2">🍎 أخصائيي التغذية</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {nutritionists.map((spec) => (
              <SpecialistCard
                key={spec.id}
                spec={spec}
                isSelected={selectedNutritionist === spec.id}
                onSelect={() => setSelectedNutritionist(spec.id === selectedNutritionist ? null : spec.id)}
                roleColor="bg-green-50 text-green-700"
                roleLabel="أخصائي تغذية"
                roleIcon={UtensilsCrossed}
              />
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-2">💪 المدربين الرياضيين</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {trainers.map((spec) => (
              <SpecialistCard
                key={spec.id}
                spec={spec}
                isSelected={selectedTrainer === spec.id}
                onSelect={() => setSelectedTrainer(spec.id === selectedTrainer ? null : spec.id)}
                roleColor="bg-blue-50 text-blue-700"
                roleLabel="مدرب رياضي"
                roleIcon={Dumbbell}
              />
            ))}
          </div>
        </section>

        <div className="fixed bottom-8 left-0 right-0 px-6 z-50">
          <div className="mx-auto max-w-md">
            <Button
              size="lg"
              disabled={!hasSelection || isSubmitting}
              onClick={() => setConfirmOpen(true)}
              className="w-full rounded-[25px] bg-[#107c41] py-8 text-xl font-black hover:bg-[#0b5e31] shadow-2xl transition-all"
            >
              {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : "تأكيد فريقي المختار"}
              <ArrowLeft className="mr-3 h-6 w-6" />
            </Button>
          </div>
        </div>
      </main>

      <Dialog open={confirmOpen && !done} onOpenChange={setConfirmOpen}>
        <DialogContent className="rounded-[35px] p-8 font-sans text-right" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-slate-800">تأكيد الاختيار</DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-4">
             {chosenNutritionist && (
               <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center justify-between flex-row-reverse">
                 <span className="font-black text-slate-700">{chosenNutritionist.name}</span>
                 <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">🍎 أخصائي تغذية</span>
               </div>
             )}
             {chosenTrainer && (
               <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center justify-between flex-row-reverse">
                 <span className="font-black text-slate-700">{chosenTrainer.name}</span>
                 <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">💪 مدرب رياضي</span>
               </div>
             )}
          </div>
          <DialogFooter className="flex gap-4">
             <Button onClick={handleConfirm} disabled={isSubmitting} className="flex-1 bg-[#107c41] py-6 font-black rounded-2xl">
               {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : "تأكيد"}
             </Button>
             <Button variant="outline" onClick={() => setConfirmOpen(false)} className="flex-1 py-6 font-bold rounded-2xl">تعديل</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={done}>
        <DialogContent className="rounded-[40px] p-10 text-center font-sans shadow-2xl" dir="rtl" onPointerDownOutside={(e) => e.preventDefault()}>
           <DialogHeader className="hidden"><DialogTitle>تم بنجاح</DialogTitle></DialogHeader>
           <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={50} className="text-green-600" />
           </div>
           <h2 className="text-3xl font-black mb-3 text-slate-800">تم بنجاح!</h2>
           <p className="text-lg text-slate-500 font-bold mb-8">لقد بدأنا رحلتك الجديدة مع فريقك المختار.</p>
           <Button onClick={() => router.replace("/subscriber")} className="w-full rounded-[20px] bg-[#107c41] py-8 font-black text-xl">دخول لوحة التحكم</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function ChooseSpecialistPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center font-black text-[#107c41]">جاري التحميل...</div>}>
      <SelectionWrapper />
    </Suspense>
  )
}