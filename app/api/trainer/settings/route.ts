import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Trainer from "@/models/Trainer"; // استخدام موديل المدرب
import mongoose from "mongoose";

export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { email, phone, specialization, bio, experienceYears, maxSubscribers, availableDays, password } = body;

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return NextResponse.json({ success: false, error: "المستخدم غير موجود" }, { status: 404 });

    const userUpdateData: any = { phone };
    if (password && password.trim() !== "") {
      userUpdateData.password = password;
    }

    await User.findByIdAndUpdate(user._id, userUpdateData);

    // التحديث في جدول الـ Trainer
    const updatedTrainer = await Trainer.findOneAndUpdate(
      { userId: user._id },
      {
        $set: {
          specialization,
          bio,
          experienceYears: Number(experienceYears),
          maxSubscribers: Number(maxSubscribers),
          availableDays: availableDays || [] 
        }
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, data: updatedTrainer });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ success: false, error: "فشل في تحديث قاعدة البيانات" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    const user = await User.findOne({ email: email?.toLowerCase().trim() }).lean() as any;
    if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

    // جلب بيانات المدرب
    const trainer = await Trainer.findOne({ userId: user._id }).lean() as any;

    // --- منطق جلب اسم المركز (نفس منطق الأخصائي) ---
    let sportClubName = "غير مرتبط بمركز حالياً";
    const db = mongoose.connection.db;

    if (trainer && db) {
      // البحث في جدول Enrollments باستخدام trainerId (لأننا في روت المدرب)
      const enrollment = await db.collection("Enrollments").findOne({ 
        trainerId: trainer._id.toString() 
      });

      if (enrollment && enrollment.centerId) {
        const centerId = enrollment.centerId;
        const centerDoc = await db.collection("Centers").findOne({
          $or: [
            { _id: centerId },
            { _id: mongoose.Types.ObjectId.isValid(centerId) ? new mongoose.Types.ObjectId(centerId) : null }
          ]
        });

        if (centerDoc) {
          sportClubName = centerDoc.name;
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...trainer,
        email: user.email,
        phone: user.phone,
        fullName: user.fullName || user.name,
        availableDays: trainer?.availableDays || [],
        sportClubName: sportClubName 
      }
    });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}