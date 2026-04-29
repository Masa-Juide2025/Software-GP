import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Nutritionist from "@/models/Nutritionist";
import Athlete from "@/models/Athlete"; 
import Subscriber from "@/models/Subscriber"; 
import Appointment from "@/models/Appointment"; 
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const userDoc = await User.findOne({ email }).lean() as any;
    if (!userDoc) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const nutritionistDoc = await Nutritionist.findOne({ userId: userDoc._id }).lean() as any;
    if (!nutritionistDoc) return NextResponse.json({ error: "Nutritionist not found" }, { status: 404 });

    const nutritionistId = nutritionistDoc._id;
    const nutIdStr = nutritionistId.toString();

    const allApps = await Appointment.find({ nutritionistId: nutritionistId }).lean();
    const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Amman' }); 

    const todayAppointments = allApps.filter((app: any) => {
      if (!app.date) return false;
      const appDateStr = new Date(app.date).toLocaleDateString('en-CA', { timeZone: 'Asia/Amman' });
      return appDateStr === todayStr;
    });

    const allAthletesInDB = await Athlete.find({}).lean();
    const myAthletesRaw = allAthletesInDB.filter((a: any) => a.nutritionistId?.toString() === nutIdStr);

    // --- 💊 [جديد] حساب المكملات الغذائية من الداتا بيس ---
    const supplementMap: Record<string, number> = {
      "واي بروتين": 0,
      "كرياتين": 0,
      "BCAA": 0,
      "بري ورك أوت": 0
    };

    // ترجمة المسميات من الإنجليزية (في الداتا بيس) للعربية (في العرض)
    const translateSupp: Record<string, string> = {
      "Whey Protein": "واي بروتين",
      "Creatine": "كرياتين",
      "BCAA": "BCAA",
      "Pre-workout": "بري ورك أوت"
    };

    myAthletesRaw.forEach((athlete: any) => {
      if (athlete.supplements && Array.isArray(athlete.supplements)) {
        athlete.supplements.forEach((supp: string) => {
          const arabicName = translateSupp[supp] || supp;
          if (supplementMap[arabicName] !== undefined) {
            supplementMap[arabicName]++;
          }
        });
      }
    });

    const totalMyAthletes = myAthletesRaw.length;
    const supplementsStats = Object.keys(supplementMap).map(name => ({
      name,
      athletes: supplementMap[name],
      percentage: totalMyAthletes > 0 ? Math.round((supplementMap[name] / totalMyAthletes) * 100) : 0
    }));
    // --- [نهاية حساب المكملات] ---

    const athletesWithNames = await Promise.all(
      myAthletesRaw.map(async (athlete: any) => {
        let finalName = "رياضي جديد";
        if (athlete.subscriberId) {
          const subDoc = await Subscriber.findById(athlete.subscriberId).lean() as any;
          if (subDoc && subDoc.userId) {
            const uDoc = await User.findById(subDoc.userId).select("name fullName").lean() as any;
            finalName = uDoc?.fullName || uDoc?.name || "رياضي جديد";
          }
        }
        return {
          ...athlete,
          name: finalName, 
          _id: athlete._id.toString()
        };
      })
    );

    const stats = {
      total: totalMyAthletes,
      bodybuilding: athletesWithNames.filter((a: any) => a.sportType === "Bodybuilding" || a.sport === "كمال أجسام").length,
      muscleGain: athletesWithNames.filter((a: any) => a.sportType === "Muscle Gain" || a.goal === "زيادة كتلة عضلية" ).length,
      fatLoss: athletesWithNames.filter((a: any) => a.sportType === "Fat Loss" || a.goal === "حرق الدهون" ).length,
    };

    return NextResponse.json({
      success: true,
      displayName: userDoc.fullName || userDoc.name,
      stats,
      maxSubscribers: nutritionistDoc.maxSubscribers || 50,
      athletesList: athletesWithNames,
      todayAppointments: JSON.parse(JSON.stringify(todayAppointments)),
      supplementsData: supplementsStats // إرسال البيانات المحسوبة
    });

  } catch (error: any) {
    console.error("Dashboard Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}