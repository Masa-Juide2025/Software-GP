"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react"

export interface SubscriberStepData {
  age: string
  height: string
  weight: string
  goalWeight: string
  goalType: string
  diseases: string
  allergies: string
  password: string
  confirmPassword: string
}

interface SubscriberStepProps {
  data: SubscriberStepData
  onChange: (data: SubscriberStepData) => void
  onBack: () => void
  onSubmit: () => void
  loading: boolean
}

const goalTypes = [
  { value: "lose_weight", label: "انقاص الوزن" },
  { value: "gain_weight", label: "زيادة الوزن" },
  { value: "maintain", label: "الحفاظ على الوزن" },
  { value: "build_muscle", label: "متابعة تغذية رياضي" },
  { value: "improve_health", label: "تحسين الصحة العامة" },
  { value: "Follow-up of a diabetic patient", label: "متابعة مريض سكري" },
  { value: "Monitoring a patient with high blood pressure", label:"متابعة مريض ضغط" },
  { value: "Follow-up of a kidney patient", label:"متابعة مريض كلى" },
  { value: "Monitoring pregnant woman's nutrition", label:"متابعة تغذية الحامل" },

]

export function SubscriberStep({ data, onChange, onBack, onSubmit, loading }: SubscriberStepProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!data.age || Number(data.age) < 10 || Number(data.age) > 100) errs.age = "العمر يجب ان يكون بين 10 و 100"
    if (!data.height) errs.height = "الطول مطلوب"
    if (!data.weight) errs.weight = "الوزن مطلوب"
    if (!data.goalWeight) errs.goalWeight = "وزن الهدف مطلوب"
    if (!data.goalType) errs.goalType = "نوع الهدف مطلوب"
    if (!data.password || data.password.length < 6) errs.password = "كلمة المرور يجب ان تكون 6 أحرف على الأقل"
    if (data.password !== data.confirmPassword) errs.confirmPassword = "كلمتا المرور غير متطابقتين"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="age">{"العمر"}</Label>
          <Input
            id="age"
            type="number"
            placeholder="25"
            min={10}
            max={100}
            value={data.age}
            onChange={(e) => onChange({ ...data, age: e.target.value })}
          />
          {errors.age && <p className="text-xs text-destructive">{errors.age}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="height">{"الطول (سم)"}</Label>
          <Input
            id="height"
            type="number"
            placeholder="170"
            value={data.height}
            onChange={(e) => onChange({ ...data, height: e.target.value })}
          />
          {errors.height && <p className="text-xs text-destructive">{errors.height}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="weight">{"الوزن الحالي (كغ)"}</Label>
          <Input
            id="weight"
            type="number"
            placeholder="75"
            value={data.weight}
            onChange={(e) => onChange({ ...data, weight: e.target.value })}
          />
          {errors.weight && <p className="text-xs text-destructive">{errors.weight}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="goalWeight">{"وزن الهدف (كغ)"}</Label>
          <Input
            id="goalWeight"
            type="number"
            placeholder="65"
            value={data.goalWeight}
            onChange={(e) => onChange({ ...data, goalWeight: e.target.value })}
          />
          {errors.goalWeight && <p className="text-xs text-destructive">{errors.goalWeight}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>{"نوع الهدف"}</Label>
        <Select value={data.goalType} onValueChange={(v) => onChange({ ...data, goalType: v })}>
          <SelectTrigger>
            <SelectValue placeholder="اختر نوع الهدف" />
          </SelectTrigger>
          <SelectContent>
            {goalTypes.map((g) => (
              <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.goalType && <p className="text-xs text-destructive">{errors.goalType}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="diseases">{"الأمراض (ان وجدت)"}</Label>
        <Textarea
          id="diseases"
          placeholder="مثال: سكري، ضغط دم مرتفع... اتركه فارغا اذا لا يوجد"
          value={data.diseases}
          onChange={(e) => onChange({ ...data, diseases: e.target.value })}
          rows={2}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="allergies">{"الحساسية (ان وجدت)"}</Label>
        <Textarea
          id="allergies"
          placeholder="مثال: حساسية من المكسرات، الغلوتين... اتركه فارغا اذا لا يوجد"
          value={data.allergies}
          onChange={(e) => onChange({ ...data, allergies: e.target.value })}
          rows={2}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="sub-password">{"كلمة المرور"}</Label>
        <div className="relative">
          <Input
            id="sub-password"
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
        <Label htmlFor="sub-confirm">{"تأكيد كلمة المرور"}</Label>
        <div className="relative">
          <Input
            id="sub-confirm"
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
              {"جاري الانشاء..."}
            </>
          ) : (
            "انشاء الحساب"
          )}
        </Button>
      </div>
    </form>
  )
}
