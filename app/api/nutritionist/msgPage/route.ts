import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Nutritionist from "@/models/Nutritionist";
import Trainer from "@/models/Trainer";
import PregnantMother from "@/models/PregnantMother";
import Subscriber from "@/models/Subscriber";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email"); // إيميل الأخصائي أو المدرب
    const otherId = searchParams.get("otherId"); // ID المشترك المختار

    if (!email) return NextResponse.json({ success: false });

    const currentUser = await User.findOne({ email }).lean() as any;
    
    // البحث هل هو أخصائي أم مدرب لجلب الـ ID الخاص به
    const nutritionist = await Nutritionist.findOne({ userId: currentUser._id }).lean() as any;
    const trainer = await Trainer.findOne({ userId: currentUser._id }).lean() as any;
    
    const professionalId = nutritionist?._id || trainer?._id;
    if (!professionalId) return NextResponse.json({ success: false, error: "Professional record not found" });

    // جلب قائمة المشتركين المرتبطين به (سواء كان مدربهم أو أخصائيهم)
    // ملاحظة: هنا سنبحث في جدول Subscriber عن المشتركين المرتبطين بهذا الـ ID
    const associatedSubscribers = await Subscriber.find({
      $or: [{ nutritionistId: professionalId }, { trainerId: professionalId }]
    }).lean() as any[];

    const contacts = await Promise.all(
      associatedSubscribers.map(async (sub) => {
        const u = await User.findById(sub.userId).select("fullName name").lean() as any;
        return {
          id: sub._id.toString(),
          name: u?.fullName || u?.name || "مشترك",
          label: "مشترك"
        };
      })
    );

    let messagesList = [];
    if (otherId) {
      // جلب الرسائل حيث يكون المستخدم الحالي هو الـ nutritionistId (الحقل الموحد)
      messagesList = await db?.collection("Message").find({
        subscriberId: new mongoose.Types.ObjectId(otherId),
        nutritionistId: professionalId
      }).sort({ createdAt: 1 }).toArray() as any[];
    }

    return NextResponse.json({
      success: true,
      professionalId,
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
    const { professionalId, otherId, content } = await req.json();

    await db?.collection("Message").insertOne({
      subscriberId: new mongoose.Types.ObjectId(otherId), // المشترك هو المستلم هنا برمجياً
      nutritionistId: new mongoose.Types.ObjectId(professionalId), // الأخصائي/المدرب هو صاحب "الغرفة"
      message: content.trim(),
      sender: "nutritionist", // ميزنا المرسل بأنه professional
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}