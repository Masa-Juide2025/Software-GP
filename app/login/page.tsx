"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Heart,
  Eye,
  EyeOff,
  Loader2,
  User,
  UtensilsCrossed,
  Dumbbell,
  Shield,
  ArrowRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

type RoleKey = "subscriber" | "nutritionist" | "trainer" | "admin"

const roles: { key: RoleKey; label: string; icon: React.ElementType }[] = [
  { key: "subscriber", label: "مشترك", icon: User },
  { key: "nutritionist", label: "أخصائي تغذية", icon: UtensilsCrossed },
  { key: "trainer", label: "مدرب رياضي", icon: Dumbbell },
  { key: "admin", label: "مدير النظام", icon: Shield },
]

export default function LoginPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<RoleKey>("subscriber")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ email: "", password: "" })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "فشل تسجيل الدخول")
        setLoading(false)
        return
      }

      const userRole = data.user.role as RoleKey
      const userEmail = form.email.toLowerCase().trim()
      const specialization = data.user.specialization || "";

      localStorage.setItem("userEmail", userEmail);
      localStorage.setItem("userRole", userRole);

      // --- منطق التوجيه الذكي بناءً على الدور والتخصص ---
      if (userRole === "subscriber") {
        window.location.href = `/subscriber/choose-specialist?email=${encodeURIComponent(userEmail)}`;
      } 
      else if (userRole === "admin") {
        router.push("/admin")
      } 
      else if (userRole === "nutritionist") {
        // فحص التخصصات وتوجيه الأخصائي
        if (specialization.includes("حامل")) {
          router.push("/nutritionist-maternal")
        } else if (specialization.includes("رياض")) {
          router.push("/nutritionist-sports")
        } else {
          router.push("/nutritionist") // التغذية العامة
        }
      } 
      else if (userRole === "trainer") {
        router.push("/trainer")
      }

    } catch (err) {
      console.error("Login error:", err);
      setError("حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-8 text-right">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/x.jpg')" }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 flex w-full flex-col items-center">
        <Link href="/" className="mb-6 flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Heart className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-white">NutriSync AI</span>
        </Link>

        <Card className="w-full max-w-md shadow-xl border-border/50">
          <CardHeader className="pb-2">
            <h1 className="text-center text-lg font-bold text-foreground">
              تسجيل الدخول
            </h1>
          </CardHeader>

          <CardContent className="space-y-4 pt-2">
            <div>
              <Label className="mb-2 block text-sm font-medium">الدخول بصفة</Label>
              <div className="grid grid-cols-2 gap-2">
                {roles.map((role) => (
                  <button
                    key={role.key}
                    type="button"
                    onClick={() => {
                      setSelectedRole(role.key)
                      setError("")
                    }}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 text-center transition-all",
                      selectedRole === role.key
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30 hover:bg-muted/50"
                    )}
                  >
                    <role.icon className={cn("h-5 w-5", selectedRole === role.key ? "text-primary" : "text-muted-foreground")} />
                    <span className={cn("text-xs font-medium", selectedRole === role.key ? "text-primary" : "text-foreground")}>
                      {role.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="login-email">البريد الالكتروني</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="ادخل بريدك الالكتروني"
                  className="text-right"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="login-password">كلمة المرور</Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="ادخل كلمة المرور"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    className="pl-10 text-right"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && <p className="text-sm text-destructive font-medium">{error}</p>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جاري تسجيل الدخول...
                  </>
                ) : (
                  "تسجيل الدخول"
                )}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              <span>ليس لديك حساب؟ </span>
              <Link href="/register" className="font-medium text-primary hover:underline">انشاء حساب جديد</Link>
            </div>
          </CardContent>
        </Card>

        <Link href="/" className="mt-4 flex items-center gap-1 text-sm text-white transition-colors hover:text-gray-200">
          <ArrowRight className="h-4 w-4" /> العودة للصفحة الرئيسية
        </Link>
      </div>
    </div>
  )
}