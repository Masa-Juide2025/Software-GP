"use client"

import React from "react"
import { UserCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// بيانات دفع تجريبية مرتبطة بأخصائيين ومدربين
const paymentLogs = [
  { 
    id: "1", 
    subscriber: "أحمد علي", 
    provider: "د. رنا الخطيب", 
    type: "أخصائي تغذية", 
    amount: "50$", 
    date: "2026-04-12", 
  },
  { 
    id: "2", 
    subscriber: "سارة حسن", 
    provider: "كابتن باسل حمدان", 
    type: "مدرب رياضي", 
    amount: "75$", 
    date: "2026-04-11", 
  },
  { 
    id: "3", 
    subscriber: "محمد عمر", 
    provider: "د. فادي الصالح", 
    type: "أخصائي تغذية", 
    amount: "50$", 
    date: "2026-04-10", 
  },
  { 
    id: "4", 
    subscriber: "لينا جمال", 
    provider: "كابتن دانا يوسف", 
    type: "مدرب رياضي", 
    amount: "75$", 
    date: "2026-04-09", 
  },
]

export default function AdminPaymentsManagement() {
  return (
    <div className="p-6 lg:p-10 space-y-8" dir="rtl">
      {/* الرأس */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">رقابة المدفوعات المالية</h1>
        <p className="text-muted-foreground mt-2">متابعة عمليات الدفع للمشتركين مع الأخصائيين والمدربين.</p>
      </div>

      {/* قسم السجل الصافي بدون بحث أو تصفية */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">سجل الحوالات والاشتراكات</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-right">المشترك</TableHead>
                <TableHead className="text-right">دفع لـ (المختص)</TableHead>
                <TableHead className="text-right">النوع</TableHead>
                <TableHead className="text-right">المبلغ</TableHead>
                <TableHead className="text-right">التاريخ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-semibold">{log.subscriber}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-primary" />
                      {log.provider}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {log.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-green-600 font-bold">{log.amount}</TableCell>
                  <TableCell className="text-muted-foreground">{log.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}