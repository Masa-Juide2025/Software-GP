"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { subscribers } from "@/lib/mock-data"
import {
  Dumbbell,
  Flame,
  Clock,
  CheckCircle,
  Play,
  Calendar,
  Target,
  TrendingUp,
  Heart,
  Activity,
  Timer,
  Footprints,
  Sparkles,
  Lock,
} from "lucide-react"
import { useState } from "react"

// --- تعريف الأنواع لحل أخطاء TypeScript ---
interface LocalSubscriber {
  id: string | number;
  name: string;
  goal: keyof typeof workoutPrograms;
  assignedTrainer?: string | number;
}

// حل مشكلة Property 'goal' does not exist
const currentSubscriber = subscribers[0] as unknown as LocalSubscriber;

// Check if subscriber has trainer assigned
const hasTrainer = !!currentSubscriber.assignedTrainer

// Exercise programs based on goal
const workoutPrograms = {
  weight_loss: {
    title: "برنامج حرق الدهون",
    description: "تمارين كارديو وتمارين مقاومة لحرق السعرات",
    color: "primary",
    weeklyGoal: "5 تمارين/أسبوع",
    todayWorkout: {
      type: "كارديو + مقاومة",
      duration: "45 دقيقة",
      caloriesBurn: 450,
      exercises: [
        { name: "مشي سريع", duration: "15 دقيقة", calories: 150, sets: null, reps: null, done: true },
        { name: "تمارين HIIT", duration: "10 دقائق", calories: 120, sets: null, reps: null, done: true },
        { name: "سكوات", duration: null, calories: 60, sets: 3, reps: 15, done: false },
        { name: "تمارين بطن", duration: null, calories: 50, sets: 3, reps: 20, done: false },
        { name: "بلانك", duration: "1 دقيقة", calories: 30, sets: 3, reps: null, done: false },
        { name: "تمدد واستشفاء", duration: "5 دقائق", calories: 20, sets: null, reps: null, done: false },
      ]
    },
    weeklyPlan: [
      { day: "الأحد", type: "كارديو", done: true },
      { day: "الاثنين", type: "مقاومة علوي", done: true },
      { day: "الثلاثاء", type: "راحة نشطة", done: true },
      { day: "الأربعاء", type: "كارديو + بطن", done: false },
      { day: "الخميس", type: "مقاومة سفلي", done: false },
      { day: "الجمعة", type: "HIIT", done: false },
      { day: "السبت", type: "راحة", done: false },
    ]
  },
  weight_gain: {
    title: "برنامج بناء العضلات",
    description: "تمارين مقاومة ثقيلة لبناء الكتلة العضلية",
    color: "amber",
    weeklyGoal: "5 تمارين/أسبوع",
    todayWorkout: {
      type: "Push Day - صدر وأكتاف",
      duration: "60 دقيقة",
      caloriesBurn: 350,
      exercises: [
        { name: "بنش برس", duration: null, calories: 80, sets: 4, reps: 8, weight: "80kg", done: true },
        { name: "انكلاين دمبل برس", duration: null, calories: 70, sets: 3, reps: 10, weight: "30kg", done: true },
        { name: "شولدر برس", duration: null, calories: 60, sets: 4, reps: 10, weight: "25kg", done: false },
        { name: "سايد لاترال رايز", duration: null, calories: 40, sets: 3, reps: 12, weight: "10kg", done: false },
        { name: "ترايسبس بوشداون", duration: null, calories: 50, sets: 3, reps: 12, weight: "25kg", done: false },
        { name: "ديبس", duration: null, calories: 50, sets: 3, reps: 10, weight: "BW", done: false },
      ]
    },
    weeklyPlan: [
      { day: "الأحد", type: "Push Day", done: true },
      { day: "الاثنين", type: "Pull Day", done: true },
      { day: "الثلاثاء", type: "Legs Day", done: true },
      { day: "الأربعاء", type: "راحة", done: false },
      { day: "الخميس", type: "Push Day", done: false },
      { day: "الجمعة", type: "Pull Day", done: false },
      { day: "السبت", type: "Legs Day", done: false },
    ]
  },
  sports_nutrition: {
    title: "برنامج التغذية الرياضية",
    description: "برنامج مخصص حسب نوع الرياضة",
    color: "blue",
    weeklyGoal: "6 تمارين/أسبوع",
    todayWorkout: {
      type: "تمرين قوة متقدم",
      duration: "75 دقيقة",
      caloriesBurn: 500,
      exercises: [
        { name: "ديدلفت", duration: null, calories: 100, sets: 5, reps: 5, weight: "120kg", done: true },
        { name: "سكوات أمامي", duration: null, calories: 90, sets: 4, reps: 6, weight: "90kg", done: true },
        { name: "باربل رو", duration: null, calories: 70, sets: 4, reps: 8, weight: "70kg", done: false },
        { name: "أوفرهيد برس", duration: null, calories: 60, sets: 4, reps: 8, weight: "50kg", done: false },
        { name: "بايسبس كيرل", duration: null, calories: 40, sets: 3, reps: 12, weight: "15kg", done: false },
        { name: "كور وركآوت", duration: "10 دقائق", calories: 80, sets: null, reps: null, done: false },
      ]
    },
    weeklyPlan: [
      { day: "الأحد", type: "قوة - جزء علوي", done: true },
      { day: "الاثنين", type: "قوة - جزء سفلي", done: true },
      { day: "الثلاثاء", type: "كارديو خفيف", done: true },
      { day: "الأربعاء", type: "قوة - كامل الجسم", done: false },
      { day: "الخميس", type: "تقنية ومهارات", done: false },
      { day: "الجمعة", type: "قوة + تحمل", done: false },
      { day: "السبت", type: "راحة نشطة", done: false },
    ]
  },
  diabetes: {
    title: "برنامج تمارين لمرضى السكري",
    description: "تمارين آمنة تساعد على تنظيم السكر",
    color: "teal",
    weeklyGoal: "5 تمارين/أسبوع",
    todayWorkout: {
      type: "مشي + تمارين خفيفة",
      duration: "40 دقيقة",
      caloriesBurn: 250,
      exercises: [
        { name: "مشي متوسط السرعة", duration: "20 دقيقة", calories: 120, sets: null, reps: null, done: true },
        { name: "تمارين ذراعين خفيفة", duration: null, calories: 30, sets: 2, reps: 12, done: true },
        { name: "تمارين أرجل بالكرسي", duration: null, calories: 25, sets: 2, reps: 15, done: false },
        { name: "تمارين توازن", duration: "5 دقائق", calories: 20, sets: null, reps: null, done: false },
        { name: "تمدد وتبريد", duration: "10 دقائق", calories: 30, sets: null, reps: null, done: false },
      ]
    },
    weeklyPlan: [
      { day: "الأحد", type: "مشي 30 دقيقة", done: true },
      { day: "الاثنين", type: "تمارين مقاومة خفيفة", done: true },
      { day: "الثلاثاء", type: "مشي + تمدد", done: true },
      { day: "الأربعاء", type: "راحة", done: false },
      { day: "الخميس", type: "مشي + توازن", done: false },
      { day: "الجمعة", type: "تمارين مقاومة خفيفة", done: false },
      { day: "السبت", type: "نشاط خفيف", done: false },
    ]
  },
  hypertension: {
    title: "برنامج تمارين لمرضى الضغط",
    description: "تمارين هوائية آمنة لصحة القلب",
    color: "rose",
    weeklyGoal: "5 تمارين/أسبوع",
    todayWorkout: {
      type: "كارديو خفيف",
      duration: "35 دقيقة",
      caloriesBurn: 200,
      exercises: [
        { name: "مشي هادئ للإحماء", duration: "5 دقائق", calories: 25, sets: null, reps: null, done: true },
        { name: "مشي متوسط", duration: "20 دقيقة", calories: 100, sets: null, reps: null, done: true },
        { name: "تمارين تنفس عميق", duration: "5 دقائق", calories: 15, sets: null, reps: null, done: false },
        { name: "تمدد واسترخاء", duration: "10 دقائق", calories: 30, sets: null, reps: null, done: false },
      ]
    },
    weeklyPlan: [
      { day: "الأحد", type: "مشي 25 دقيقة", done: true },
      { day: "الاثنين", type: "سباحة خفيفة", done: true },
      { day: "الثلاثاء", type: "يوغا استرخاء", done: true },
      { day: "الأربعاء", type: "راحة", done: false },
      { day: "الخميس", type: "مشي 30 دقيقة", done: false },
      { day: "الجمعة", type: "تمارين تنفس", done: false },
      { day: "السبت", type: "نشاط خفيف", done: false },
    ]
  },
  pregnancy: {
    title: "برنامج تمارين للحامل",
    description: "تمارين آمنة لفترة الحمل",
    color: "pink",
    weeklyGoal: "4 تمارين/أسبوع",
    todayWorkout: {
      type: "تمارين ما قبل الولادة",
      duration: "30 دقيقة",
      caloriesBurn: 150,
      exercises: [
        { name: "مشي خفيف", duration: "10 دقائق", calories: 40, sets: null, reps: null, done: true },
        { name: "تمارين كيجل", duration: "5 دقائق", calories: 10, sets: 3, reps: 10, done: true },
        { name: "يوغا ما قبل الولادة", duration: "10 دقائق", calories: 30, sets: null, reps: null, done: false },
        { name: "تمارين ذراعين خفيفة", duration: null, calories: 20, sets: 2, reps: 10, done: false },
        { name: "تمدد وتنفس", duration: "10 دقائق", calories: 20, sets: null, reps: null, done: false },
      ]
    },
    weeklyPlan: [
      { day: "الأحد", type: "مشي + يوغا", done: true },
      { day: "الاثنين", type: "سباحة خفيفة", done: true },
      { day: "الثلاثاء", type: "راحة", done: true },
      { day: "الأربعاء", type: "تمارين كيجل + تمدد", done: false },
      { day: "الخميس", type: "راحة", done: false },
      { day: "الجمعة", type: "مشي خفيف", done: false },
      { day: "السبت", type: "راحة", done: false },
    ]
  },
}

