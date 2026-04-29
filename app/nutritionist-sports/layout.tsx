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
  Trophy,
  Dumbbell,
  Target,
  Zap,
  MessageSquare,
} from "lucide-react"

const sportsNav = [
  { href: "/nutritionist-sports", label: "الرئيسية", icon: LayoutDashboard },
  { href: "/nutritionist-sports/athletes", label: "الرياضيين", icon: Users },
  { href: "/nutritionist-sports/meal-plans", label: "الخطط الغذائية", icon: UtensilsCrossed },
  { href: "/nutritionist-sports/supplements", label: "المكملات الرياضية", icon: Zap },
  { href: "/nutritionist-sports/training-sync", label: "ربط التدريب", icon: Dumbbell },
  { href: "/nutritionist-sports/ai-meal-plan", label: "خطة بالذكاء الاصطناعي", icon: Sparkles },
  { href: "/nutritionist-sports/Feedback", label: "Feedbacks", icon: Calendar },
    { href: "/nutritionist-sports/msg", label: "الرسائل", icon: MessageSquare },
  { href: "/nutritionist-sports/schedule", label: "المواعيد", icon: Calendar },
  { href: "/nutritionist-sports/reports", label: "التقارير", icon: BarChart3 },
  { href: "/nutritionist-sports/settings", label: "الاعدادات", icon: Settings },
]

export default function SportsNutritionistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardShell
      role="nutritionist"
      userName=""
      userInitials=""
      navItems={sportsNav}
      roleLabel="أخصائي تغذية رياضية"
    >
      {children}
    </DashboardShell>
  )
}