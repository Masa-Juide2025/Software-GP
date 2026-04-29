import { connectDB } from "@/lib/mongodb";
import Athlete from "@/models/Athlete"; 
import Subscriber from "@/models/Subscriber"; 
import User from "@/models/User"; 
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const athletesData = await Athlete.find({})
      .populate({
        path: "subscriberId",
        model: Subscriber,
        populate: {
          path: "userId",
          model: User,
          select: "name fullName"
        }
      });

    const uniqueTrainers = new Set(
      athletesData.filter(a => a.trainerId).map(a => a.trainerId.toString())
    );
    const linkedCount = athletesData.filter(a => a.trainerId).length;

    const formattedAthletes = athletesData.map(a => {
      const userData = a.subscriberId?.userId;
      const name = userData?.name || userData?.fullName || "مشترك غير معروف";
      
      // التعديل هنا: عكس البسط والمقام بناءً على طلبك
      // النسبة = (الهدف / الحالي) * 100
      let compliancePercentage = 0;
      if (a.currentWeight && a.targetWeight && a.currentWeight !== 0) {
        compliancePercentage = Math.round((a.targetWeight / a.currentWeight) * 100);
      }

      return {
        _id: a._id,
        name: name,
        sport: a.sportType || "Bodybuilding",
        trainerId: a.trainerId,
        compliance: compliancePercentage, 
        currentWeight: a.currentWeight,
        targetWeight: a.targetWeight
      };
    });

    return NextResponse.json({
      athletes: formattedAthletes,
      stats: {
        trainersCount: uniqueTrainers.size,
        linkedAthletesCount: linkedCount
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: "failed to fetch" }, { status: 500 });
  }
}