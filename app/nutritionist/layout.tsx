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
  FileText,
  MessageSquare,
} from "lucide-react"

const nutritionistNav = [
  { href: "/nutritionist", label: "الرئيسية", icon: LayoutDashboard },
  { href: "/nutritionist/subscribers", label: "المشتركين-انقاص الوزن", icon: Users },
  { href: "/nutritionist/subscribers-weight-gain", label: "المشتركين-زيادة الوزن", icon: Users },
  { href: "/nutritionist/patients", label:"المشتركن-المرضى", icon: Users },
  { href: "/nutritionist/medical-records", label:"السجلات الطبية", icon: FileText },
  { href: "/nutritionist/meal-plans", label: "الخطط الغذائية", icon: UtensilsCrossed },
  { href: "/nutritionist/ai-meal-plan", label: "خطة بالذكاء الاصطناعي", icon: Sparkles },
  { href: "/nutritionist/schedule", label: "المواعيد", icon: Calendar },
  { href: "/nutritionist/Feedback", label: "Feedbacks", icon: Calendar },
  { href: "/nutritionist/msg", label: "الرسائل", icon: MessageSquare },
  { href: "/nutritionist/reports", label: "التقارير", icon: BarChart3 },
  { href: "/nutritionist/settings", label: "الاعدادات", icon: Settings },
]

export default function NutritionistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardShell
      role="nutritionist"
      userName=""
      userInitials=""
      navItems={nutritionistNav}
    >
      {children}
    </DashboardShell>
  )
}