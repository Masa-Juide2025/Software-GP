"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Loader2, ArrowRight, Link2, Info } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SpecialistStepData {
  certificatesLink: string
  specialization: string
  yearsOfExperience: string
  description: string
  workHoursFrom: string
  workHoursTo: string
  availableDays: string[]
  maxSubscribers: string
  password: string
  confirmPassword: string
}

interface SpecialistStepProps {
  data: SpecialistStepData
  onChange: (data: SpecialistStepData) => void
  onBack: () => void
  onSubmit: () => void
  loading: boolean
  role: "nutritionist" | "trainer"
}

const daysOfWeek = [
  { value: "sunday", label: "الأحد" },
  { value: "monday", label: "الاثنين" },
  { value: "tuesday", label: "الثلاثاء" },
  { value: "wednesday", label: "الأربعاء" },
  { value: "thursday", label: "الخميس" },
  { value: "friday", label: "الجمعة" },
  { value: "saturday", label: "السبت" },
]

export function SpecialistStep({ data, onChange, onBack, onSubmit, loading, role }: SpecialistStepProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const roleLabel = role === "nutritionist" ? "أخصائي تغذية" : "مدرب رياضي"

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!data.certificatesLink.trim()) errs.certificatesLink = "رابط الشهادات مطلوب"
    else if (!/^https?:\/\/.+/.test(data.certificatesLink.trim())) errs.certificatesLink = "يرجى ادخال رابط صحيح يبدأ بـ https://"
    if (!data.specialization.trim()) errs.specialization = "التخصص مطلوب"
    if (!data.yearsOfExperience) errs.yearsOfExperience = "سنوات الخبرة مطلوبة"
    if (!data.description.trim()) errs.description = "الوصف مطلوب"
    if (!data.workHoursFrom || !data.workHoursTo) errs.workHours = "ساعات العمل مطلوبة"
    if (data.availableDays.length === 0) errs.availableDays = "يرجى اختيار يوم واحد على الأقل"
    if (!data.maxSubscribers) errs.maxSubscribers = "الحد الأقصى للمشتركين مطلوب"
    if (!data.password || data.password.length < 6) errs.password = "كلمة المرور يجب ان تكون 6 أحرف على الأقل"
    if (data.password !== data.confirmPassword) errs.confirmPassword = "كلمتا المرور غير متطابقتين"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) onSubmit()
  }

  const toggleDay = (day: string) => {
    const updated = data.availableDays.includes(day)
      ? data.availableDays.filter((d) => d !== day)
      : [...data.availableDays, day]
    onChange({ ...data, availableDays: updated })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Certificates Drive Link */}
      <div className="space-y-2">
        <Label htmlFor="certificatesLink">{"رابط الشهادات (Google Drive أو غيره)"}</Label>
        <div className="relative">
          <Input
            id="certificatesLink"
            type="url"
            placeholder="https://drive.google.com/drive/folders/..."
            value={data.certificatesLink}
            onChange={(e) => onChange({ ...data, certificatesLink: e.target.value })}
            className="pr-10"
            dir="ltr"
          />
          <Link2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
        <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-2.5">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            {"يرجى التأكد من أن رابط الملف متاح للجميع (Public) ليتمكن الأدمن من مراجعته. يمكنك رفع الشهادات كصور أو ملفات PDF على Google Drive أو أي خدمة تخزين سحابية أخرى."}
          </p>
        </div>
        {errors.certificatesLink && <p className="text-xs text-destructive">{errors.certificatesLink}</p>}
      </div>

      {/* Specialization */}
      <div className="space-y-1.5">
        <Label htmlFor="specialization">{"التخصص"}</Label>
        <Input
          id="specialization"
          placeholder={role === "nutritionist" ? "مثال: تغذية رياضية، تغذية علاجية" : "مثال: تدريب وظيفي، كمال أجسام"}
          value={data.specialization}
          onChange={(e) => onChange({ ...data, specialization: e.target.value })}
        />
        {errors.specialization && <p className="text-xs text-destructive">{errors.specialization}</p>}
      </div>

      {/* Years of experience */}
      <div className="space-y-1.5">
        <Label htmlFor="experience">{"سنوات الخبرة"}</Label>
        <Input
          id="experience"
          type="number"
          min={0}
          max={50}
          placeholder="5"
          value={data.yearsOfExperience}
          onChange={(e) => onChange({ ...data, yearsOfExperience: e.target.value })}
        />
        {errors.yearsOfExperience && <p className="text-xs text-destructive">{errors.yearsOfExperience}</p>}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description">{"نبذة عنك"}</Label>
        <Textarea
          id="description"
          placeholder={`اكتب نبذة مختصرة عن خبرتك ك${roleLabel}...`}
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          rows={3}
        />
        {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
      </div>

      {/* Work hours */}
      <div className="space-y-1.5">
        <Label>{"ساعات العمل"}</Label>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Input
              type="time"
              value={data.workHoursFrom}
              onChange={(e) => onChange({ ...data, workHoursFrom: e.target.value })}
            />
          </div>
          <span className="text-sm text-muted-foreground">{"الى"}</span>
          <div className="flex-1">
            <Input
              type="time"
              value={data.workHoursTo}
              onChange={(e) => onChange({ ...data, workHoursTo: e.target.value })}
            />
          </div>
        </div>
        {errors.workHours && <p className="text-xs text-destructive">{errors.workHours}</p>}
      </div>

      {/* Available days */}
      <div className="space-y-2">
        <Label>{"الأيام المتاحة"}</Label>
        <div className="flex flex-wrap gap-2">
          {daysOfWeek.map((day) => (
            <label
              key={day.value}
              className={cn(
                "flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-all",
                data.availableDays.includes(day.value)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/30"
              )}
            >
              <Checkbox
                checked={data.availableDays.includes(day.value)}
                onCheckedChange={() => toggleDay(day.value)}
                className="h-3.5 w-3.5"
              />
              {day.label}
            </label>
          ))}
        </div>
        {errors.availableDays && <p className="text-xs text-destructive">{errors.availableDays}</p>}
      </div>

      {/* Max subscribers */}
      <div className="space-y-1.5">
        <Label htmlFor="maxSubs">{"الحد الأقصى للمشتركين"}</Label>
        <Input
          id="maxSubs"
          type="number"
          min={1}
          max={100}
          placeholder="20"
          value={data.maxSubscribers}
          onChange={(e) => onChange({ ...data, maxSubscribers: e.target.value })}
        />
        {errors.maxSubscribers && <p className="text-xs text-destructive">{errors.maxSubscribers}</p>}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <Label htmlFor="spec-password">{"كلمة المرور"}</Label>
        <div className="relative">
          <Input
            id="spec-password"
            type={showPassword ? "text" : "password"}
            placeholder="6 أحرف على الأقل"
            value={data.password}
            onChange={(e) => onChange({ ...data, password: e.target.value })}
            className="pl-10"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="spec-confirm">{"تأكيد كلمة المرور"}</Label>
        <div className="relative">
          <Input
            id="spec-confirm"
            type={showConfirm ? "text" : "password"}
            placeholder="أعد ادخال كلمة المرور"
            value={data.confirmPassword}
            onChange={(e) => onChange({ ...data, confirmPassword: e.target.value })}
            className="pl-10"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            tabIndex={-1}
          >
            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          <ArrowRight className="ml-2 h-4 w-4" />
          {"رجوع"}
        </Button>
        <Button type="submit" className="flex-1" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              {"جاري التقديم..."}
            </>
          ) : (
            "تقديم الطلب"
          )}
        </Button>
      </div>
    </form>
  )
}