"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Milk,
  Calendar,
  Clock,
  Baby,
  Apple,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Heart,
} from "lucide-react"

interface BreastfeedingMother {
  id: string
  name: string
  age: number
  babyName: string
  babyAgeMonths: number
  feedingType: "exclusive" | "partial" | "weaning"
  feedingFrequency: number
  lastVisit: string
  nextVisit: string
  currentWeight: number
  dailyCalories: number
  waterIntake: number
  challenges: string[]
  tips: string[]
  supplements: string[]
  weaningStage?: string
}

const mockBreastfeedingMothers: BreastfeedingMother[] = [
  {
    id: "b1",
    name: "ريم خالد الشهري",
    age: 32,
    babyName: "عمر",
    babyAgeMonths: 4,
    feedingType: "exclusive",
    feedingFrequency: 10,
    lastVisit: "2026-03-04",
    nextVisit: "2026-03-18",
    currentWeight: 62,
    dailyCalories: 2500,
    waterIntake: 3,
    challenges: [],
    tips: ["الاستمرار على الرضاعة الحصرية حتى 6 أشهر", "الاهتمام بترطيب الجسم"],
    supplements: ["حديد", "كالسيوم", "فيتامين د", "أوميغا 3"],
  },
  {
    id: "b2",
    name: "سارة محمد الدوسري",
    age: 34,
    babyName: "ليان",
    babyAgeMonths: 8,
    feedingType: "partial",
    feedingFrequency: 5,
    lastVisit: "2026-03-07",
    nextVisit: "2026-03-14",
    currentWeight: 58,
    dailyCalories: 2200,
    waterIntake: 2.5,
    challenges: ["قلة إدرار الحليب"],
    tips: ["زيادة شرب الماء", "تناول الحلبة والشمر", "الرضاعة المتكررة"],
    supplements: ["حديد", "كالسيوم"],
  },
  {
    id: "b3",
    name: "منى عبدالله الحربي",
    age: 29,
    babyName: "سلطان",
    babyAgeMonths: 12,
    feedingType: "weaning",
    feedingFrequency: 2,
    lastVisit: "2026-03-01",
    nextVisit: "2026-03-15",
    currentWeight: 60,
    dailyCalories: 1800,
    waterIntake: 2,
    challenges: ["صعوبة الفطام"],
    tips: ["الفطام التدريجي", "تقليل رضعة كل أسبوع", "تقديم بدائل صحية"],
    supplements: ["كالسيوم"],
    weaningStage: "المرحلة الثانية",
  },
  {
    id: "b4",
    name: "هند فهد المطيري",
    age: 27,
    babyName: "فيصل",
    babyAgeMonths: 2,
    feedingType: "exclusive",
    feedingFrequency: 12,
    lastVisit: "2026-03-08",
    nextVisit: "2026-03-22",
    currentWeight: 65,
    dailyCalories: 2600,
    waterIntake: 3.5,
    challenges: ["تشقق الحلمات"],
    tips: ["استخدام كريم اللانولين", "التأكد من وضعية الرضاعة الصحيحة"],
    supplements: ["حديد", "كالسيوم", "فيتامين د", "أوميغا 3"],
  },
]

