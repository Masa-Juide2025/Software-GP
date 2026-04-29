import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { planPrices } from "@/lib/mock-data"

const plans = [
  { key: "basic" as const, popular: false },
  { key: "premium" as const, popular: true },
  { key: "vip" as const, popular: false },
]

export function PlansSection() {
  
}