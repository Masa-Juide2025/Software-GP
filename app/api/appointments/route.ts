import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Nutritionist from "@/models/Nutritionist";
import Trainer from "@/models/Trainer"; // أضفنا استيراد موديل المدرب
import Appointment from "@/models/Appointment"; 

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const dateStr = searchParams.get("date");

    if (!email || !dateStr) return NextResponse.json({ success: false });

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ success: false, error: "User not found" });

    // محاولة البحث في جدول الأخصائي، وإذا لم يوجد نبحث في جدول المدرب
    let provider = await Nutritionist.findOne({ userId: user._id });
    if (!provider) {
      provider = await Trainer.findOne({ userId: user._id });
    }

    if (!provider) return NextResponse.json({ success: false, error: "Provider not found" });

    // جلب المواعيد (البحث باستخدام ID الأخصائي أو المدرب)
    // نستخدم toString() لحل مشكلة الـ String ID اللي حكينا عنها
    const providerId = provider._id.toString();
    
    // ملاحظة: تأكدي إن حقل الـ ID في المواعيد اسمه nutritionistId أو trainerId
    // هنا سنبحث في الحقلين لضمان الدقة
    const allApps = await Appointment.find({ 
      $or: [
        { nutritionistId: providerId },
        { trainerId: providerId }
      ] 
    }).lean();

    // الفلترة البرمجية الناجحة تبعتك
    const filtered = allApps.filter((app: any) => {
      if (!app.date) return false;
      const d = new Date(app.date);
      const formatted = d.toISOString().split('T')[0];
      return formatted === dateStr;
    });

    return NextResponse.json({ 
      success: true, 
      appointments: JSON.parse(JSON.stringify(filtered)),
      // جلب الأيام المتاحة من أي جدول منهم
      availableDays: provider?.availableDays || provider?.availabilityDays || [] 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { email, subscriberName, date, time, type } = body;

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ success: false, error: "User not found" });

    // البحث عن المزود (مدرب أو أخصائي)
    let provider = await Nutritionist.findOne({ userId: user._id });
    if (!provider) {
      provider = await Trainer.findOne({ userId: user._id });
    }

    if (!provider) return NextResponse.json({ success: false, error: "Provider not found" });

    // إنشاء الموعد
    const newAppointment = await Appointment.create({
      // نضع الـ ID في الحقل المناسب (إذا كان مدرب نضعه في trainerId، وإذا أخصائي في nutritionistId)
      // أو نضعه في كلاهما لضمان عدم كسر الـ Schema
      nutritionistId: provider._id, 
      trainerId: provider._id, 
      subscriberName,
      date: new Date(date),
      time,
      type,
      status: "upcoming"
    });

    return NextResponse.json({ success: true, appointment: newAppointment });
  } catch (error: any) {
    console.error("POST Error:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}