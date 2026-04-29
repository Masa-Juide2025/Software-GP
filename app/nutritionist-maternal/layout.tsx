"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import {
  LayoutDashboard,
  Users,
  UtensilsCrossed,
  Calendar,
  BarChart3,
  Settings,
  Sparkles,
  Baby,
  HeartPulse,
  Milk,
  MessageSquare,
} from "lucide-react"

const maternalNav = [
  { href: "/nutritionist-maternal", label: "الرئيسية", icon: LayoutDashboard },
  { href: "/nutritionist-maternal/mothers", label: "الأمهات", icon: Users },
  { href: "/nutritionist-maternal/meal-plans", label: "الخطط الغذائية", icon: UtensilsCrossed },
  { href: "/nutritionist-maternal/pregnancy-tracking", label: "متابعة الحمل", icon: HeartPulse },
  { href: "/nutritionist-maternal/ai-meal-plan", label: "خطة بالذكاء الاصطناعي", icon: Sparkles },
  { href: "/nutritionist-maternal/Feedback", label: "Feedbacks", icon: Calendar },
    { href: "/nutritionist-maternal/msg", label: "الرسائل", icon: MessageSquare },
  { href: "/nutritionist-maternal/schedule", label: "المواعيد", icon: Calendar },
  { href: "/nutritionist-maternal/settings", label: "الاعدادات", icon: Settings },
]

export default function MaternalNutritionistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardShell
      role="nutritionist"
      userName=""
      userInitials=""
      navItems={maternalNav}
      roleLabel="أخصائي تغذية الأم الحامل"
    >
      {children}
    </DashboardShell>
  )
}