"use client"

import { useEffect, useState } from "react"
import { StatsCards } from "@/components/admin/stats-cards"
import { RecentSubscribers } from "@/components/admin/recent-subscribers"
import { SpecialistOverview } from "@/components/admin/specialist-overview"

export default function AdminDashboardPage() {
  const [data, setData] = useState<{ subscribers: any[], professionals: any[] }>({
    subscribers: [],
    professionals: []
  })
  const [loading, setLoading] = useState(true)

  // جلب بيانات المشتركين والأخصائيين الفعليين من قاعدة البيانات
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // نستخدم رابط الـ API الذي أنشأناه سابقاً
        const res = await fetch("/api/admin/dashboard")
        const result = await res.json()
        setData(result)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold lg:text-2xl">مرحبا، مدير النظام</h2>
        <p className="text-sm text-muted-foreground">
          اليك ملخص أداء المركز اليوم
        </p>
      </div>

      <StatsCards />

      {/* تم حذف قسم الرسوم البيانية من هنا بناءً على طلبك */}

      <div className="grid gap-4 lg:grid-cols-2">
        {/* نمرر البيانات الحقيقية للمكونات المتبقية */}
        <RecentSubscribers data={data.subscribers} loading={loading} />
        <SpecialistOverview data={data.professionals} loading={loading} />
      </div>
    </div>
  )
}