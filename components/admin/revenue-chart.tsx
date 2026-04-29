"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { monthlyRevenueData } from "@/lib/mock-data"

export function RevenueChart() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold lg:text-lg">
          الايرادات الشهرية
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 pb-4 lg:px-6">
        <div className="h-64 lg:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                orientation="left"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  fontSize: "13px",
                  direction: "rtl",
                }}
                formatter={(value: number) => [
                  `${value.toLocaleString()} د.أ`,
                  "الايرادات",
                ]}
              />
              <Bar
                dataKey="revenue"
                fill="hsl(var(--primary))"
                radius={[6, 6, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
