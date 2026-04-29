import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Trainer from "@/models/Trainer"; 
import Appointment from "@/models/Appointment"; 
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } }).lean();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const details = await Trainer.findOne({ userId: user._id }).lean();
    if (!details) return NextResponse.json({ error: "Trainer profile not found" }, { status: 404 });

    // --- 🕵️‍♂️ حل مشكلة الـ String ID في المواعيد ---
    
    // تحويل الـ ObjectId لـ String عشان يطابق اللي عندك في جدول المواعيد
    const trainerIdStr = details._id.toString();

    // البحث باستخدام الستيرنج
    const allApps = await Appointment.find({ trainerId: trainerIdStr }).lean();
    
    // تاريخ اليوم حسب توقيت الأردن
    const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Amman' }); 

    const todayAppointments = allApps.filter((app: any) => {
      if (!app.date) return false;
      const appDateStr = new Date(app.date).toLocaleDateString('en-CA', { timeZone: 'Asia/Amman' });
      return appDateStr === todayStr;
    });

    return NextResponse.json({
      displayName: user.fullName || user.name || "الكابتن",
      specialization: details.specialization || "مدرب رياضي",
      currentSubscribers: details.currentSubscribers || 0,
      maxSubscribers: details.maxSubscribers || 50,
      rating: details.rating || 5.0,
      todayAppointments: JSON.parse(JSON.stringify(todayAppointments)),
      appointmentsCount: todayAppointments.length
    });

  } catch (error: any) {
    console.error("Critical Error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}