export default function BreastfeedingPage() {
  const [selectedMother, setSelectedMother] = useState<BreastfeedingMother | null>(null)
  const [filterType, setFilterType] = useState<string>("all")

  const filteredMothers = mockBreastfeedingMothers.filter((mother) => {
    return filterType === "all" || mother.feedingType === filterType
  })

  const getFeedingBadge = (type: BreastfeedingMother["feedingType"]) => {
    switch (type) {
      case "exclusive":
        return <Badge className="bg-purple-500/10 text-purple-500">{"رضاعة حصرية"}</Badge>
      case "partial":
        return <Badge className="bg-cyan-500/10 text-cyan-500">{"رضاعة جزئية"}</Badge>
      case "weaning":
        return <Badge className="bg-orange-500/10 text-orange-500">{"مرحلة الفطام"}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold lg:text-2xl">{"الرضاعة الطبيعية"}</h2>
        <p className="text-sm text-muted-foreground">{"دعم ومتابعة الأمهات المرضعات"}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
              <Milk className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{"رضاعة حصرية"}</p>
              <p className="text-xl font-bold">{mockBreastfeedingMothers.filter(m => m.feedingType === "exclusive").length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10">
              <Baby className="h-6 w-6 text-cyan-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{"رضاعة جزئية"}</p>
              <p className="text-xl font-bold">{mockBreastfeedingMothers.filter(m => m.feedingType === "partial").length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10">
              <Apple className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{"مرحلة الفطام"}</p>
              <p className="text-xl font-bold">{mockBreastfeedingMothers.filter(m => m.feedingType === "weaning").length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={filterType} onValueChange={setFilterType}>
        <TabsList>
          <TabsTrigger value="all">{"الكل"}</TabsTrigger>
          <TabsTrigger value="exclusive">{"رضاعة حصرية"}</TabsTrigger>
          <TabsTrigger value="partial">{"رضاعة جزئية"}</TabsTrigger>
          <TabsTrigger value="weaning">{"فطام"}</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4 lg:grid-cols-2">
        {filteredMothers.map((mother) => (
          <Card
            key={mother.id}
            className="cursor-pointer transition-all hover:border-primary/30 hover:shadow-md"
            onClick={() => setSelectedMother(mother)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="bg-purple-500/10 text-purple-500">
                    {mother.name.split(" ").slice(0, 2).map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">{mother.name}</h3>
                    {getFeedingBadge(mother.feedingType)}
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Baby className="h-4 w-4 text-muted-foreground" />
                      <span>{mother.babyName} ({mother.babyAgeMonths} {"شهر"})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{mother.feedingFrequency} {"رضعات/يوم"}</span>
                    </div>
                  </div>
                  {mother.challenges.length > 0 && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-orange-500">
                      <AlertTriangle className="h-3 w-3" />
                      {mother.challenges[0]}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedMother} onOpenChange={() => setSelectedMother(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Milk className="h-5 w-5 text-purple-500" />
              {selectedMother?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedMother && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">{"نظرة عامة"}</TabsTrigger>
                <TabsTrigger value="nutrition">{"التغذية"}</TabsTrigger>
                <TabsTrigger value="support">{"الدعم"}</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  {getFeedingBadge(selectedMother.feedingType)}
                  {selectedMother.weaningStage && (
                    <span className="text-sm text-muted-foreground">{selectedMother.weaningStage}</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-muted p-3 text-center">
                    <Baby className="mx-auto h-5 w-5 text-cyan-500" />
                    <p className="mt-1 text-lg font-bold">{selectedMother.babyName}</p>
                    <p className="text-xs text-muted-foreground">{selectedMother.babyAgeMonths} {"شهر"}</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3 text-center">
                    <Clock className="mx-auto h-5 w-5 text-purple-500" />
                    <p className="mt-1 text-lg font-bold">{selectedMother.feedingFrequency}</p>
                    <p className="text-xs text-muted-foreground">{"رضعات يوميا"}</p>
                  </div>
                </div>

                <div className="rounded-lg border p-3">
                  <p className="text-sm font-medium">{"الزيارة القادمة"}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-foreground">{selectedMother.nextVisit}</span>
                  </div>
                </div>

                {selectedMother.challenges.length > 0 && (
                  <div className="rounded-lg border border-orange-500/30 bg-orange-500/5 p-3">
                    <div className="flex items-center gap-2 text-orange-500">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-medium">{"تحديات"}</span>
                    </div>
                    <ul className="mt-2 space-y-1">
                      {selectedMother.challenges.map((challenge, i) => (
                        <li key={i} className="text-sm text-foreground">- {challenge}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="nutrition" className="space-y-4 mt-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-muted p-3 text-center">
                    <Apple className="mx-auto h-5 w-5 text-green-500" />
                    <p className="mt-1 text-lg font-bold">{selectedMother.dailyCalories}</p>
                    <p className="text-xs text-muted-foreground">{"سعرة/يوم"}</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3 text-center">
                    <Droplets className="mx-auto h-5 w-5 text-blue-500" />
                    <p className="mt-1 text-lg font-bold">{selectedMother.waterIntake}</p>
                    <p className="text-xs text-muted-foreground">{"لتر ماء"}</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3 text-center">
                    <TrendingUp className="mx-auto h-5 w-5 text-muted-foreground" />
                    <p className="mt-1 text-lg font-bold">{selectedMother.currentWeight}</p>
                    <p className="text-xs text-muted-foreground">{"كجم"}</p>
                  </div>
                </div>

                <div className="rounded-lg border p-3">
                  <p className="text-sm font-medium mb-2">{"المكملات الغذائية"}</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedMother.supplements.map((supp, i) => (
                      <Badge key={i} variant="secondary">{supp}</Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="support" className="space-y-4 mt-4">
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2 text-green-500">
                    <Heart className="h-4 w-4" />
                    <span className="font-medium">{"نصائح ودعم"}</span>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {selectedMother.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                        <span className="text-foreground">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button className="w-full">{"ارسال رسالة دعم"}</Button>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}