import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Nutritionist from "@/models/Nutritionist";
import Subscriber from "@/models/Subscriber"; // جدول المشترك الوسيط
import PregnantMother from "@/models/PregnantMother";
import DietPlan from "@/models/DietPlan";
import Appointment from "@/models/Appointment"; // تأكدي من استيراد موديل المواعيد
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    // 1. جلب اليوزر الأساسي للأخصائي
    const userDoc = await User.findOne({ email }).lean() as any;
    if (!userDoc) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // 2. جلب سجل الأخصائي من جدول Nutritionist
    const nutritionistDoc = await Nutritionist.findOne({ userId: userDoc._id }).lean() as any;
    if (!nutritionistDoc) return NextResponse.json({ error: "Nutritionist record not found" }, { status: 404 });

    const nutritionistId = nutritionistDoc._id; // هذا هو الـ ID المطلوب

    // 3. عد الخطط بناءً على ID الأخصائي
    const dietPlansCount = await DietPlan.countDocuments({ nutritionistId: nutritionistId });

    // --- 🕵️‍♂️ [بداية] جزئية المواعيد المنقولة من الكود الأول ---
    console.log("--- فحص المواعيد بدأت ---");
    const allApps = await Appointment.find({ nutritionistId: nutritionistId }).lean();
    
    // الحصول على تاريخ اليوم حسب توقيت الأردن (Asia/Amman)
    const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Amman' }); 
    console.log("تاريخ اليوم المستهدف:", todayStr);

    const todayAppointments = allApps.filter((app: any) => {
      if (!app.date) return false;
      const appDateStr = new Date(app.date).toLocaleDateString('en-CA', { timeZone: 'Asia/Amman' });
      const isMatch = appDateStr === todayStr;
      if (isMatch) console.log(`✅ تم العثور على موعد مطابق لـ: ${app.subscriberName}`);
      return isMatch;
    });

    console.log("عدد مواعيد اليوم المكتشفة:", todayAppointments.length);
    console.log("--- فحص المواعيد انتهى ---");
    // --- [نهاية] جزئية المواعيد ---

    // 4. جلب قائمة الحوامل بالربط المتسلسل (من الكود الثاني الأصلي)
    const pregnantRecords = await PregnantMother.find({ nutritionistId: nutritionistId }).lean();

    const subscribersList = await Promise.all(
      pregnantRecords.map(async (record: any) => {
        const subscriberDoc = await Subscriber.findById(record.subscriberId).lean() as any;
        
        let finalName = "مشتركة";
        if (subscriberDoc) {
          const userDetail = await User.findById(subscriberDoc.userId).select("fullName name").lean() as any;
          finalName = userDetail?.fullName || userDetail?.name || "مشتركة";
        }

        return {
          _id: record._id,
          name: finalName,
          gestationalWeek: record.pregnancyDetails?.gestationalWeek || 0,
          trimester: record.pregnancyDetails?.trimester || "غير محدد",
          nextVisitDate: record.pregnancyDetails?.nextVisitDate,
        };
      })
    );

    return NextResponse.json({
      displayName: userDoc.fullName || userDoc.name || "الأخصائي",
      specialization: nutritionistDoc.specialization,
      currentSubscribers: subscribersList.length,
      maxSubscribers: nutritionistDoc.maxSubscribers || 20,
      rating: nutritionistDoc.rating || 5.0,
      dietPlansCount,
      subscribersList,
      // البيانات المحدثة للمواعيد
      todayAppointments: JSON.parse(JSON.stringify(todayAppointments)),
      appointmentsCount: todayAppointments.length
    });

  } catch (error: any) {
    console.error("Critical Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}