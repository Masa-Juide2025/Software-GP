import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";
import User from "@/models/User";
import Trainer from "@/models/Trainer";
import Nutritionist from "@/models/Nutritionist";
import Progress from "@/models/progress";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) return NextResponse.json({ success: false, error: "Email required" }, { status: 400 });

    const currentUser = await User.findOne({ email }).lean() as any;
    if (!currentUser) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

    const subData = await Subscriber.findOne({ userId: currentUser._id }).lean() as any;
    if (!subData) return NextResponse.json({ success: false, error: "Subscriber profile not found" }, { status: 404 });

    let tName = "مدرب غير محدد";
    if (subData.trainerId) {
      const tRec = await Trainer.findById(subData.trainerId).lean() as any;
      if (tRec?.userId) {
        const tU = await User.findById(tRec.userId).select("fullName name").lean() as any;
        tName = tU?.fullName || tU?.name || tName;
      }
    }

    let nName = "أخصائي غير محدد";
    if (subData.nutritionistId) {
      const nRec = await Nutritionist.findById(subData.nutritionistId).lean() as any;
      if (nRec?.userId) {
        const nU = await User.findById(nRec.userId).select("fullName name").lean() as any;
        nName = nU?.fullName || nU?.name || nName;
      }
    }

    const weightHistory = await Progress.find({ subscriberId: subData._id }).sort({ createdAt: -1 }).lean() as any;

    return NextResponse.json({ 
      success: true, 
      data: {
        userName: currentUser.fullName || currentUser.name || "مشترك",
        trainerName: tName,
        nutritionistName: nName,
        trainerId: subData.trainerId,
        nutritionistId: subData.nutritionistId,
        subscriberId: subData._id,
        weightHistory: weightHistory.map((p: any) => ({
          date: new Date(p.createdAt).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' ,year: 'numeric'}),
          weight: p.currentWeight
        }))
      } 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    const body = await req.json();
    const { action, email, feedbackData, weight } = body;

    const user = await User.findOne({ email });
    const sub = await Subscriber.findOne({ userId: user?._id });
    if (!sub) return NextResponse.json({ success: false, error: "Subscriber not found" });

    // --- كود الفيدباك ---
    if (action === "sendMessage") {
      const isTrainer = feedbackData.targetType === "trainer";
      await db?.collection("feedbacks").insertOne({
        subscriberId: sub._id,
        trainerId: isTrainer ? new mongoose.Types.ObjectId(feedbackData.targetId) : null,
        nutritionistId: !isTrainer ? new mongoose.Types.ObjectId(feedbackData.targetId) : null,
        content: feedbackData.message.trim(),
        rating: feedbackData.rating,
        category: "اقتراح", 
        isRead: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return NextResponse.json({ success: true });
    }

    // --- كود تحديث الوزن (تم إزالة التحديث لجدول المشترك) ---
    if (action === "updateWeight") {
      const numericWeight = parseFloat(weight);
      
      // التخزين فقط في جدول Progress ليبقى تاريخ الأوزان مسجل
      await Progress.create({
        subscriberId: sub._id,
        nutritionistId: sub.nutritionistId || null,
        currentWeight: numericWeight,
        progressPercentage: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // ملاحظة: تم حذف السطر اللي بيعدل على جدول Subscriber
      // هيك حقل الوزن في Subscriber بضل "وزن البداية" الثابت
      
      return NextResponse.json({ success: true });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}