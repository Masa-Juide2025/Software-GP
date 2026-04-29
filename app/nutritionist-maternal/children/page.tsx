"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Search,
  Baby,
  Ruler,
  Scale,
  Calendar,
  TrendingUp,
  TrendingDown,
  Activity,
  Apple,
  Milk,
} from "lucide-react"

interface Child {
  id: string
  name: string
  motherName: string
  gender: "male" | "female"
  birthDate: string
  ageMonths: number
  weight: number
  height: number
  feedingType: "breastfeeding" | "formula" | "mixed" | "solid"
  weightStatus: "underweight" | "normal" | "overweight"
  growthPercentile: number
  nextVisit: string
  notes: string
}

const mockChildren: Child[] = [
  {
    id: "c1",
    name: "يوسف أحمد",
    motherName: "فاطمة أحمد",
    gender: "male",
    birthDate: "2024-09-11",
    ageMonths: 18,
    weight: 11.2,
    height: 82,
    feedingType: "solid",
    weightStatus: "normal",
    growthPercentile: 65,
    nextVisit: "بعد أسبوعين",
    notes: "نمو طبيعي، بدء تناول الطعام الصلب",
  },
  {
    id: "c2",
    name: "سارة محمد",
    motherName: "نورة محمد",
    gender: "female",
    birthDate: "2025-03-11",
    ageMonths: 12,
    weight: 9.5,
    height: 74,
    feedingType: "mixed",
    weightStatus: "normal",
    growthPercentile: 55,
    nextVisit: "بعد أسبوع",
    notes: "بدء خطة الفطام التدريجي",
  },
  {
    id: "c3",
    name: "عمر خالد",
    motherName: "ريم خالد",
    gender: "male",
    birthDate: "2025-09-11",
    ageMonths: 6,
    weight: 7.8,
    height: 67,
    feedingType: "breastfeeding",
    weightStatus: "normal",
    growthPercentile: 70,
    nextVisit: "بعد 3 أسابيع",
    notes: "رضاعة طبيعية حصرية، بدء ادخال الأطعمة الصلبة",
  },
  {
    id: "c4",
    name: "لين سعود",
    motherName: "هند سعود",
    gender: "female",
    birthDate: "2025-06-11",
    ageMonths: 9,
    weight: 7.2,
    height: 69,
    feedingType: "formula",
    weightStatus: "underweight",
    growthPercentile: 25,
    nextVisit: "بعد أسبوع",
    notes: "متابعة دقيقة للوزن، زيادة السعرات",
  },
  {
    id: "c5",
    name: "فيصل عبدالله",
    motherName: "منى عبدالله",
    gender: "male",
    birthDate: "2024-03-11",
    ageMonths: 24,
    weight: 13.5,
    height: 88,
    feedingType: "solid",
    weightStatus: "overweight",
    growthPercentile: 90,
    nextVisit: "بعد شهر",
    notes: "تعديل النظام الغذائي لتقليل السكريات",
  },
]

