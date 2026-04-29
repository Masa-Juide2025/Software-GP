import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Trainer from "@/models/Trainer";
import Subscriber from "@/models/Subscriber";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) return NextResponse.json({ success: false, error: "Email required" }, { status: 400 });

    const userTrainer = await User.findOne({ email }).lean() as any;
    const trainerProfile = await Trainer.findOne({ userId: userTrainer?._id }).lean() as any;

    const subscribers = await Subscriber.aggregate([
      { $match: { trainerId: trainerProfile._id.toString() } },
      {
        $lookup: {
          from: "User",
          let: { userIdObj: { $toObjectId: "$userId" } },
          pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$userIdObj"] } } }],
          as: "userDetails"
        }
      },
      { $unwind: "$userDetails" },
      {
        $lookup: {
          from: "athletes", 
          let: { subIdStr: { $toString: "$_id" } },
          pipeline: [{ $match: { $expr: { $eq: ["$subscriberId", "$$subIdStr"] } } }],
          as: "athleteData"
        }
      },
      { $unwind: { path: "$athleteData", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          id: { $toString: "$_id" },
          trainerId: "$trainerId",
          name: { $ifNull: ["$userDetails.fullName", "$userDetails.name", "مشترك"] },
          email: "$userDetails.email",
          weight: { $ifNull: ["$athleteData.currentWeight", 0] }, 
          targetWeight: { $ifNull: ["$athleteData.targetWeight", 0] },
          bodyFat: { $ifNull: ["$athleteData.fatPercentage", 0] }, 
          muscleMass: { $ifNull: ["$athleteData.muscleMass", 0] },
          goal: { $ifNull: ["$goal", ""] },
          plan: { $ifNull: ["$package", "أساسي"] },
          joinDate: "$createdAt",
          phone: { $ifNull: ["$userDetails.phone", ""] },
          age: { $ifNull: ["$age", 0] },
          gender: { $ifNull: ["$userDetails.gender", ""] }
        }
      }
    ]);

    return NextResponse.json({ success: true, subscribers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    const { action, subscriberId, nutritionistId, message, note } = await req.json();

    if (!db) throw new Error("Database connection failed");

    // تخزين الرسالة في جدول Message
    if (action === "sendMessage") {
      await db.collection("Message").insertOne({
        subscriberId: new mongoose.Types.ObjectId(subscriberId),
        nutritionistId: new mongoose.Types.ObjectId(nutritionistId),
        message: message.trim(),
        sender: "trainer",
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return NextResponse.json({ success: true });
    }

    // تخزين الملاحظة في جدول note
    if (action === "saveNote") {
      await db.collection("note").insertOne({
        subscriberId: new mongoose.Types.ObjectId(subscriberId),
        nutritionistId: new mongoose.Types.ObjectId(nutritionistId),
        note: note.trim(),
        createdAt: new Date()
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}