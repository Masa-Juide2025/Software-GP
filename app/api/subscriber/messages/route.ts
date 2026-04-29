import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";
import User from "@/models/User";
import Trainer from "@/models/Trainer";
import Nutritionist from "@/models/Nutritionist";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const otherId = searchParams.get("otherId");

    if (!email) return NextResponse.json({ success: false });

    const currentUser = await User.findOne({ email }).lean() as any;
    const subData = await Subscriber.findOne({ userId: currentUser._id }).lean() as any;

    let contacts: any[] = [];
    let messagesList: any[] = [];

    if (subData) {
      // جلب المدرب (نضع الـ ID الخاص به لنتعامل معه في حقل nutritionistId لاحقاً)
      if (subData.trainerId) {
        const tRec = await Trainer.findById(subData.trainerId).lean() as any;
        const tU = await User.findById(tRec?.userId).select("fullName name").lean() as any;
        if (tU) contacts.push({ id: subData.trainerId.toString(), name: tU.fullName || tU.name, role: "trainer", label: "المدرب الرياضي" });
      }
      // جلب الأخصائي
      if (subData.nutritionistId) {
        const nRec = await Nutritionist.findById(subData.nutritionistId).lean() as any;
        const nU = await User.findById(nRec?.userId).select("fullName name").lean() as any;
        if (nU) contacts.push({ id: subData.nutritionistId.toString(), name: nU.fullName || nU.name, role: "nutritionist", label: "أخصائي التغذية" });
      }

      // جلب الرسائل بناءً على الحقل الموحد nutritionistId
      if (otherId) {
        messagesList = await db?.collection("Message").find({
          subscriberId: subData._id,
          nutritionistId: new mongoose.Types.ObjectId(otherId)
        }).sort({ createdAt: 1 }).toArray() as any[];
      }
    }

    return NextResponse.json({
      success: true,
      subObjectId: subData?._id,
      contacts,
      messages: messagesList
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    const { subObjectId, otherId, content } = await req.json();

    // تخزين الرسالة في حقل nutritionistId دائماً لتوحيد الهيكلية كما طلبت
    await db?.collection("Message").insertOne({
      subscriberId: new mongoose.Types.ObjectId(subObjectId),
      nutritionistId: new mongoose.Types.ObjectId(otherId), 
      message: content.trim(),
      sender: "subscriber",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}