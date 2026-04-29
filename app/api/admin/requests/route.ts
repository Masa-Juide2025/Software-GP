import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Nutritionist from "@/models/Nutritionist";
import Trainer from "@/models/Trainer"; // إضافة استيراد موديل المدرب لضمان دمج البيانات
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    // 1. جلب المستخدمين المعلقين فقط (Pending)
    const pendingUsers = await User.find({ status: "pending" })
      .select("name email phone role status")
      .lean();

    // 2. ربط بيانات اليوزر مع بيانات الأخصائي أو المدرب المهنية
    const requestsWithDetails = await Promise.all(
      pendingUsers.map(async (user: any) => {
        // تحديد الموديل المناسب للبحث عن التفاصيل بناءً على الدور (Role)
        let details: any = null;
        if (user.role === "nutritionist") {
          details = await Nutritionist.findOne({ userId: user._id }).lean();
        } else if (user.role === "trainer") {
          details = await Trainer.findOne({ userId: user._id }).lean();
        }
        
        return {
          _id: user._id.toString(),
          fullName: user.name || "بدون اسم",
          email: user.email,
          phone: user.phone || "غير متوفر",
          role: user.role,
          status: user.status,
          // البيانات المهنية المضافة والمحدثة
          specialization: details?.specialization || "غير محدد",
          experienceYears: details?.experienceYears || "0",
          bio: details?.bio || "..........",
          // جلب رابط الشهادات (دعم الحقلين certificates و certificateUrl)
          certificates: details?.certificates || details?.certificateUrl || "", 
          workingHoursFrom: details?.workingHoursFrom || "00:00",
          workingHoursTo: details?.workingHoursTo || "00:00",
          availableDays: details?.availableDays || [],
          maxSubscribers: details?.maxSubscribers || "0",
        };
      })
    );

    return NextResponse.json(requestsWithDetails);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const { userId, decision } = await req.json();

    if (!userId || !decision) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      { status: decision },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "تم تحديث الحالة بنجاح", status: updatedUser.status });
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: "فشل التحديث" }, { status: 500 });
  }
}