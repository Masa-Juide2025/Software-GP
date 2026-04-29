import { connectDB } from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber"; 
import Nutritionist from "@/models/Nutritionist";
import User from "@/models/User"; 
import Progress from "@/models/progress"; 
import PatientHealthData from "@/models/patients_health_data"; // تأكد من وجود الموديل
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    const userAccount = await User.findOne({ email: email?.toLowerCase() });
    const nutritionist = await Nutritionist.findOne({ userId: userAccount?._id });

    if (!nutritionist) return NextResponse.json({ error: "الأخصائي غير موجود" }, { status: 404 });

    const allSubs = await Subscriber.find({ nutritionistId: nutritionist._id }).lean();

    let totalWeightLostGlobal = 0;
    let healthAdherenceSum = 0;
    const weightJourney: any[] = [];
    const healthCases: any[] = [];

    await Promise.all(allSubs.map(async (sub) => {
      const userDoc = await User.findById(sub.userId).select("name fullName").lean();
      
      // حساب الأيام منذ الانضمام
      const registrationDate = new Date(sub.createdAt || new Date());
      const daysSinceJoining = Math.max(1, Math.ceil((new Date().getTime() - registrationDate.getTime()) / (1000 * 60 * 60 * 24)));

      const goalText = `${sub.goal || ""} ${sub.goalType || ""}`.toLowerCase();
      // منطق الفرز: سكري أو ضغط
      const isDiabetes = /سكري|سكر|diabetic|diabetes/.test(goalText);
      const isPressure = /ضغط|pressure/.test(goalText);

      if (isDiabetes || isPressure) {
        // ✅ حساب الالتزام من جدول patients_health_data كما طلبت
        const healthLogs = await PatientHealthData.find({ subscriberId: sub._id }).lean();
        const uniqueHealthDays = new Set(healthLogs.map(log => new Date(log.createdAt).toDateString())).size;
        const adherence = Math.min(100, Math.round((uniqueHealthDays / daysSinceJoining) * 100));
        
        healthAdherenceSum += adherence;
        healthCases.push({
          name: userDoc?.fullName || userDoc?.name || "مشترك",
          condition: isDiabetes ? "متابعة مريض سكري" : "متابعة مريض ضغط",
          adherence: adherence
        });
      } else {
        // حساب رحلة الوزن للمشتركين العاديين
        const allProgressLogs = await Progress.find({ subscriberId: sub._id }).sort({ createdAt: -1 }).lean();
        const startWeight = sub.weight || 0;
        const currentWeight = allProgressLogs[0]?.currentWeight || startWeight;
        const idealWeight = sub.height > 0 ? parseFloat((50 + 0.9 * (sub.height - 152.4)).toFixed(1)) : 0;
        
        let percentage = 0;
        if (startWeight > idealWeight) {
          const diff = startWeight - currentWeight;
          if (diff > 0) totalWeightLostGlobal += diff;
          percentage = Math.max(0, Math.min(100, Math.round((diff / (startWeight - idealWeight)) * 100)));
        } else if (idealWeight > startWeight) {
          const diff = currentWeight - startWeight;
          percentage = Math.max(0, Math.min(100, Math.round((diff / (idealWeight - startWeight)) * 100)));
        }

        weightJourney.push({
          name: userDoc?.fullName || userDoc?.name || "مشترك",
          startWeight, currentWeight, idealWeight,
          progressPercentage: percentage,
          type: startWeight > idealWeight ? "loss" : "gain"
        });
      }
    }));

    return NextResponse.json({
      totalSubscribers: allSubs.length,
      totalWeightLost: totalWeightLostGlobal.toFixed(1),
      rating: nutritionist.rating || 4.8,
      weightJourney,
      healthCases,
      averageHealthAdherence: `${healthCases.length > 0 ? Math.round(healthAdherenceSum / healthCases.length) : 0}%`
    });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}