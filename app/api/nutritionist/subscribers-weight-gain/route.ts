import { connectDB } from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber"; 
import Nutritionist from "@/models/Nutritionist";
import User from "@/models/User"; 
import Progress from "@/models/progress"; 
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "البريد الإلكتروني مطلوب" }, { status: 400 });
    }

    const userAccount = await User.findOne({ email: email.toLowerCase() });
    if (!userAccount) {
      return NextResponse.json({ error: "حساب الأخصائي غير موجود" }, { status: 404 });
    }

    const nutritionist = await Nutritionist.findOne({ userId: userAccount._id });
    if (!nutritionist) {
      return NextResponse.json({ error: "لم يتم العثور على بيانات أخصائي" }, { status: 404 });
    }

    // جلب المشتركين بفلترة OR
    const subscribersRaw = await Subscriber.find({ 
      nutritionistId: nutritionist._id,
      $or: [
        { goal: "gain_weight" },
        { goalType: "gain_weight" }
      ]
    }).populate({
      path: 'userId', 
      select: 'fullName name email image phone phoneNumber mobile createdAt',
      model: User
    }).lean();

    const subscribersWithProgress = await Promise.all(subscribersRaw.map(async (sub) => {
      const latestProgressRecord = await Progress.findOne({ subscriberId: sub._id })
        .sort({ createdAt: -1 }) 
        .lean();

      const startWeight = sub.weight || 0; 
      const currentWeight = latestProgressRecord ? (latestProgressRecord as any).currentWeight : startWeight;

      return {
        ...sub,
        nutritionistId: nutritionist._id,
        registrationWeight: startWeight,
        currentWeight: currentWeight,
        latestProgress: latestProgressRecord ? {
          currentWeight: (latestProgressRecord as any).currentWeight, 
          progressPercentage: (latestProgressRecord as any).progressPercentage,
          updatedAt: (latestProgressRecord as any).createdAt
        } : null
      };
    }));

    return NextResponse.json(subscribersWithProgress, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

  } catch (error: any) {
    console.error("❌ API Error:", error.message);
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}