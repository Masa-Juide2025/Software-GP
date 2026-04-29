import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Subscriber from "@/models/Subscriber";
import PregnantMother from "@/models/PregnantMother";
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

    const [latestPlan, workoutData, pregnancyDoc] = await Promise.all([
      DietPlan.findOne({ subscriberId: subData._id }).sort({ createdAt: -1 }).lean(),
      WorkoutProgram.findOne({ subscriberId: subData._id }).sort({ createdAt: -1 }).lean(),
      PregnantMother.findOne({ subscriberId: subData._id }).lean()
    ]) as any[];

    // المنطق الجديد: الوزن يكون null إذا لم تدخله الأم في سجل الحمل
    const currentWeight = pregnancyDoc?.healthMetrics?.weight ?? null;

    const pregnancyInfo = pregnancyDoc ? {
      bloodPressure: pregnancyDoc.healthMetrics?.bloodPressure || "--",
      hemoglobin: pregnancyDoc.healthMetrics?.hemoglobin || 0,
      gestationalWeek: pregnancyDoc.pregnancyDetails?.gestationalWeek || 0,
      trimester: pregnancyDoc.pregnancyDetails?.trimester || 0,
      numberOfChildren: pregnancyDoc.pregnancyDetails?.numberOfChildren || 0,
      currentWeight: currentWeight,
      supplements: pregnancyDoc.medicalInfo?.supplements || [],
      expectedDeliveryDate: pregnancyDoc.pregnancyDetails?.expectedDeliveryDate || null,
      weeklyWeightLog: pregnancyDoc.healthMetrics?.weeklyWeightLog || []
    } : null;

    return NextResponse.json({ 
      success: true, 
      data: {
        ...subData,
        name: user.fullName || user.name,
        dailyCalories: latestPlan?.dailyCalories || 0,
        meals: latestPlan?.meals || [],
        weight: currentWeight, 
        startingWeight: subData.startingWeight || subData.weight || 0,
        workoutPlan: workoutData?.exercises || [],
        pregnancyInfo: pregnancyInfo 
      } 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { 
      email, currentWeight, bloodPressure, hemoglobin, 
      gestationalWeek, trimester, numberOfChildren,
      newWeightEntry 
    } = body;

    const user = await User.findOne({ email });
    const subData = await Subscriber.findOne({ userId: user?._id });
    if (!subData) return NextResponse.json({ success: false, error: "Subscriber not found" }, { status: 404 });

    const updateQuery: any = {
      $set: {
        "healthMetrics.weight": currentWeight ? Number(currentWeight) : null,
        "healthMetrics.bloodPressure": bloodPressure,
        "healthMetrics.hemoglobin": Number(hemoglobin),
        "pregnancyDetails.gestationalWeek": Number(gestationalWeek),
        "pregnancyDetails.trimester": Number(trimester),
        "pregnancyDetails.numberOfChildren": Number(numberOfChildren),
        updatedAt: new Date()
      }
    };

    if (newWeightEntry && newWeightEntry.weight) {
      updateQuery.$push = {
        "healthMetrics.weeklyWeightLog": {
          week: Number(newWeightEntry.week),
          weight: Number(newWeightEntry.weight),
          date: new Date()
        }
      };
    }

    await PregnantMother.findOneAndUpdate(
      { subscriberId: subData._id },
      updateQuery,
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, message: "تم التحديث بنجاح" }); 
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}