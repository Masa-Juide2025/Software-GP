"use client"

import { useState, useEffect } from "react" // ضفنا هذول
import { Bell, Menu, Search, Clock } from "lucide-react" // ضفنا Clock
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface AdminHeaderProps {
  onMenuToggle: () => void
}

export function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  // --- الجزء الجديد لجلب البيانات ---
  const [dbNotifications, setDbNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch("/api/admin/settings")
        const json = await res.json()
        if (json.success) {
          setDbNotifications(json.notifications || [])
        }
      } catch (err) {
        console.error("Failed to load notifications", err)
      } finally {
        setLoading(false)
      }
    }
    fetchNotifications()
  }, [])

  // حساب عدد غير المقروء بناءً على حقل isRead من الداتابيز
  const unreadCount = dbNotifications.filter((n) => !n.isRead).length
  // --------------------------------

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card px-4 lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuToggle}
        className="lg:hidden"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">فتح القائمة</span>
      </Button>

      <div className="mr-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -left-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive p-0 text-xs text-destructive-foreground">
                  {unreadCount}
                </Badge>
              )}
              <span className="sr-only">الاشعارات</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="px-4 py-3 text-sm font-semibold">الاشعارات</div>
            <DropdownMenuSeparator />
            
            {/* عرض الإشعارات الحقيقية */}
            {dbNotifications.length > 0 ? (
              dbNotifications.slice(0, 5).map((notif) => (
                <DropdownMenuItem
                  key={notif._id}
                  className="flex flex-col items-start gap-1 px-4 py-3 border-b last:border-0"
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="font-medium text-sm">{notif.title}</span>
                    {!notif.isRead && (
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {notif.message}
                  </span>
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground italic">
                    <Clock className="h-3 w-3" />
                    {new Date(notif.createdAt).toLocaleString('ar-EG')}
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-xs text-muted-foreground">
                {loading ? "جاري التحميل..." : "لا توجد إشعارات حالياً"}
              </div>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-sm text-primary cursor-pointer font-bold">
              عرض كل الاشعارات
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  مد
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium md:inline-block">
                مدير النظام
              </span>
            </Button>
          </DropdownMenuTrigger>
          
        </DropdownMenu>
      </div>
    </header>
  )
}