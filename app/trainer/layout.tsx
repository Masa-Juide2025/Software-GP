"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  Calendar,
  BarChart3,
  Settings,
  MessageSquare, // إضافة أيقونة الفيدباك
} from "lucide-react"

const trainerNav = [
  { href: "/trainer", label: "الرئيسية", icon: LayoutDashboard },
  { href: "/trainer/subscribers", label: "المشتركين", icon: Users },
  { href: "/trainer/workouts", label: "برامج التدريب", icon: Dumbbell },
  { href: "/trainer/schedule", label: "المواعيد", icon: Calendar },
  { href: "/trainer/reports", label: "التقارير", icon: BarChart3 },
  { href: "/trainer/Feedback", label: "Feedback", icon: MessageSquare }, // الرابط الجديد هنا
  { href: "/trainer/msg", label: "الرسائل", icon: MessageSquare }, // الرابط الجديد هنا
  { href: "/trainer/settings", label: "الاعدادات", icon: Settings },
]

export default function TrainerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardShell
      role="trainer"
      userName=""
      userInitials=""
      navItems={trainerNav}
    >
      {children}
    </DashboardShell>
  )
}