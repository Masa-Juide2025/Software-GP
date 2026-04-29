"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation" // أضفنا useRouter هنا
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  UserCog,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Heart,
  X,
  Bell,
  UtensilsCrossed,
  ClipboardList,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/admin/subscribers", label: "المشتركين", icon: Users },
  { href: "/admin/specialists", label: "الأخصائيين", icon: UserCog },
  { href: "/admin/trainers", label: "المدربين", icon: UserCog },
  { href: "/admin/pending-requests", label: "طلبات الانضمام", icon: ClipboardList },
  { href: "/admin/plans", label: "الباقات", icon: CreditCard },
  { href: "/admin/meal-plans", label: "الخطط الغذائية", icon: UtensilsCrossed },
  { href: "/admin/reports", label: "التقارير", icon: BarChart3 },
  { href: "/admin/notifications", label: "الاشعارات", icon: Bell },
  { href: "/admin/settings", label: "الاعدادات", icon: Settings },
]

interface AdminSidebarProps {
  open: boolean
  onClose: () => void
}

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter() // تعريف الراوتر

  // وظيفة تسجيل الخروج
  const handleLogout = () => {
    // يمكنك إضافة منطق مسح التوكن أو الكوكيز هنا إذا أردت
    router.push("/")
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          onKeyDown={(e) => {
            if (e.key === "Escape") onClose()
          }}
          role="button"
          tabIndex={0}
          aria-label="اغلاق القائمة"
        />
      )}
      <aside
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-72 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between border-b border-sidebar-border px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
              <Heart className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">NutriSync Ai</h1>
              <p className="text-xs text-sidebar-foreground/60">لوحة الادارة</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-sidebar-foreground hover:bg-sidebar-accent lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
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
            onClick={handleLogout} // ربط الوظيفة بالزر
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            تسجيل الخروج
          </button>
        </div>
      </aside>
    </>
  )
}