const getGoalColor = (goal: string) => {
  switch (goal) {
    case "weight_loss": return "text-primary"
    case "weight_gain": return "text-amber-600"
    case "diabetes": return "text-teal-600"
    case "hypertension": return "text-rose-600"
    case "pregnancy": return "text-pink-600"
    case "sports_nutrition": return "text-blue-600"
    default: return "text-primary"
  }
}

export default function WorkoutPage() {
  const goal = currentSubscriber.goal
  const program = workoutPrograms[goal] || workoutPrograms.weight_loss
  const goalColor = getGoalColor(goal)
  
  const completedExercises = program.todayWorkout.exercises.filter(e => e.done).length
  const totalExercises = program.todayWorkout.exercises.length
  const burnedCalories = program.todayWorkout.exercises.filter(e => e.done).reduce((a, e) => a + e.calories, 0)
  const completedDays = program.weeklyPlan.filter(d => d.done).length

  if (!hasTrainer) {
    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <Dumbbell className={`h-5 w-5 ${goalColor}`} />
            <h2 className="text-xl font-bold lg:text-2xl">{"برنامج التدريب"}</h2>
          </div>
          <p className="text-sm text-muted-foreground">{"برنامجك التدريبي المخصص"}</p>
        </div>

        <Card className="border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20 mb-4">
              <Lock className="h-8 w-8 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{"لم يتم تعيين مدرب"}</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              {"للحصول على برنامج تدريبي مخصص، يجب أن يكون لديك مدرب معتمد. قم بترقية اشتراكك أو اختر مدربا لتبدأ رحلتك الرياضية."}
            </p>
            <div className="flex gap-3">
              <Button className="bg-amber-600 hover:bg-amber-700">{"اختر مدربا"}</Button>
              <Button variant="outline">{"ترقية الاشتراك"}</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-5 w-5 text-amber-600" />
              {"توصيات تمارين عامة"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{"حتى بدون مدرب، يمكنك ممارسة هذه التمارين الأساسية:"}</p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Footprints className="h-4 w-4 text-primary mt-0.5" />
                {"المشي 30 دقيقة يوميا"}
              </li>
              <li className="flex items-start gap-2">
                <Activity className="h-4 w-4 text-primary mt-0.5" />
                {"تمارين تمدد صباحية"}
              </li>
              <li className="flex items-start gap-2">
                <Heart className="h-4 w-4 text-primary mt-0.5" />
                {"تمارين تنفس عميق"}
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <Dumbbell className={`h-5 w-5 ${goalColor}`} />
          <h2 className="text-xl font-bold lg:text-2xl">{program.title}</h2>
        </div>
        <p className="text-sm text-muted-foreground">{program.description}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{"تمارين اليوم"}</p>
              <p className="text-xl font-bold">{completedExercises}/{totalExercises}</p>
              <Progress value={(completedExercises / totalExercises) * 100} className="mt-1 h-1.5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-destructive/10">
              <Flame className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{"السعرات المحروقة"}</p>
              <p className="text-xl font-bold">{burnedCalories}</p>
              <p className="text-xs text-muted-foreground">{"من "}{program.todayWorkout.caloriesBurn}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
              <Clock className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{"مدة التمرين"}</p>
              <p className="text-xl font-bold">{program.todayWorkout.duration}</p>
              <p className="text-xs text-muted-foreground">{program.todayWorkout.type}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-500/10">
              <Calendar className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{"تمارين الأسبوع"}</p>
              <p className="text-xl font-bold">{completedDays}/7</p>
              <p className="text-xs text-muted-foreground">{program.weeklyGoal}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="today" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="today">{"تمرين اليوم"}</TabsTrigger>
          <TabsTrigger value="week">{"الجدول الأسبوعي"}</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <Play className={`h-5 w-5 ${goalColor}`} />
                  {program.todayWorkout.type}
                </span>
                <Badge variant="outline">{program.todayWorkout.duration}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {program.todayWorkout.exercises.map((exercise, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-4 rounded-lg border p-3 ${
                    exercise.done ? "border-green-500/30 bg-green-500/5" : ""
                  }`}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    exercise.done ? "bg-green-500/20" : "bg-muted"
                  }`}>
                    {exercise.done ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <span className="text-sm font-medium text-muted-foreground">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{exercise.name}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      {exercise.duration && (
                        <Badge variant="secondary" className="text-xs">
                          <Timer className="h-3 w-3 ml-1" />
                          {exercise.duration}
                        </Badge>
                      )}
                      {exercise.sets && (
                        <Badge variant="secondary" className="text-xs">
                          {exercise.sets} x {exercise.reps}
                        </Badge>
                      )}
                      <Badge className="bg-destructive/80 text-xs">
                        <Flame className="h-3 w-3 ml-1" />
                        {exercise.calories} سعرة
                      </Badge>
                    </div>
                  </div>
                  {!exercise.done && (
                    <Button size="sm" variant="outline">{"بدء"}</Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="week" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className={`h-5 w-5 ${goalColor}`} />
                {"الجدول الأسبوعي"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {program.weeklyPlan.map((day, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between rounded-lg border p-3 ${
                      day.done ? "border-green-500/30 bg-green-500/5" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        day.done ? "bg-green-500/20" : "bg-muted"
                      }`}>
                        {day.done ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <span className="text-xs font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{day.day}</p>
                        <p className="text-xs text-muted-foreground">{day.type}</p>
                      </div>
                    </div>
                    {day.done ? (
                      <Badge className="bg-green-500">{"مكتمل"}</Badge>
                    ) : (
                      <Badge variant="outline">{"قادم"}</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}