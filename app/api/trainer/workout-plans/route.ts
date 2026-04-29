import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Trainer from "@/models/Trainer"; 
import WorkoutPlan from "@/models/WorkoutPlan"; 
import Subscriber from "@/models/Subscriber";
import { NextResponse } from "next/server";

// جلب البيانات
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const userDoc = await User.findOne({ email }).lean() as any;
    const trainer = await Trainer.findOne({ userId: userDoc?._id }).lean() as any;
    
    // جلب البرامج وترتيبها من الأحدث
    const rawPlans = await WorkoutPlan.find({ trainerId: trainer._id }).sort({ createdAt: -1 }).lean();
    
    const workoutPlans = await Promise.all(rawPlans.map(async (plan: any) => {
      let fullName = "مشترك غير معروف";
      if (plan.subscriberId) {
        const subDoc: any = await Subscriber.findById(plan.subscriberId).lean();
        if (subDoc?.userId) {
          const uDoc: any = await User.findById(subDoc.userId).select("fullName name").lean();
          fullName = uDoc?.fullName || uDoc?.name || "بدون اسم";
        }
      }
      return { ...plan, subscriberName: fullName };
    }));

    const rawSubscribers = await Subscriber.find({ trainerId: trainer._id }).lean();
    const realSubscribers = await Promise.all(rawSubscribers.map(async (sub: any) => {
      const uDoc: any = await User.findById(sub.userId).select("fullName name").lean();
      return { _id: sub._id, fullName: uDoc?.fullName || uDoc?.name || "اسم غير متوفر" };
    }));

    return NextResponse.json({ success: true, workoutPlans, subscribers: realSubscribers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// إنشاء برنامج جديد
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { title, subscriberId, level, durationWeeks, exercises, email } = body;
    
    const userDoc = await User.findOne({ email }).lean() as any;
    const trainer = await Trainer.findOne({ userId: userDoc?._id }).lean() as any;

    const newPlan = await WorkoutPlan.create({
      title,
      trainerId: trainer._id,
      subscriberId,
      level,
      durationWeeks: Number(durationWeeks),
      exercises, // سيتم تخزين الـ videoUrl هنا ضمن المصفوفة
      progress: 0
    });
    return NextResponse.json({ success: true, workoutPlan: newPlan });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// تحديث برنامج موجود
export async function PUT(req: Request) {
  try {
    await connectDB();
    const { planId, ...updateData } = await req.json();
    const updated = await WorkoutPlan.findByIdAndUpdate(
      planId, 
      { $set: updateData }, 
      { new: true, runValidators: true }
    );
    return NextResponse.json({ success: true, workoutPlan: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// حذف برنامج
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const id = new URL(req.url).searchParams.get("id");
    await WorkoutPlan.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false });
  }
}