import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import User from "@/models/User";
import Nutritionist from "@/models/Nutritionist";
import Athlete from "@/models/Athlete"; 
import Subscriber from "@/models/Subscriber"; 
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const userDoc = await User.findOne({ email }).lean() as any;
    if (!userDoc) return NextResponse.json({ success: true, athletes: [] });

    const nutritionistDoc = await Nutritionist.findOne({ userId: userDoc._id }).lean() as any;
    if (!nutritionistDoc) return NextResponse.json({ success: true, athletes: [] });

    const myNutId = nutritionistDoc._id.toString().trim();
    
    // رجعنا للطريقة الأصلية اللي كانت شغالة عندك
    const allAthletes = await Athlete.find({}).lean();
    const myAthletesRaw = allAthletes.filter((ath: any) => 
      ath.nutritionistId?.toString().trim() === myNutId
    );

    const detailedAthletes = await Promise.all(
      myAthletesRaw.map(async (athlete: any) => {
        let fullName = "رياضي جديد";
        if (athlete.subscriberId) {
          const subDoc = await Subscriber.findById(athlete.subscriberId).lean() as any;
          if (subDoc?.userId) {
            const uDoc = await User.findById(subDoc.userId).select("fullName name").lean() as any;
            fullName = uDoc?.fullName || uDoc?.name || "رياضي جديد";
          }
        }

        return {
          id: athlete._id.toString(),
          subscriberId: athlete.subscriberId?.toString(),
          nutritionistId: athlete.nutritionistId?.toString(),
          name: fullName,
          initials: fullName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase(),
          sportType: athlete.sportType || "Bodybuilding",
          currentWeight: athlete.currentWeight || 0,
          targetWeight: athlete.targetWeight || 0,
          fatPercentage: athlete.fatPercentage || 0,
          muscleMass: athlete.muscleMass || 0,
          supplements: athlete.supplements || [],
          progress: (athlete.targetWeight && athlete.currentWeight) 
            ? Math.round((athlete.targetWeight / athlete.currentWeight) * 100) 
            : 0
        };
      })
    );

    return NextResponse.json({ success: true, athletes: detailedAthletes });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { action, subscriberId, nutritionistId, message, note, athleteId, supplement } = body;
    const db = mongoose.connection.db;
    if (!db) throw new Error("Database connection not established");

    // تخزين الرسالة بنمطك المباشر
    if (action === "sendMessage") {
      await db.collection("Message").insertOne({
        subscriberId: new mongoose.Types.ObjectId(subscriberId),
        trainerId: new mongoose.Types.ObjectId(nutritionistId),
        message: message.trim(),
        sender: "trainer",
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return NextResponse.json({ success: true });
    }

    // تخزين الملاحظة بنمطك المباشر في جدول note
    if (action === "saveNote") {
      await db.collection("note").insertOne({
        subscriberId: new mongoose.Types.ObjectId(subscriberId),
        nutritionistId: new mongoose.Types.ObjectId(nutritionistId),
        note: note.trim(),
        createdAt: new Date()
      });
      return NextResponse.json({ success: true });
    }

    // المكملات (تحديث في جدول Athlete)
    if (action === "addSupplement" || action === "removeSupplement") {
      let query = action === "addSupplement" 
        ? { $addToSet: { supplements: supplement } } 
        : { $pull: { supplements: supplement } };
      const updatedAthlete = await Athlete.findByIdAndUpdate(athleteId, query, { new: true });
      return NextResponse.json({ success: true, supplements: updatedAthlete.supplements });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}