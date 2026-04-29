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

    const user = await User.findOne({ email }).lean() as any;
    const trainerProfile = await Trainer.findOne({ userId: user?._id }).lean() as any;
    if (!trainerProfile) return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 });
    
    const trainerIdStr = trainerProfile._id.toString();

    // 1. الأرقام العلوية (المشتركين من المدرب والمواعيد)
    const totalSubscribers = trainerProfile.currentSubscribers || 0;
    const db = mongoose.connection.db;
    const appointmentsCount = await db!.collection("Appointment").countDocuments({ trainerId: trainerIdStr });

    // 2. توزيع الأهداف
    const goalStats = await Subscriber.aggregate([
      { $match: { trainerId: trainerIdStr } },
      {
        $group: {
          _id: { goal: "$goal", type: "$goalType" },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          label: { $trim: { input: { $concat: [{ $ifNull: ["$_id.goal", ""] }, " ", { $ifNull: ["$_id.type", ""] }] } } },
          count: "$count"
        }
      }
    ]);

    // التعديل هنا: الألوان أزرق وأخضر بالتناوب عشان تظهر الدائرة مقسمة بينهم
    const colors = ["#3b82f6", "#10b981", "#60a5fa", "#34d399", "#2563eb", "#059669"];
    const goalDistribution = goalStats.map((g, i) => ({ ...g, color: colors[i % colors.length] }));

    // 3. نسبة التقدم (حسبة الوزن من جدول Athlete)
    const progressData = await Subscriber.aggregate([
      { $match: { trainerId: trainerIdStr } },
      {
        $lookup: {
          from: "User",
          let: { userIdObj: { $toObjectId: "$userId" } },
          pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$userIdObj"] } } }],
          as: "userDetails"
        }
      },
      { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
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
          name: { $ifNull: ["$userDetails.fullName", "$userDetails.name", "Athlete"] },
          currentWeight: { $ifNull: ["$athleteData.currentWeight", 0] },
          targetWeight: { $ifNull: ["$athleteData.targetWeight", 0] }
        }
      }
    ]);

    const subscriberProgress = progressData.map(sub => {
      let percentage = 0;
      if (sub.currentWeight > 0 && sub.targetWeight > 0) {
        const diff = Math.abs(sub.currentWeight - sub.targetWeight);
        percentage = Math.max(0, Math.min(100, 100 - (diff / sub.currentWeight * 100)));
      } else {
        percentage = 50; 
      }
      return { name: sub.name, progress: Math.round(percentage) };
    }).slice(0, 5);

    return NextResponse.json({
      success: true,
      stats: { totalSubscribers, activeAppointments: appointmentsCount },
      goalDistribution,
      subscriberProgress
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}