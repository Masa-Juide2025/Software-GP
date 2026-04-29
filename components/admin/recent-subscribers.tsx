"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  active: { label: "نشط", variant: "default" },
  approved: { label: "نشط", variant: "default" },
  expired: { label: "منتهي", variant: "destructive" },
  suspended: { label: "معلق", variant: "secondary" },
  trial: { label: "تجريبي", variant: "outline" },
  pending: { label: "قيد الانتظار", variant: "outline" },
}

const planMap: Record<string, string> = {
  basic: "أساسي",
  premium: "بريميوم",
  vip: "VIP",
}

interface RecentSubscribersProps {
  data: any[];
  loading: boolean;
}

export function RecentSubscribers({ data, loading }: RecentSubscribersProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold lg:text-lg">
          أحدث المشتركين
        </CardTitle>
        <Link
          href="/admin/subscribers"
          className="flex items-center gap-1 text-xs text-primary hover:underline"
        >
          عرض الكل
          <ArrowLeft className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent className="px-4 pb-4 lg:px-6">
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : data && data.length > 0 ? (
            data.map((sub) => {
              // توحيد جلب الاسم
              const displayName = sub.fullName || sub.name || "مستخدم جديد";

              // معالجة التاريخ الذكية
              let displayDate = "تاريخ غير متوفر";
              if (sub.createdAt) {
                try {
                  const dateObj = new Date(sub.createdAt);
                  // التحقق من أن النتيجة تاريخ صالح فعلياً
                  if (!isNaN(dateObj.getTime())) {
                    displayDate = dateObj.toLocaleDateString("ar-JO");
                  }
                } catch (e) {
                  console.error("خطأ في تنسيق التاريخ", e);
                }
              }

              return (
                <div key={sub._id || Math.random()} className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {displayName !== "مستخدم جديد"
                        ? displayName.split(" ").filter(Boolean).slice(0, 2).map((n: string) => n[0]).join("").toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{displayName}</p>
                    <p className="text-xs text-muted-foreground">
                      {planMap[sub.subscriptionPlan] || "أساسي"} - {displayDate}
                    </p>
                  </div>
                  <Badge 
                    variant={statusMap[sub.status]?.variant || "outline"} 
                    className="shrink-0 text-xs"
                  >
                    {statusMap[sub.status]?.label || "نشط"}
                  </Badge>
                </div>
              );
            })
          ) : (
            <p className="text-center text-xs text-muted-foreground py-4">
              لا يوجد مشتركين حالياً
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}