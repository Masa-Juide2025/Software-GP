import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Trainer from "@/models/Trainer";
import Nutritionist from "@/models/Nutritionist";
import Feedback from "@/models/Feedback";
import Subscriber from "@/models/Subscriber";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) return NextResponse.json({ success: false, error: "Email required" }, { status: 400 });

    // 1. جلب حساب المستخدم بناءً على الإيميل
    const userDoc = await User.findOne({ email }).lean() as any;
    if (!userDoc) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

    // حل المشكلة: تعريف المصفوفة وتحديد نوعها صراحة كـ any[] لمنع اعتراض TypeScript
    let rawFeedbacks: any[] = [];

    // 2. فحص هل المستخدم مدرب أم أخصائي؟
    const trainer = await Trainer.findOne({ userId: userDoc._id }).lean() as any;
    
    if (trainer) {
      // إذا كان مدرب، نجلب الفيدباك الخاص بالمدربين
      rawFeedbacks = await Feedback.find({ trainerId: trainer._id }).sort({ createdAt: -1 }).lean();
    } else {
      // إذا لم يكن مدرباً، نفحص جدول أخصائيي التغذية
      const nutritionist = await Nutritionist.findOne({ userId: userDoc._id }).lean() as any;
      if (nutritionist) {
        // نجلب الفيدباك الخاص بالأخصائيين
        rawFeedbacks = await Feedback.find({ nutritionistId: nutritionist._id }).sort({ createdAt: -1 }).lean();
      }
    }

    // 3. جلب بيانات المشترك (الاسم والصورة) لكل فيدباك مرتبط
    const feedbacks = await Promise.all(rawFeedbacks.map(async (f: any) => {
      let subscriberName = "مشترك";
      let subscriberImage = "";
      if (f.subscriberId) {
        const subDoc = await Subscriber.findById(f.subscriberId).lean() as any;
        const uDoc = await User.findById(subDoc?.userId).select("fullName name image").lean() as any;
        subscriberName = uDoc?.fullName || uDoc?.name || "بدون اسم";
        subscriberImage = uDoc?.image || "";
      }
      return { ...f, subscriberName, subscriberImage };
    }));

    return NextResponse.json({ success: true, feedbacks });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}