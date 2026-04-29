"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"

const roleMap: Record<string, string> = {
  nutritionist: "أخصائي تغذية",
  trainer: "مدرب رياضي",
}

interface SpecialistOverviewProps {
  data: any[];
  loading: boolean;
}

export function SpecialistOverview({ data, loading }: SpecialistOverviewProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold lg:text-lg">
          الأخصائيين والمدربين
        </CardTitle>
        <Link href="/admin/specialists" className="flex items-center gap-1 text-xs text-primary hover:underline">
          عرض الكل <ArrowLeft className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent className="px-4 pb-4 lg:px-6">
        <div className="space-y-5">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : data && data.length > 0 ? (
            data.map((spec) => {
              const displayName = 
                spec.name || 
                spec.fullName || 
                spec.user?.fullName || 
                spec.userId?.fullName || 
                "أخصائي جديد";

              const ratingValue = spec.rating !== undefined ? Number(spec.rating).toFixed(1) : "0.0";

              return (
                <div key={spec.id || spec._id || Math.random()} className="py-2 border-b last:border-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarFallback className="bg-info/10 text-info text-xs font-semibold">
                        {displayName !== "أخصائي جديد"
                          ? displayName.split(" ").filter(Boolean).slice(0, 2).map((n: string) => n[0]).join("").toUpperCase()
                          : "SP"}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-none mb-1">
                        {displayName}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {roleMap[spec.role] || "أخصائي"} - {spec.specialization || "تخصص معتمد"}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      <Star className={`h-3.5 w-3.5 ${Number(ratingValue) > 0 ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                      <span className="text-xs font-bold">{ratingValue}</span>
                    </div>
                  </div>
                  {/* تم حذف شريط التقدم والعدادات من هنا نهائياً بناءً على طلبك */}
                </div>
              )
            })
          ) : (
            <p className="text-center text-xs text-muted-foreground py-4">لا يوجد أخصائيين مسجلين</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}