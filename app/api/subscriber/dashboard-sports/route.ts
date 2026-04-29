import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import User from "@/models/User";
import Subscriber from "@/models/Subscriber";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) return NextResponse.json({ success: false, error: "Email required" }, { status: 400 });

    const user = await User.findOne({ email }).lean() as any;
    if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

    const subData = await Subscriber.findOne({ userId: user._id }).lean() as any;
    if (!subData) return NextResponse.json({ success: false, error: "Subscriber not found" }, { status: 404 });

    const subIdStr = subData._id.toString();
    const subIdObj = new mongoose.Types.ObjectId(subIdStr);
    const db = mongoose.connection.db;
    if (!db) throw new Error("Database connection failed");

    const [athleteDoc, latestPlan, workoutDoc] = await Promise.all([
      db.collection("athletes").findOne({ $or: [{ subscriberId: subIdStr }, { subscriberId: subIdObj }] }),
      db.collection("dietPlans").findOne(
        { $or: [{ subscriberId: subIdStr }, { subscriberId: subIdObj }] },
        { sort: { createdAt: -1 } }
      ),
      db.collection("workoutPrograms").findOne(
        { $or: [{ subscriberId: subIdStr }, { subscriberId: subIdObj }] },
        { sort: { createdAt: -1 } }
      )
    ]) as any[];

    return NextResponse.json({ 
      success: true, 
      data: {
        name: user.fullName || user.name,
        dailyCalories: latestPlan?.dailyCalories || 0,
        meals: latestPlan?.meals || [], 
        athleteInfo: athleteDoc || {},
        supplements: athleteDoc?.supplements || [], // السطر المطلوب لجلب المكملات
        workout: workoutDoc || null 
      } 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const user = await User.findOne({ email: body.email });
    const subData = await Subscriber.findOne({ userId: user?._id });

    if (!subData) return NextResponse.json({ success: false, error: "Not found" });

    const db = mongoose.connection.db;
    if (!db) throw new Error("DB Error");

    await db.collection("athletes").updateOne(
      { $or: [ { subscriberId: subData._id.toString() }, { subscriberId: subData._id } ] },
      { 
        $set: { 
          subscriberId: subData._id, 
          currentWeight: body.currentWeight,
          targetWeight: body.targetWeight,
          muscleMass: body.muscleMass,
          fatPercentage: body.fatPercentage,
          updatedAt: new Date() 
        } 
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}