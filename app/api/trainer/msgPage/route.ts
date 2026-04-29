import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Trainer from "@/models/Trainer";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const otherId = searchParams.get("otherId");

    if (!email) return NextResponse.json({ success: false });

    const currentUser = await User.findOne({ email }).lean() as any;
    const trainerDoc = await Trainer.findOne({ userId: currentUser?._id }).lean() as any;
    
    if (!trainerDoc) return NextResponse.json({ success: false });

    const tId = trainerDoc._id.toString();

    const associatedSubscribers = await db?.collection("subscribers").find({
      $or: [
        { trainerId: tId },
        { trainerId: new mongoose.Types.ObjectId(tId) }
      ]
    }).toArray() as any[];

    const contacts = await Promise.all(
      associatedSubscribers.map(async (sub) => {
        const u = await User.findById(sub.userId).select("fullName name").lean() as any;
        return {
          id: sub._id.toString(),
          name: u?.fullName || u?.name || "مشترك",
          label: "متدرب نشط"
        };
      })
    );

    let messagesList = [];
    if (otherId) {
      messagesList = await db?.collection("Message").find({
        subscriberId: new mongoose.Types.ObjectId(otherId),
        nutritionistId: new mongoose.Types.ObjectId(tId)
      }).sort({ createdAt: 1 }).toArray() as any[];
    }

    return NextResponse.json({
      success: true,
      trainerId: tId, // تأكدنا إن الاسم trainerId
      contacts,
      messages: messagesList
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    const { trainerId, otherId, content } = await req.json();

    if (!trainerId || !otherId || !content) {
        return NextResponse.json({ success: false, error: "Missing data" });
    }

    await db?.collection("Message").insertOne({
      subscriberId: new mongoose.Types.ObjectId(otherId),
      nutritionistId: new mongoose.Types.ObjectId(trainerId),
      message: content.trim(),
      sender: "trainer", // ثبتنا الـ sender كـ trainer
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}