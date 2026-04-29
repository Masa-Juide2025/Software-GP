"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

// البيانات المباشرة كما في الصورة
const specialistsData = [
  {
    id: 1,
    name: "د. رنا الخطيب",
    role: "nutritionist",
    specialization: "تغذية علاجية",
    rating: 4.8,
    experience: 8,
    initials: "در"
  },
  {
    id: 2,
    name: "د. فادي الصالح",
    role: "nutritionist",
    specialization: "تغذية رياضية",
    rating: 4.6,
    experience: 6,
    initials: "دف"
  },
  {
    id: 3,
    name: " يارا حمدان",
    role: "nutritionist",
    specialization: "تغذية الأم الحامل ",
    rating: 4.9,
    experience: 10,
    initials: "كي"
  },
  {
    id: 4,
    name: " دانا يوسف",
    role: "trainer",
    specialization: "مدرب لياقة ومرونه",
    rating: 4.7,
    experience: 5,
    initials: "كد"
  },
]

export function SpecialistsSection() {
  return (
    <section id="specialists" className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-balance text-2xl font-bold text-foreground md:text-3xl">
            {"فريقنا المتخصص"}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-pretty text-muted-foreground">
            {"تعرف على نخبة الأخصائيين والمدربين الذين سيرافقونك في رحلتك الصحية"}
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {specialistsData.map((specialist) => (
            <Card key={specialist.id} className="border-border/50 text-center">
              <CardContent className="p-6">
                <Avatar className="mx-auto mb-4 h-20 w-20">
                  <AvatarFallback className="bg-primary/10 text-lg font-bold text-primary">
                    {specialist.initials}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-base font-semibold text-foreground">
                  {specialist.name}
                </h3>
                <div className="flex justify-center mt-2">
                  <Badge variant="secondary" className="px-3 py-1 font-medium">
                    {specialist.role === "nutritionist" ? "أخصائي تغذية" : "مدرب رياضي"}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {specialist.specialization}
                </p>
                <div className="mt-3 flex items-center justify-center gap-1">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  <span className="text-sm font-medium text-foreground">
                    {specialist.rating}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {"("}{specialist.experience} {"سنوات خبرة)"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}