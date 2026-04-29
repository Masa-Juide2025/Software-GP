import { connectDB } from "@/lib/mongodb";
import Athlete from "@/models/Athlete";
import Subscriber from "@/models/Subscriber";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const athletes = await Athlete.find({})
      .populate({
        path: "subscriberId",
        model: Subscriber,
        populate: { path: "userId", model: User, select: "name fullName" }
      });

    // 1. إجمالي الرياضيين
    const totalAthletes = athletes.length;

    // 2. توزيع الرياضات (الأعمدة) - شامل Muscle Gain و Fat Loss
    const sportCounts: Record<string, number> = {};
    
    athletes.forEach(a => {
      // إذا كان الحقل فارغ بنحط "غير محدد"، وإذا موجود بنستخدمه
      const type = a.sportType || "غير محدد";
      sportCounts[type] = (sportCounts[type] || 0) + 1;
    });

    // تحويل الكائن لمصفوفة تناسب الرسم البياني
    const sportDistribution = Object.entries(sportCounts).map(([sport, count]) => ({
      sport, // هون رح يطلع Muscle Gain أو Fat Loss أو كمال أجسام
      count
    })).sort((a, b) => b.count - a.count); // ترتيب الأعمدة من الأكثر للأقل

    // 3. أفضل الرياضيين
    const topPerformers = athletes.map(a => {
      const userData = a.subscriberId?.userId;
      const name = userData?.name || userData?.fullName || "مستخدم";
      
      let progress = 0;
      if (a.currentWeight && a.targetWeight && a.currentWeight !== 0) {
        progress = Math.round((a.targetWeight / a.currentWeight) * 100);
      }

      return {
        name,
        sport: a.sportType || "Bodybuilding",
        progress
      };
    })
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 5);

    return NextResponse.json({
      totalAthletes,
      sportDistribution,
      topPerformers
    });

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}