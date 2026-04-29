"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, CheckCircle2 } from "lucide-react"
import { StepIndicator } from "@/components/register/step-indicator"
import { RegisterStep1, type Step1Data, type UserRole } from "@/components/register/step1-basic"
import { SubscriberStep, type SubscriberStepData } from "@/components/register/step2-subscriber"
import { SpecialistStep, type SpecialistStepData } from "@/components/register/step2-specialist"
import { Button } from "@/components/ui/button"

const stepLabels: Record<UserRole, string[]> = {
  subscriber: ["المعلومات الأساسية", "المعلومات الصحية"],
  nutritionist: ["المعلومات الأساسية", "المعلومات المهنية"],
  trainer: ["المعلومات الأساسية", "المعلومات المهنية"],
}

export default function RegisterPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submittedRole, setSubmittedRole] = useState<UserRole>("subscriber")

  const [step1Data, setStep1Data] = useState<Step1Data>({
    fullName: "",
    email: "",
    phone: "",
    userRole: "subscriber",
    gender: "" as Step1Data["gender"],
  })

  const [subscriberData, setSubscriberData] = useState<SubscriberStepData>({
    age: "",
    height: "",
    weight: "",
    goalWeight: "",
    goalType: "",
    diseases: "",
    allergies: "",
    password: "",
    confirmPassword: "",
  })

  const [specialistData, setSpecialistData] = useState<SpecialistStepData>({
    certificatesLink: "", 
    specialization: "",
    yearsOfExperience: "",
    description: "",
    workHoursFrom: "",
    workHoursTo: "",
    availableDays: [],
    maxSubscribers: "",
    password: "",
    confirmPassword: "",
  })

  const handleStep1Next = () => setCurrentStep(2)
  const handleBack = () => setCurrentStep(1)

  // ✅ 1. دالة إرسال بيانات المشترك (Subscriber)
  const handleSubscriberSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: step1Data.fullName,
          email: step1Data.email,
          phone: step1Data.phone,
          gender: step1Data.gender,
          userRole: "subscriber",
          // بيانات المشترك
          age: subscriberData.age,
          height: subscriberData.height,
          weight: subscriberData.weight,     // الوزن الحالي
          goalWeight: subscriberData.goalWeight, // الوزن المستهدف
          goalType: subscriberData.goalType,
          diseases: subscriberData.diseases,
          allergies: subscriberData.allergies,
          password: subscriberData.password,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "فشل التسجيل")

      setSubmittedRole("subscriber")
      setSubmitted(true)
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  // ✅ 2. دالة إرسال بيانات الأخصائي أو المدرب (Specialist)
  const handleSpecialistSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: step1Data.fullName,
          email: step1Data.email,
          phone: step1Data.phone,
          gender: step1Data.gender,
          userRole: step1Data.userRole,
          // البيانات المهنية
          specialization: specialistData.specialization,
          yearsOfExperience: specialistData.yearsOfExperience,
          description: specialistData.description,
          workHoursFrom: specialistData.workHoursFrom,
          workHoursTo: specialistData.workHoursTo,
          maxSubscribers: specialistData.maxSubscribers,
          certificatesLink: specialistData.certificatesLink, // رابط الدرايف
          availableDays: specialistData.availableDays,
          password: specialistData.password,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "فشل التسجيل")

      setSubmittedRole(step1Data.userRole)
      setSubmitted(true)
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    const isSubscriber = submittedRole === "subscriber"
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-8 text-right" dir="rtl">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/x.jpg')" }} />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative z-10 w-full flex justify-center">
          <Card className="w-full max-w-md text-center shadow-xl">
            <CardContent className="pt-8 pb-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              {isSubscriber ? (
                <>
                  <h2 className="mb-2 text-xl font-bold text-foreground">تم إنشاء حسابك بنجاح!</h2>
                  <p className="mb-6 text-sm text-muted-foreground">مرحباً بك في NutriSync AI. يمكنك الآن تسجيل الدخول والبدء.</p>
                  <Button onClick={() => router.push("/login")} className="w-full">تسجيل الدخول</Button>
                </>
              ) : (
                <>
                  <h2 className="mb-2 text-xl font-bold text-foreground">تم تقديم طلبك بنجاح!</h2>
                  <p className="mb-6 text-sm text-muted-foreground">سيتم مراجعة بياناتك المهنية من قبل الإدارة وتفعيل حسابك قريباً.</p>
                  <Button onClick={() => router.push("/")} variant="outline" className="w-full">العودة للرئيسية</Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-8 text-right" dir="rtl">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/x.jpg')" }} />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative z-10 flex w-full flex-col items-center">
        <Link href="/" className="mb-6 flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Heart className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-white">NutriSync AI</span>
        </Link>

        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-center text-lg">إنشاء حساب جديد</CardTitle>
            <div className="mt-3">
              <StepIndicator currentStep={currentStep} totalSteps={2} labels={stepLabels[step1Data.userRole]} />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {currentStep === 1 && (
              <RegisterStep1 data={step1Data} onChange={setStep1Data} onNext={handleStep1Next} />
            )}
            {currentStep === 2 && step1Data.userRole === "subscriber" && (
              <SubscriberStep data={subscriberData} onChange={setSubscriberData} onBack={handleBack} onSubmit={handleSubscriberSubmit} loading={loading} />
            )}
            {currentStep === 2 && (step1Data.userRole === "nutritionist" || step1Data.userRole === "trainer") && (
              <SpecialistStep data={specialistData} onChange={setSpecialistData} onBack={handleBack} onSubmit={handleSpecialistSubmit} loading={loading} role={step1Data.userRole} />
            )}
          </CardContent>
        </Card>

        <div className="mt-4 flex items-center gap-2 text-sm text-white">
          <span>لديك حساب بالفعل؟</span>
          <Link href="/login" className="font-medium hover:underline text-primary">تسجيل الدخول</Link>
        </div>
      </div>
    </div>
  )
}