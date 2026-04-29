export type UserRole = "admin" | "nutritionist" | "trainer" | "subscriber"

export type SubscriptionPlan = "basic" | "premium" | "vip"

export type SubscriptionStatus = "active" | "expired" | "suspended" | "trial"

export type Gender = "male" | "female"

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: UserRole
  avatar?: string
  createdAt: string
}

// التعديل الأساسي هنا لحل كل مشاكل الـ Dashboard والـ Settings
export interface Subscriber extends User {
  role: "subscriber"
  gender: Gender
  age: number
  height: number
  weight: number
  targetWeight: number
  // إضافة goal ضروري جداً لعمل الـ switch case في الكود الخاص بك
  goal: "weight_loss" | "weight_gain" | "sports_nutrition" | "diabetes" | "hypertension" | "pregnancy"
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active"
  healthConditions: string[]
  allergies: string[]
  subscriptionPlan: SubscriptionPlan
  subscriptionStatus: SubscriptionStatus
  subscriptionStart: string
  subscriptionEnd: string
  assignedNutritionist?: string
  assignedTrainer?: string
  bmi: number
  dailyCalories: number
  waterTarget: number
}

export interface Specialist extends User {
  role: "nutritionist" | "trainer"
  specialization: string
  bio: string
  experience: number
  rating: number
  activeSubscribers: number
  maxSubscribers: number
  availability: string[]
}

export interface MealPlan {
  id: string
  subscriberId: string
  nutritionistId: string
  date: string
  meals: Meal[]
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
}

export interface Meal {
  id: string
  type: "breakfast" | "lunch" | "dinner" | "snack"
  name: string
  items: FoodItem[]
  calories: number
  time: string
}

export interface FoodItem {
  name: string
  quantity: number
  unit: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface ExercisePlan {
  id: string
  subscriberId: string
  trainerId: string
  date: string
  exercises: Exercise[]
  totalDuration: number
  totalCaloriesBurned: number
}

export interface Exercise {
  id: string
  name: string
  sets: number
  reps: number
  duration: number
  caloriesBurned: number
  muscleGroup: string
}

export interface DashboardStats {
  totalSubscribers: number
  activeSubscribers: number
  totalSpecialists: number
  monthlyRevenue: number
  newSubscribersThisMonth: number
  expiringSubscriptions: number
  averageBmi: number
  subscriberGrowth: number
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "success" | "error"
  read: boolean
  createdAt: string
}

export type PendingRequestStatus = "pending" | "approved" | "rejected"

export interface PendingRequest {
  id: string
  name: string
  email: string
  phone: string
  gender: Gender
  role: "nutritionist" | "trainer"
  specialization: string
  experience: number
  bio: string
  workingHours: string
  availableDays: string[]
  maxSubscribers: number
  certificates: string[]
  status: PendingRequestStatus
  submittedAt: string
}