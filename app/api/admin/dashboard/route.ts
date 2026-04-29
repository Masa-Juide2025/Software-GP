import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Subscriber from "@/models/Subscriber";
import Nutritionist from "@/models/Nutritionist";
import Trainer from "@/models/Trainer";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    // 1. جلب أحدث 5 مشتركين (دعم الحقلين في الترتيب والجلب)
    const latestSubscribers = await User.find({ role: "subscriber" })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // 2. جلب الأخصائيين والمدربين المقبولين
    const professionals = await User.find({ 
      role: { $in: ["nutritionist", "trainer"] },
      status: { $in: ["approved", "active"] }
    }).limit(10).lean();

    // 3. ربط كل مستخدم مهني ببياناته مع معالجة الاسم والتقييم
    const prosWithDetails = await Promise.all(
      professionals.map(async (pro) => {
        let details = null;
        if (pro.role === "nutritionist") {
          details = await Nutritionist.findOne({ userId: pro._id }).lean();
        } else if (pro.role === "trainer") {
          details = await Trainer.findOne({ userId: pro._id }).lean();
        }

        return {
          id: pro._id.toString(),
          // دعم fullName و name معاً لضمان عدم ظهور "أخصائي نظام"
          name: pro.fullName || pro.name || "أخصائي غير مسمى", 
          role: pro.role,
          email: pro.email,
          phone: pro.phone,
          specialization: details?.specialization || "متخصص",
          experienceYears: details?.experienceYears || 0,
          maxSubscribers: details?.maxSubscribers || 10,
          activeSubscribers: details?.activeSubscribers || 0,
          
          // --- التعديل هنا: جلب التقييم الحقيقي من الداتا بيس ---
          // سيقوم بقراءة حقل rating من جدول Nutritionist أو Trainer
          rating: details?.rating || 0.0, 
        };
      })
    );

    return NextResponse.json({
      subscribers: latestSubscribers.map(sub => ({
        ...sub,
        // تأمين حقل الاسم للمشتركين أيضاً
        name: sub.fullName || sub.name || "مشترك جديد"
      })),
      professionals: prosWithDetails
    });

  } catch (error) {
    console.error("Dashboard Data Error:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء جلب بيانات لوحة التحكم" }, { status: 500 });
  }
}