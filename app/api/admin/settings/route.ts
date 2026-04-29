import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import mongoose from "mongoose";

// التأكد من استخدام اسم الجدول الصغير 'notifications' كما في MongoDB Compass
const NotificationSchema = mongoose.models.notifications || mongoose.model("notifications", new mongoose.Schema({
  title: String,
  message: String,
  isRead: { type: Boolean, default: false },
  subscriberId: mongoose.Schema.Types.ObjectId,
  nutritionistId: mongoose.Schema.Types.ObjectId,
  type: String,
  createdAt: { type: Date, default: Date.now },
}), "notifications"); 

export async function GET() {
  try {
    await connectDB();

    // جلب الأخصائيين
    const specialists = await User.find({
      role: { $in: ["trainer", "nutritionist"] },
    }).lean();

    const formattedSpecialists = specialists.map((user: any) => ({
      id: user._id.toString(),
      name: user.fullName || user.name || "مستخدم",
      role: user.role,
    }));

    // جلب الإشعارات من الجدول الصغير 'notifications'
    const notificationsList = await mongoose.models.notifications.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return NextResponse.json({ 
      success: true, 
      data: formattedSpecialists, 
      notifications: notificationsList 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}