// app/api/admin/plans/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import DietPlan from "@/models/DietPlan"; 
import WorkoutPlan from "@/models/WorkoutPlan"; 

export async function GET() {
  try {
    await connectDB();
    // جلب البيانات من المجموعات الصحيحة: dietPlans و workoutPrograms
    const dietPlans = await DietPlan.find({}).lean();
    const workoutPlans = await WorkoutPlan.find({}).lean();

    return NextResponse.json({
      success: true,
      data: { dietPlans, workoutPlans }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}