import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Trainer from "@/models/Trainer";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { userId } = await req.json();

    // 1. تحديث حالة اليوزر الأساسي ليظهر في إحصائيات الأدمن (Stats)
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { status: "approved" },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // 2. تحديث حالة المدرب وتهيئة المقاعد والمشتركين
    // وضعنا availableSlots: 25 كقيمة افتراضية عند القبول لأول مرة
    await Trainer.findOneAndUpdate(
      { userId: userId },
      { 
        $set: { 
          approved: true,
          availableSlots: 25 // عدد المقاعد المتاحة للمشتركين
        },
        $setOnInsert: { currentSubscribers: 0 } // يبدأ بـ 0 مشتركين إذا كانت الوثيقة جديدة
      },
      { upsert: true, new: true }
    );

    return Response.json({ message: "Trainer approved successfully and slots initialized" });
  } catch (error) {
    console.error("Approve Trainer Error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}