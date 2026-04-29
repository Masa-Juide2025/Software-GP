import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Subscriber from "@/models/Subscriber";
import Nutritionist from "@/models/Nutritionist"; 
import Trainer from "@/models/Trainer";           

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email, nutritionistId: nutritionistUserId, trainerId: trainerUserId } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "الإيميل مطلوب" }, { status: 400 });
    }

    const currentUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (!currentUser) {
      return NextResponse.json({ error: "المشترك غير موجود" }, { status: 404 });
    }

    const updateData: any = {};

    // تحديث الأخصائي: زيادة عدد المشتركين ونقص المتاح
    if (nutritionistUserId) {
      const nutritionistDoc = await Nutritionist.findOneAndUpdate(
        { userId: nutritionistUserId },
        { 
          $inc: { 
            currentSubscribers: 1,  
            availableSlots: -1      
          } 
        },
        { new: true }
      );
      if (nutritionistDoc) updateData.nutritionistId = nutritionistDoc._id.toString();
    }

    // تحديث المدرب: زيادة عدد المشتركين ونقص المتاح
    if (trainerUserId) {
      const trainerDoc = await Trainer.findOneAndUpdate(
        { userId: trainerUserId },
        { 
          $inc: { 
            currentSubscribers: 1, 
            availableSlots: -1     
          } 
        },
        { new: true }
      );
      if (trainerDoc) updateData.trainerId = trainerDoc._id.toString();
    }

    // ربط المشترك بالخبراء في جدول Subscriber
    if (Object.keys(updateData).length > 0) {
      await Subscriber.findOneAndUpdate(
        { userId: currentUser._id },
        { $set: updateData }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("❌ Save Error:", error.message);
    return NextResponse.json({ error: "حدث خطأ أثناء حفظ الاختيارات" }, { status: 500 });
  }
}