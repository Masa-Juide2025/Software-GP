import { connectDB } from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber"; 
import Nutritionist from "@/models/Nutritionist";
import User from "@/models/User"; 
import Progress from "@/models/progress"; 
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// إعدادات لضمان جلب بيانات حية دائماً ومنع الكاش
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    // 1. الاتصال بقاعدة البيانات
    await connectDB();

    // 2. استخراج الإيميل من الـ URL
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "البريد الإلكتروني مطلوب (Email is required)" }, { status: 400 });
    }

    // 3. العثور على حساب المستخدم (User) المرتبط بالإيميل
    const userAccount = await User.findOne({ email: email.toLowerCase() });
    if (!userAccount) {
      return NextResponse.json({ error: "حساب الأخصائي غير موجود" }, { status: 404 });
    }

    // 4. العثور على بروفايل الأخصائي (Nutritionist) باستخدام userId
    const nutritionist = await Nutritionist.findOne({ userId: userAccount._id });
    if (!nutritionist) {
      return NextResponse.json({ error: "لم يتم العثور على بيانات أخصائي لهذا الحساب" }, { status: 404 });
    }

    // 5. جلب المشتركين الذين يتبعون لهذا الأخصائي حصراً + فلترة الهدف (lose_weight)
    // التعديل هنا: أضفنا goal: "lose_weight" داخل الاستعلام
    const subscribersRaw = await Subscriber.find({ 
      nutritionistId: nutritionist._id,
      goal: "lose_weight" 
    }).populate({
      path: 'userId', 
      select: 'fullName name email image phone phoneNumber mobile createdAt',
      model: User
    }).lean();

    // 6. الربط مع جدول التقدم (Progress) لجلب الوزن الحالي
    const subscribersWithProgress = await Promise.all(subscribersRaw.map(async (sub) => {
      
      // البحث عن آخر سجل وزن للمشترك في كولكشن progress
      const latestProgressRecord = await Progress.findOne({ 
        subscriberId: sub._id 
      })
      .sort({ createdAt: -1 }) 
      .lean();

      // وزن البداية المسجل عند الاشتراك
      const startWeight = sub.weight || 0; 
      
      // الوزن الحالي من جدول التقدم
      const currentWeight = latestProgressRecord ? latestProgressRecord.currentWeight : startWeight;

      return {
        ...sub,
        nutritionistId: nutritionist._id,
        registrationWeight: startWeight,
        currentWeight: currentWeight,
        latestProgress: latestProgressRecord ? {
          currentWeight: latestProgressRecord.currentWeight, 
          progressPercentage: latestProgressRecord.progressPercentage,
          updatedAt: latestProgressRecord.createdAt
        } : null
      };
    }));

    // 7. إرسال الاستجابة مع ترويسات تمنع الكاش
    return NextResponse.json(subscribersWithProgress, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

  } catch (error: any) {
    console.error("❌ API Error:", error.message);
    return NextResponse.json({ error: "حدث خطأ في الخادم: " + error.message }, { status: 500 });
  }
}