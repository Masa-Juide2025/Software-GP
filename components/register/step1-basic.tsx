"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { User, UtensilsCrossed, Dumbbell, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

export type UserRole = "subscriber" | "nutritionist" | "trainer"
export type Gender = "male" | "female"

export interface Step1Data {
  fullName: string
  email: string
  phone: string
  userRole: UserRole
  gender: Gender
}

interface Step1Props {
  data: Step1Data
  onChange: (data: Step1Data) => void
  onNext: () => void
}

const roleOptions: { key: UserRole; label: string; icon: React.ElementType; desc: string }[] = [
  { key: "subscriber", label: "مشترك", icon: User, desc: "متابعة خططك الغذائية والتمارين" },
  { key: "nutritionist", label: "أخصائي تغذية", icon: UtensilsCrossed, desc: "ادارة الخطط الغذائية للمشتركين" },
  { key: "trainer", label: "مدرب رياضي", icon: Dumbbell, desc: "ادارة برامج التدريب الرياضية" },
]

export function RegisterStep1({ data, onChange, onNext }: Step1Props) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!data.fullName.trim()) errs.fullName = "الاسم الكامل مطلوب"
    if (!data.email.trim()) errs.email = "البريد الالكتروني مطلوب"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = "بريد الكتروني غير صالح"
    if (!data.phone.trim()) errs.phone = "رقم الهاتف مطلوب"
    if (!data.userRole) errs.userRole = "يرجى اختيار نوع المستخدم"
    if (!data.gender) errs.gender = "يرجى اختيار الجنس"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="fullName">{"الاسم الكامل"}</Label>
        <Input
          id="fullName"
          placeholder="ادخل اسمك الكامل"
          value={data.fullName}
          onChange={(e) => onChange({ ...data, fullName: e.target.value })}
          autoComplete="name"
        />
        {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">{"البريد الالكتروني"}</Label>
        <Input
          id="email"
          type="email"
          placeholder="example@email.com"
          value={data.email}
          onChange={(e) => onChange({ ...data, email: e.target.value })}
          autoComplete="email"
        />
        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone">{"رقم الهاتف"}</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+962 7X XXX XXXX"
          value={data.phone}
          onChange={(e) => onChange({ ...data, phone: e.target.value })}
          autoComplete="tel"
        />
        {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
      </div>

      <div className="space-y-2">
        <Label>{"نوع المستخدم"}</Label>
        <div className="grid grid-cols-3 gap-2">
          {roleOptions.map((role) => (
            <button
              key={role.key}
              type="button"
              onClick={() => onChange({ ...data, userRole: role.key })}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 text-center transition-all",
                data.userRole === role.key
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30 hover:bg-muted/50"
              )}
            >
              <role.icon
                className={cn(
                  "h-5 w-5",
                  data.userRole === role.key ? "text-primary" : "text-muted-foreground"
                )}
              />
              <span
                className={cn(
                  "text-xs font-medium",
                  data.userRole === role.key ? "text-primary" : "text-foreground"
                )}
              >
                {role.label}
              </span>
            </button>
          ))}
        </div>
        {errors.userRole && <p className="text-xs text-destructive">{errors.userRole}</p>}
      </div>

      <div className="space-y-2">
        <Label>{"الجنس"}</Label>
        <RadioGroup
          value={data.gender}
          onValueChange={(v) => onChange({ ...data, gender: v as Gender })}
          className="flex gap-4"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="male" id="male" />
            <Label htmlFor="male" className="cursor-pointer font-normal">{"ذكر"}</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="female" id="female" />
            <Label htmlFor="female" className="cursor-pointer font-normal">{"أنثى"}</Label>
          </div>
        </RadioGroup>
        {errors.gender && <p className="text-xs text-destructive">{errors.gender}</p>}
      </div>

      <Button type="submit" className="w-full">
        <span>{"التالي"}</span>
        <ArrowLeft className="mr-2 h-4 w-4" />
      </Button>
    </form>
  )
}
