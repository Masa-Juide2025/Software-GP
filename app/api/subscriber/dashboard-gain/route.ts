import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";
import User from "@/models/User";
import DietPlan from "@/models/DietPlan";
import Progress from "@/models/progress";
import WorkoutProgram from "@/models/WorkoutPlan"; 

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) return NextResponse.json({ success: false, error: "Email required" }, { status: 400 });

    const user = await User.findOne({ email }).lean() as any;
    if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

    const subData = await Subscriber.findOne({ userId: user._id }).lean() as any;
    if (!subData) return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 });

    const height = subData.height || 0; 
    const idealWeight = height > 0 ? parseFloat((50 + 0.9 * (height - 152.4)).toFixed(1)) : 0;
    

    const latestProgress = await Progress.findOne({ subscriberId: subData._id }).sort({ createdAt: -1 }).lean() as any;
    const latestPlan = await DietPlan.findOne({ subscriberId: subData._id }).sort({ createdAt: -1 }).lean() as any;
    
    // جلب برنامج التمرين
    const workoutData = await WorkoutProgram.findOne({ subscriberId: subData._id }).sort({ createdAt: -1 }).lean() as any;

    return NextResponse.json({ 
      success: true, 
      data: {
        ...subData,
        name: user.fullName || user.name,
        dailyCalories: latestPlan?.dailyCalories || 1500,
        meals: latestPlan?.meals || [],
        macros: latestPlan?.macros || { carbsCalories: 0, proteinCalories: 0, fatCalories: 0 },
        weight: latestProgress?.currentWeight || subData.weight, 
        startingWeight: subData.weight, 
        targetWeight: idealWeight,
        workoutPlan: workoutData?.exercises || [] // جلب التمارين مع الـ videoUrl إن وجد
      } 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}