import { connectDB } from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber"; 
import Nutritionist from "@/models/Nutritionist";
import User from "@/models/User"; 
import PatientsHealthData from "@/models/patients_health_data"; 
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

// --- 1. جلب قائمة المرضى (تمت إضافة حقل goal للبيانات العائدة) ---
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const userAccount = await User.findOne({ email: email.toLowerCase() });
    const nutritionist = await Nutritionist.findOne({ userId: userAccount?._id });
    if (!nutritionist) return NextResponse.json({ error: "Nutritionist not found" }, { status: 404 });

    const subscribers = await Subscriber.find({ 
      nutritionistId: nutritionist._id,
      goal: { 
        $in: [
          "Follow-up of a diabetic patient", 
          "Monitoring a patient with high blood pressure"
        ] 
      } 
    }).populate({ path: 'userId', model: User }).lean();

    const combinedData = await Promise.all(subscribers.map(async (sub: any) => {
      const healthData = await PatientsHealthData.findOne({ subscriberId: sub._id }).lean();
      return {
        _id: sub._id.toString(),
        nutritionistId: nutritionist._id.toString(),
        displayName: sub.userId?.fullName || sub.userId?.name || "مريض",
        goal: sub.goal, // <--- هذا السطر هو مفتاح الحل لعرض البادج الصح في الصفحة
        email: sub.userId?.email,
        phone: sub.userId?.phoneNumber || sub.userId?.phone,
        age: sub.age,
        weight: sub.weight,
        gender: sub.gender,
        healthMetrics: healthData?.healthMetrics || { bloodSugar: "--", bloodPressure: "--", heartRate: "--" },
        medicalInfo: healthData?.medicalInfo || { medications: [], forbiddenFoods: [], supplements: [] },
      };
    }));
    return NextResponse.json(combinedData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- 2. إرسال الرسائل والملاحظات (كما هي تماماً بدون تغيير) ---
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { subscriberId, nutritionistId, message, type } = body;

    const db = mongoose.connection.db;

    if (type === "note") {
        const result = await db?.collection("note").insertOne({
            subscriberId: new mongoose.Types.ObjectId(subscriberId),
            nutritionistId: new mongoose.Types.ObjectId(nutritionistId),
            note: message, 
            createdAt: new Date(),
            updatedAt: new Date(),
            __v: 0
        });
        console.log("✅ انحفظت في جدول الملاحظات:", result?.insertedId);
        return NextResponse.json({ success: true, data: result });
    }

    const result = await db?.collection("Message").insertOne({
      subscriberId: new mongoose.Types.ObjectId(subscriberId),
      nutritionistId: new mongoose.Types.ObjectId(nutritionistId),
      message: message,
      sender: "nutritionist",
      createdAt: new Date(),
      updatedAt: new Date(),
      __v: 0
    });

    console.log("✅ انحفظت خاوة في جدول Message:", result?.insertedId);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("❌ فشل الحفظ:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}