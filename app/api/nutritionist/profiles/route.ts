import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Nutritionist from "@/models/Nutritionist";
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

    const updatedNutritionist = await Nutritionist.findOneAndUpdate(
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

    return NextResponse.json({ success: true, data: updatedNutritionist });
  } catch (error) {
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

    const nutritionist = await Nutritionist.findOne({ userId: user._id }).lean() as any;

    // --- منطق جلب اسم المركز الجديد ---
    let sportClubName = "غير مرتبط بمركز حالياً";
    const db = mongoose.connection.db;

    if (nutritionist && db) {
      // 1. البحث عن رقم المركز في جدول Enrollments باستخدام رقم الأخصائي
      const enrollment = await db.collection("Enrollments").findOne({ 
        nutritionistId: nutritionist._id.toString() 
      });

      if (enrollment && enrollment.centerId) {
        // 2. البحث عن اسم المركز في جدول Centers
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
        ...nutritionist,
        email: user.email,
        phone: user.phone,
        fullName: user.fullName || user.name,
        availableDays: nutritionist?.availableDays || [],
        sportClubName: sportClubName // إرسال الاسم للصفحة
      }
    });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}