import { connectDB } from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber"; 
import Nutritionist from "@/models/Nutritionist";
import User from "@/models/User"; 
import PregnantMother from "@/models/PregnantMother";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const subscriberId = searchParams.get("subscriberId");

    const db = mongoose.connection.db;

    if (subscriberId) {
      const notes = await db?.collection("note")
        .find({ subscriberId: new mongoose.Types.ObjectId(subscriberId) })
        .sort({ createdAt: -1 })
        .toArray();
      return NextResponse.json({ notes });
    }

    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const userAccount = await User.findOne({ email: email.toLowerCase() });
    const nutritionist = await Nutritionist.findOne({ userId: userAccount?._id });
    if (!nutritionist) return NextResponse.json({ error: "Nutritionist not found" }, { status: 404 });

    const subscribers = await Subscriber.find({ nutritionistId: nutritionist._id })
      .populate({ path: 'userId', model: User })
      .lean();

    const mothersData = await Promise.all(subscribers.map(async (sub: any) => {
      const details = await PregnantMother.findOne({ subscriberId: sub._id }).lean();
      if (!details) return null;

      return {
        _id: sub._id.toString(),
        nutritionistId: nutritionist._id.toString(),
        name: sub.userId?.fullName || sub.userId?.name || "مستخدم",
        email: sub.userId?.email || "",
        phone: sub.userId?.phone || "غير متوفر",
        age: sub.age || "---",
        status: details.pregnancyDetails?.trimester || "حامل", 
        weekOrMonths: details.pregnancyDetails?.gestationalWeek || 0,
        children: details.pregnancyDetails?.numberOfChildren || 0,
        nextVisit: details.pregnancyDetails?.nextVisitDate 
                    ? new Date(details.pregnancyDetails.nextVisitDate).toLocaleDateString('ar-EG') 
                    : "غير محدد",
        notes: details.notes || "لا توجد ملاحظات"
      };
    }));

    return NextResponse.json(mothersData.filter(m => m !== null));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { subscriberId, nutritionistId, note, message } = body;

    const db = mongoose.connection.db;

    // حفظ الملاحظة الخاصة في كوليكشن note
    if (note) {
      const result = await db?.collection("note").insertOne({
        subscriberId: new mongoose.Types.ObjectId(subscriberId),
        nutritionistId: new mongoose.Types.ObjectId(nutritionistId),
        note: note,
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0
      });
      return NextResponse.json({ success: true, data: result });
    }

    // حفظ التوصية الطبية في كوليكشن message
    if (message) {
      const result = await db?.collection("message").insertOne({
        subscriberId: new mongoose.Types.ObjectId(subscriberId),
        nutritionistId: new mongoose.Types.ObjectId(nutritionistId),
        message: message,
        sender: "nutritionist",
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0
      });
      return NextResponse.json({ success: true, data: result });
    }

    return NextResponse.json({ error: "No content provided" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}