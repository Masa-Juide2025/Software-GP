"use client"

import { usePathname } from "next/navigation"
import { DashboardShell } from "@/components/dashboard-shell"
import {
  LayoutDashboard,
  UtensilsCrossed,
  Dumbbell,
  TrendingUp,
  MessageCircle,
  Settings,
  CalendarCheck, // الأيقونة الجديدة للموعد
  CreditCard,    // الأيقونة الجديدة للاشتراك
} from "lucide-react"

const subscriberNav = [
  { href: "/subscriber", label: "الرئيسية", icon: LayoutDashboard },
  { href: "/subscriber/NutriChat", label: "NutriChatAI", icon: UtensilsCrossed },
  { href: "/subscriber/progress", label: "تقدمي", icon: TrendingUp },
  { href: "/subscriber/messages", label: "الرسائل", icon: MessageCircle },
  { href: "/subscriber/settings", label: "الاعدادات", icon: Settings },
  { href: "/subscriber/Booking", label: "طلب موعد", icon: CalendarCheck },
  { href: "/subscriber/subscriptions", label: "اشتراك", icon: CreditCard },
]

export default function SubscriberLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  if (pathname === "/subscriber/choose-specialist") {
    return <>{children}</>
  }

  return (
    <DashboardShell
      role="subscriber"
      userName=""
      userInitials=""
      navItems={subscriberNav}
    >
      {children}
    </DashboardShell>
  )
}