import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Subscriber from "@/models/Subscriber";
import Nutritionist from "@/models/Nutritionist"; 
import Trainer from "@/models/Trainer";
import { NextResponse } from "next/server";

// --- دالة الـ GET الأصلية (بدون أي تعديل) ---
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const user = await User.findById(id).lean();
      if (!user) return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });

      const subInfo: any = await Subscriber.findOne({ userId: user._id }).lean();
      
      let nutritionistName = "غير معين";
      let trainerName = "غير معين";
      let packageName = "غير مشترك";

      if (subInfo) {
        if (subInfo.nutritionistId) {
          const nutDoc: any = await Nutritionist.findById(subInfo.nutritionistId).lean();
          if (nutDoc?.userId) {
            const nutUser: any = await User.findById(nutDoc.userId).select("fullName name").lean();
            nutritionistName = nutUser?.fullName || nutUser?.name || "غير معين";
          }
        }
        if (subInfo.trainerId) {
          const trainerDoc: any = await Trainer.findById(subInfo.trainerId).lean();
          if (trainerDoc?.userId) {
            const trainerUser: any = await User.findById(trainerDoc.userId).select("fullName name").lean();
            trainerName = trainerUser?.fullName || trainerUser?.name || "غير معين";
          }
        }
        packageName = subInfo.package || "غير مشترك";
      }

      const detailedData = {
        ...user,
        ...subInfo,
        name: user.fullName || user.name || "مستخدم",
        email: user.email || "---",
        phone: user.phone || "---",
        status: (user.status === "approved" || user.status === "active") ? "نشط" : "غير نشط",
        packageName,
        nutritionistName,
        trainerName,
        startDate: subInfo?.createdAt ? new Date(subInfo.createdAt).toLocaleDateString('ar-EG') : "---",
        endDate: subInfo?.updatedAt ? new Date(subInfo.updatedAt).toLocaleDateString('ar-EG') : "---",
      };

      return NextResponse.json(detailedData);
    }

    const users = await User.find({ role: "subscriber" }).lean();

    const formattedData = await Promise.all(users.map(async (user: any) => {
      const subInfo: any = await Subscriber.findOne({ userId: user._id }).lean();
      
      let nutritionistName = "-";
      let trainerName = "-";
      let packageName = "-";

      if (subInfo) {
        if (subInfo.nutritionistId) {
          const nutDoc: any = await Nutritionist.findById(subInfo.nutritionistId).lean();
          if (nutDoc?.userId) {
            const nutUser: any = await User.findById(nutDoc.userId).select("fullName name").lean();
            nutritionistName = nutUser?.fullName || nutUser?.name || "-";
          }
        }
        if (subInfo.trainerId) {
          const trainerDoc: any = await Trainer.findById(subInfo.trainerId).lean();
          if (trainerDoc?.userId) {
            const trainerUser: any = await User.findById(trainerDoc.userId).select("fullName name").lean();
            trainerName = trainerUser?.fullName || trainerUser?.name || "-";
          }
        }
        packageName = subInfo.package || "-";
      }

      return {
        id: user._id.toString(),
        name: user.fullName || user.name || "مستخدم جديد",
        phone: user.phone || "---",
        status: (user.status === "approved" || user.status === "active") ? "active" : user.status,
        plan: packageName,
        bmi: subInfo?.bmi || "---",
        nutritionistName, 
        trainerName,
        endDate: user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('ar-EG') : "---"
      };
    }));

    return NextResponse.json(formattedData);
  } catch (error: any) {
    console.error("API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 }); 
  }
}

// ==========================================
// جزئية الحذف الجديدة (بدون تخريب الكود القديم)
// ==========================================
export async function DELETE(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "معرف المستخدم مطلوب" }, { status: 400 });
    }

    // 1. حذف بيانات المشترك من جدول Subscriber
    await Subscriber.findOneAndDelete({ userId: id });

    // 2. حذف المستخدم من جدول User
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ error: "المستخدم غير موجود أصلاً" }, { status: 404 });
    }

    return NextResponse.json({ message: "تم حذف المشترك وكافة بياناته بنجاح" });

  } catch (error: any) {
    console.error("Delete API Error:", error.message);
    return NextResponse.json({ error: "حدث خطأ أثناء محاولة الحذف" }, { status: 500 });
  }
}