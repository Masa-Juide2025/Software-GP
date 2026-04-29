"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Utensils, Dumbbell, Eye, Flame, Loader2, Target, LayoutDashboard } from "lucide-react"

export default function AdminPlansPage() {
  const [data, setData] = useState<any>({ dietPlans: [], workoutPlans: [] })
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null)
  const [dietOpen, setDietOpen] = useState(false)
  const [workoutOpen, setWorkoutOpen] = useState(false)

  useEffect(() => {
    fetch("/api/admin/plans")
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.data)
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-right italic flex items-center gap-2">
          <LayoutDashboard className="text-primary" /> لوحة تحكم الأنظمة
        </h2>
      </div>

      {/* المربعات الإحصائية فوق - Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-r-4 border-r-blue-500 overflow-hidden">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
              <Utensils className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-black">{data.dietPlans.length}</p>
              <p className="text-xs text-muted-foreground font-bold">إجمالي الخطط الغذائية</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-4 border-r-orange-500 overflow-hidden">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
              <Dumbbell className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-black">{data.workoutPlans.length}</p>
              <p className="text-xs text-muted-foreground font-bold">إجمالي برامج التمارين</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="diets" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-6">
          <TabsTrigger value="diets" className="font-bold">الخطط الغذائية</TabsTrigger>
          <TabsTrigger value="workouts" className="font-bold">برامج التمارين</TabsTrigger>
        </TabsList>

        {/* الخطط الغذائية */}
        <TabsContent value="diets" className="space-y-4">
          {data.dietPlans.map((plan: any) => (
            <Card key={plan._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex justify-between items-center text-right">
                <div className="space-y-1">
                  <h3 className="font-black text-lg text-blue-700">{plan.title}</h3>
                  <div className="flex gap-3">
                    <Badge variant="outline" className="bg-blue-50/50 text-blue-700 border-blue-200">
                      <Flame className="w-3 h-3 ml-1" /> {plan.dailyCalories} سعرة
                    </Badge>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => { setSelectedPlan(plan); setDietOpen(true); }}>
                  <Eye className="w-4 h-4 ml-2" /> عرض التفاصيل
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* برامج التمارين */}
        <TabsContent value="workouts" className="space-y-4">
          {data.workoutPlans.map((prog: any) => (
            <Card key={prog._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex justify-between items-center text-right">
                <div className="space-y-1">
                  <h3 className="font-black text-lg text-orange-700">{prog.name}</h3>
                  <div className="flex gap-3 text-xs font-bold text-muted-foreground">
                    <span className="flex items-center gap-1"><Target className="w-3 h-3" /> {prog.goal}</span>
                    <span>• {prog.durationWeeks} أسابيع</span>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => { setSelectedWorkout(prog); setWorkoutOpen(true); }}>
                  <Eye className="w-4 h-4 ml-2" /> عرض الجدول
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Modal الخطط الغذائية */}
      <Dialog open={dietOpen} onOpenChange={setDietOpen}>
        <DialogContent className="max-w-lg overflow-y-auto max-h-[85vh]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right text-xl font-black text-blue-700">{selectedPlan?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {selectedPlan?.meals?.map((meal: any, idx: number) => (
              <div key={idx} className="border-2 border-slate-100 p-4 rounded-2xl bg-slate-50/50 text-right">
                <p className="font-black text-blue-600 mb-3 border-b pb-2">{meal.mealType}</p>
                <div className="space-y-2">
                  {meal.items?.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-center bg-white p-2 rounded-lg shadow-sm">
                      <div className="text-right">
                        <p className="font-bold text-sm">{item.name}</p>
                        <p className="text-[10px] text-muted-foreground">الكمية: {item.quantity}</p>
                      </div>
                      <Badge className="bg-blue-600 font-bold">{item.calories} Cal</Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal التمارين */}
      <Dialog open={workoutOpen} onOpenChange={setWorkoutOpen}>
        <DialogContent className="max-w-lg overflow-y-auto max-h-[85vh]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right text-xl font-black text-orange-700">{selectedWorkout?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {selectedWorkout?.exercises?.map((ex: any, i: number) => (
              <div key={i} className="flex justify-between items-center p-4 bg-orange-50/50 rounded-2xl border-2 border-orange-100 text-right">
                <div>
                  <p className="font-black text-orange-800">{ex.exerciseName}</p>
                  <p className="text-xs font-bold text-orange-600/70">{ex.sets} جولات × {ex.reps} تكرار</p>
                </div>
                <Badge variant="outline" className="border-orange-300 text-orange-700 font-bold bg-white">راحة {ex.restSeconds}ث</Badge>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}