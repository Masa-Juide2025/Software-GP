import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Nutritionist from "@/models/Nutritionist";
import Subscriber from "@/models/Subscriber";
import DietPlan from "@/models/DietPlan";
import Appointment from "@/models/Appointment"; 
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    // جلب اليوزر بنظام lean() لضمان رؤية الحقول
    const user = await User.findOne({ email }).lean();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const details = await Nutritionist.findOne({ userId: user._id }).lean();
    if (!details) return NextResponse.json({ error: "Nutritionist not found" }, { status: 404 });

    const dietPlansCount = await DietPlan.countDocuments({ nutritionistId: details._id });

    // --- 🕵️‍♂️ منطقة الفحص المحدثة لحل مشكلة التاريخ ---
    console.log("--- فحص المواعيد بدأت ---");
    
    // جلب كل المواعيد
    const allApps = await Appointment.find({ nutritionistId: details._id }).lean();
    
    // الحصول على تاريخ اليوم حسب التوقيت المحلي (ضمان تطابق اليوم)
    const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Amman' }); 
    console.log("تاريخ اليوم المستهدف:", todayStr);

    const todayAppointments = allApps.filter((app: any) => {
      if (!app.date) return false;
      
      // تحويل تاريخ الموعد من الداتا بيس للتوقيت المحلي للمقارنة
      const appDateStr = new Date(app.date).toLocaleDateString('en-CA', { timeZone: 'Asia/Amman' });
      
      const isMatch = appDateStr === todayStr;
      if (isMatch) console.log(`✅ تم العثور على موعد مطابق لـ: ${app.subscriberName}`);
      return isMatch;
    });

    console.log("عدد مواعيد اليوم المكتشفة:", todayAppointments.length);
    console.log("--- فحص المواعيد انتهى ---");
    // ---------------------------------------------

    const subscribersList = await Subscriber.aggregate([
      { $match: { nutritionistId: new mongoose.Types.ObjectId(details._id.toString()) } },
      {
        $lookup: {
          from: "User", 
          localField: "userId",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          _id: 1,
          name: { $ifNull: ["$userInfo.fullName", "$userInfo.name", "مشترك"] },
          weight: { $ifNull: ["$weight", 0] },
          goal: { $ifNull: ["$goal", "خسارة وزن"] },
          package: { $ifNull: ["$package", "عادي"] },
          dailyCalories: { $ifNull: ["$dailyCalories", 0] }
        }
      }
    ]);

    return NextResponse.json({
      displayName: user.fullName || user.name || (user as any).fullName || "الأخصائي",
      specialization: details.specialization,
      currentSubscribers: details.currentSubscribers || 0,
      maxSubscribers: details.maxSubscribers || 0,
      rating: details.rating || 4.9,
      dietPlansCount,
      subscribersList,
      // نرسل البيانات المفلترة للداشبورد
      todayAppointments: JSON.parse(JSON.stringify(todayAppointments)),
      appointmentsCount: todayAppointments.length
    });

  } catch (error) {
    console.error("Critical Error in Dashboard API:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}