import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import DietPlan from "@/models/DietPlan";
import WorkoutPlan from "@/models/WorkoutPlan";
import Payment from "@/models/Payment";
import DailyLog from "@/models/DailyLog";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();

    // 1. جلب البيانات مع إضافة شرط البحث عن الحالتين (approved و active)
    const [
      subscribersCount,
      nutritionistsCount,
      trainersCount,
      dietCount,
      workoutCount,
      allPayments,
      totalLogs
    ] = await Promise.all([
      User.countDocuments({ role: "subscriber" }),
      
      // ✅ تعديل هنا: نعد الأخصائيين المقبولين والنشطين معاً باستخدام $in
      User.countDocuments({ 
        role: "nutritionist", 
        status: { $in: ["approved", "active"] } 
      }), 

      // ✅ تعديل هنا: نعد المدربين المقبولين والنشطين معاً باستخدام $in
      User.countDocuments({ 
        role: "trainer", 
        status: { $in: ["approved", "active"] } 
      }), 
      
      DietPlan.countDocuments({}),
      WorkoutPlan.countDocuments({}),
      Payment.find({ status: "completed" }),
      DailyLog.countDocuments({ status: true }) 
    ]);

    // 2. حساب إجمالي الإيرادات
    const totalRevenue = allPayments.reduce((acc, curr) => {
      return acc + (Number(curr.amount) || 0);
    }, 0);

    // 3. حساب نسبة الالتزام
    let calculatedAdherence = 0;
    if (subscribersCount > 0) {
      const targetLogs = subscribersCount; 
      calculatedAdherence = Math.round((totalLogs / targetLogs) * 100);
    }

    const finalAdherence = Math.min(Math.max(calculatedAdherence, 0), 100);

    return NextResponse.json({
      totalSubscribers: subscribersCount || 0,
      totalNutritionists: nutritionistsCount || 0,
      totalTrainers: trainersCount || 0,
      totalDietPlans: dietCount || 0,
      totalWorkoutPlans: workoutCount || 0,
      monthlyRevenue: totalRevenue || 0,
      avgAdherence: finalAdherence,
    });

  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}