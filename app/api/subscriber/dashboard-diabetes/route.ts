import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Subscriber from "@/models/Subscriber";
import HealthData from "@/models/patients_health_data"; 
import DiabetesRecords from "@/models/DiabetesRecord"; 
import DietPlan from "@/models/DietPlan"; 

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

    const [healthDoc, diabetesDoc, latestPlan] = await Promise.all([
      HealthData.findOne({ subscriberId: subData._id }).lean(),
      DiabetesRecords.findOne({ subscriberId: subData._id }).lean(),
      DietPlan.findOne({ subscriberId: subData._id }).sort({ createdAt: -1 }).lean()
    ]) as any[];

    return NextResponse.json({ 
      success: true, 
      data: {
        ...subData,
        name: user.fullName || user.name,
        email: user.email,
        dailyCalories: latestPlan?.dailyCalories || 0,
        meals: latestPlan?.meals || [], 
        medicalInfo: {
          fastingBloodSugar: diabetesDoc?.fastingBloodSugar || "",
          randomBloodSugar: diabetesDoc?.randomBloodSugar || "",
          hba1c: diabetesDoc?.hba1c || "",
          ldl: diabetesDoc?.ldl || "",
          hdl: diabetesDoc?.hdl || "",
          creatinine: diabetesDoc?.creatinine || "",
          urea: diabetesDoc?.urea || "",
          bloodPressure: healthDoc?.healthMetrics?.bloodPressure || "120/80",
        } 
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
    const user = await User.findOne({ email: body.email });
    const subData = await Subscriber.findOne({ userId: user?._id });

    if (!subData) return NextResponse.json({ success: false, error: "Subscriber not found" });

    await Promise.all([
      HealthData.findOneAndUpdate(
        { subscriberId: subData._id },
        { $set: { "healthMetrics.bloodPressure": body.bloodPressure, updatedAt: new Date() } },
        { upsert: true, new: true }
      ),
      DiabetesRecords.findOneAndUpdate(
        { subscriberId: subData._id },
        { $set: { 
            fastingBloodSugar: body.fastingBloodSugar, 
            randomBloodSugar: body.randomBloodSugar, 
            hba1c: body.hba1c, 
            creatinine: body.creatinine,
            urea: body.urea,
            ldl: body.ldl,
            hdl: body.hdl,
            updatedAt: new Date() 
        } },
        { upsert: true, new: true }
      )
    ]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}