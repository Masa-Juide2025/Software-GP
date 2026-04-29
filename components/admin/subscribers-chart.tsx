"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { subscriptionDistribution } from "@/lib/mock-data"

export function SubscribersChart() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold lg:text-lg">
          توزيع الباقات
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 pb-4 lg:px-6">
        <div className="h-64 lg:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={subscriptionDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {subscriptionDistribution.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  fontSize: "13px",
                  direction: "rtl",
                }}
                formatter={(value: number, name: string) => [
                  `${value} مشترك`,
                  name,
                ]}
              />
              <Legend
                wrapperStyle={{ fontSize: "13px", direction: "rtl" }}
                formatter={(value: string) => (
                  <span className="text-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
