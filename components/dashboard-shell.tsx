"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Heart,
  LayoutDashboard,
  UtensilsCrossed,
  Dumbbell,
  TrendingUp,
  MessageCircle,
  Settings,
  LogOut,
  X,
  Menu,
  Bell,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface DashboardShellProps {
  children: React.ReactNode
  role: "subscriber" | "nutritionist" | "trainer"
  userName: string
  userInitials: string
  navItems: { href: string; label: string; icon: React.ElementType }[]
  roleLabel?: string // ✅ الإضافة الأولى: تعريف الخاصية في الـ Interface لحل مشكلة الخط الأحمر
}

export function DashboardShell({
  children,
  role,
  userName,
  userInitials,
  navItems,
  roleLabel, // ✅ الإضافة الثانية: استلام الخاصية هنا
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  // ✅ الإضافة الثالثة: منطق اختيار التسمية (إذا أرسلت قيمة من الـ layout نستخدمها، وإلا نعتمد الـ role)
  const displayRoleLabel = roleLabel || (
    role === "subscriber"
      ? "مشترك"
      : role === "nutritionist"
        ? "أخصائي تغذية"
        : "مدرب رياضي"
  )

  return (
    <div className="flex h-screen overflow-hidden text-right" dir="rtl">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setSidebarOpen(false)
          }}
          role="button"
          tabIndex={0}
          aria-label="اغلاق القائمة"
        />
      )}

      <aside
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-72 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between border-b border-sidebar-border px-6 py-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
              <Heart className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">NutriSync AI</h1>
              {/* ✅ عرض التسمية الصحيحة هنا */}
              <p className="text-xs text-sidebar-foreground/60">{displayRoleLabel}</p>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="text-sidebar-foreground hover:bg-sidebar-accent lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {"تسجيل الخروج"}
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">{"فتح القائمة"}</span>
          </Button>

          <div className="mr-auto flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="sr-only">{"الاشعارات"}</span>
            </Button>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium md:inline-block">{userName}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}