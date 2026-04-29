import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Nutritionist from "@/models/Nutritionist";
import DietPlan from "@/models/DietPlan";
import Subscriber from "@/models/Subscriber";
import Notification from "@/models/Notifications"; // الموديل اللي أرسلته
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const userDoc = await User.findOne({ email }).lean() as any;
    if (!userDoc) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const nutritionist = await Nutritionist.findOne({ userId: userDoc._id }).lean() as any;
    if (!nutritionist) return NextResponse.json({ error: "Nutritionist not found" }, { status: 404 });

    const rawPlans = await DietPlan.find({ nutritionistId: nutritionist._id }).sort({ createdAt: -1 }).lean();

    const dietPlans = await Promise.all(
      rawPlans.map(async (plan: any) => {
        let fullName = "مشترك غير معروف";
        if (plan.subscriberId) {
          const subDoc: any = await Subscriber.findById(plan.subscriberId).lean();
          if (subDoc && subDoc.userId) {
            const uDoc: any = await User.findById(subDoc.userId).select("fullName name").lean();
            fullName = uDoc?.fullName || uDoc?.name || "بدون اسم";
          }
        }
        return { 
          ...plan, 
          subscriberName: fullName,
          macros: plan.macros || { carbsCalories: 0, proteinCalories: 0, fatCalories: 0 },
          meals: plan.meals || []
        };
      })
    );

    const rawSubscribers = await Subscriber.find({ nutritionistId: nutritionist._id }).lean();
    const realSubscribers = await Promise.all(
      rawSubscribers.map(async (sub: any) => {
        const uDoc: any = await User.findById(sub.userId).select("fullName name").lean();
        return { _id: sub._id, fullName: uDoc?.fullName || uDoc?.name || "اسم غير متوفر" };
      })
    );

    return NextResponse.json({ success: true, dietPlans, subscribers: realSubscribers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { title, dailyCalories, macros, meals, subscriberId, email, description } = body;

    // استخراج الملاحظات من الـ referer (عشان التنبيه)
    const referer = req.headers.get("referer");
    let notesFromUrl = "";
    if (referer) {
      const url = new URL(referer);
      notesFromUrl = url.searchParams.get("notes") || "";
    }

    const userDoc = await User.findOne({ email }).lean() as any;
    const nutritionist = await Nutritionist.findOne({ userId: userDoc?._id }).lean() as any;

    if (!nutritionist) return NextResponse.json({ error: "Nutritionist not found" }, { status: 404 });

    // 1. إنشاء الخطة الغذائية
    const newDietPlan = await DietPlan.create({
      title,
      description,
      nutritionistId: nutritionist._id,
      subscriberId, 
      dailyCalories,
      macros,
      meals
    });

    // 2. التخزين في جدول التنبيهات الموديل الخاص بك
    if (notesFromUrl && notesFromUrl.trim() !== "") {
      await Notification.create({
        subscriberId: new mongoose.Types.ObjectId(subscriberId),
        nutritionistId: nutritionist._id,
        title: "نظام غذائي جديد",
        message: decodeURIComponent(notesFromUrl),
        type: "diet_plan", // مسموح به في الموديل الخاص بك
        isRead: false,
        createdAt: new Date()
      });
    }

    return NextResponse.json({ success: true, dietPlan: newDietPlan });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();
    const { planId, ...updateData } = await req.json();
    const updatedPlan = await DietPlan.findByIdAndUpdate(planId, { $set: updateData }, { new: true });
    return NextResponse.json({ success: true, dietPlan: updatedPlan });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const id = new URL(req.url).searchParams.get("id");
    await DietPlan.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "تم الحذف بنجاح" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}