export default function ChildrenPage() {
  const [search, setSearch] = useState("")
  const [filterFeeding, setFilterFeeding] = useState<string>("all")
  const [selectedChild, setSelectedChild] = useState<Child | null>(null)

  const filteredChildren = mockChildren.filter((child) => {
    const matchSearch = child.name.includes(search) || child.motherName.includes(search)
    const matchFeeding = filterFeeding === "all" || child.feedingType === filterFeeding
    return matchSearch && matchFeeding
  })

  const getFeedingBadge = (type: Child["feedingType"]) => {
    switch (type) {
      case "breastfeeding":
        return <Badge className="bg-purple-500/10 text-purple-500">{"رضاعة طبيعية"}</Badge>
      case "formula":
        return <Badge className="bg-blue-500/10 text-blue-500">{"رضاعة صناعية"}</Badge>
      case "mixed":
        return <Badge className="bg-cyan-500/10 text-cyan-500">{"رضاعة مختلطة"}</Badge>
      case "solid":
        return <Badge className="bg-green-500/10 text-green-500">{"طعام صلب"}</Badge>
    }
  }

  const getWeightBadge = (status: Child["weightStatus"]) => {
    switch (status) {
      case "underweight":
        return <Badge variant="destructive">{"نقص وزن"}</Badge>
      case "normal":
        return <Badge className="bg-green-500/10 text-green-500">{"طبيعي"}</Badge>
      case "overweight":
        return <Badge className="bg-orange-500/10 text-orange-500">{"زيادة وزن"}</Badge>
    }
  }

  const getAgeLabel = (months: number) => {
    if (months < 12) return `${months} شهر`
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12
    if (remainingMonths === 0) return `${years} سنة`
    return `${years} سنة و ${remainingMonths} شهر`
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold lg:text-2xl">{"الأطفال"}</h2>
        <p className="text-sm text-muted-foreground">{"ادارة ومتابعة نمو وتغذية الأطفال"}</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="بحث بالاسم أو اسم الأم..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-10"
          />
        </div>
        <Tabs value={filterFeeding} onValueChange={setFilterFeeding}>
          <TabsList>
            <TabsTrigger value="all">{"الكل"}</TabsTrigger>
            <TabsTrigger value="breastfeeding">{"رضاعة طبيعية"}</TabsTrigger>
            <TabsTrigger value="formula">{"صناعية"}</TabsTrigger>
            <TabsTrigger value="solid">{"طعام صلب"}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredChildren.map((child) => (
          <Card
            key={child.id}
            className="cursor-pointer transition-all hover:border-primary/30 hover:shadow-md"
            onClick={() => setSelectedChild(child)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className={child.gender === "male" ? "bg-blue-500/10 text-blue-500" : "bg-pink-500/10 text-pink-500"}>
                    <Baby className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">{child.name}</h3>
                    {getWeightBadge(child.weightStatus)}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{"الأم: "}{child.motherName}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{getAgeLabel(child.ageMonths)}</p>
                  <div className="mt-2 flex items-center gap-2">
                    {getFeedingBadge(child.feedingType)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedChild} onOpenChange={() => setSelectedChild(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Baby className={selectedChild?.gender === "male" ? "text-blue-500" : "text-pink-500"} />
              {selectedChild?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedChild && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{getAgeLabel(selectedChild.ageMonths)}</span>
                {getWeightBadge(selectedChild.weightStatus)}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-muted p-3 text-center">
                  <Scale className="mx-auto h-5 w-5 text-muted-foreground" />
                  <p className="mt-1 text-lg font-bold text-foreground">{selectedChild.weight} {"كجم"}</p>
                  <p className="text-xs text-muted-foreground">{"الوزن"}</p>
                </div>
                <div className="rounded-lg bg-muted p-3 text-center">
                  <Ruler className="mx-auto h-5 w-5 text-muted-foreground" />
                  <p className="mt-1 text-lg font-bold text-foreground">{selectedChild.height} {"سم"}</p>
                  <p className="text-xs text-muted-foreground">{"الطول"}</p>
                </div>
              </div>

              <div className="rounded-lg bg-muted/50 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{"منحنى النمو"}</span>
                  <span className="text-sm font-medium text-foreground">{selectedChild.growthPercentile}%</span>
                </div>
                <Progress value={selectedChild.growthPercentile} className="mt-2 h-2" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
                  {selectedChild.feedingType === "breastfeeding" ? (
                    <Milk className="h-4 w-4 text-purple-500" />
                  ) : (
                    <Apple className="h-4 w-4 text-green-500" />
                  )}
                  <div>
                    <p className="text-xs text-muted-foreground">{"نوع التغذية"}</p>
                    {getFeedingBadge(selectedChild.feedingType)}
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">{"الزيارة القادمة"}</p>
                    <p className="text-sm font-medium text-foreground">{selectedChild.nextVisit}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs font-medium text-muted-foreground">{"ملاحظات"}</p>
                <p className="mt-1 text-sm text-foreground">{selectedChild.notes}</p>
              </div>

              <Button className="w-full">{"تعديل خطة التغذية"}</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}