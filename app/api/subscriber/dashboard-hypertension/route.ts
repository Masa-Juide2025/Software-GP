import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Subscriber from "@/models/Subscriber";
import HealthData from "@/models/patients_health_data"; 
import MedicalRecords from "@/models/BloodPressureRecord"; 
import DietPlan from "@/models/DietPlan"; 

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) return NextResponse.json({ success: false, error: "Email required" }, { status: 400 });

    const user = await User.findOne({ email }).lean() as any;
    const subData = await Subscriber.findOne({ userId: user?._id }).lean() as any;

    if (!subData) return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 });

    const [healthDoc, medicalDoc, latestPlan] = await Promise.all([
      HealthData.findOne({ subscriberId: subData._id }).lean(),
      MedicalRecords.findOne({ subscriberId: subData._id }).lean(),
      DietPlan.findOne({ subscriberId: subData._id }).sort({ createdAt: -1 }).lean()
    ]) as any[];

    return NextResponse.json({ 
      success: true, 
      data: {
        ...subData,
        name: user.fullName || user.name,
        dailyCalories: latestPlan?.dailyCalories || 0,
        meals: latestPlan?.meals || [], 
        medicalInfo: {
          creatinine: medicalDoc?.creatinine || "",
          urea: medicalDoc?.urea || "",
          bloodLipids: medicalDoc?.bloodLipids || "",
          fastingBloodSugar: medicalDoc?.fastingBloodSugar || "",
          currentBloodPressure: healthDoc?.healthMetrics?.bloodPressure || "120/80",
          heartRate: healthDoc?.healthMetrics?.heartRate || 72,
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

    await HealthData.findOneAndUpdate(
      { subscriberId: subData._id },
      { $set: { "healthMetrics.bloodPressure": body.bloodPressure, "healthMetrics.heartRate": body.heartRate, updatedAt: new Date() } },
      { upsert: true, new: true }
    );

    await MedicalRecords.findOneAndUpdate(
      { subscriberId: subData._id },
      { $set: { creatinine: body.creatinine, urea: body.urea, bloodLipids: body.bloodLipids, fastingBloodSugar: body.fastingBloodSugar, updatedAt: new Date() } },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, message: "تم تحديث البيانات بنجاح" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}