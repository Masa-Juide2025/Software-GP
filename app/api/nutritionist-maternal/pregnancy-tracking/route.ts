import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Nutritionist from "@/models/Nutritionist";
import PregnantMother from "@/models/PregnantMother";
import Subscriber from "@/models/Subscriber";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) return NextResponse.json({ success: false, error: "Email required" }, { status: 400 });

    const userDoc = await User.findOne({ email }).lean() as any;
    const nutritionist = await Nutritionist.findOne({ userId: userDoc?._id }).lean() as any;
    
    if (!nutritionist) return NextResponse.json({ success: false, error: "Nutritionist not found" }, { status: 404 });

    const nutritionistId = nutritionist._id;
    // تحويل الـ ID لضمان عمل الاستعلامات بشكل صحيح
    const nId = new mongoose.Types.ObjectId(nutritionistId.toString());

    const pregnantRecords = await PregnantMother.find({ nutritionistId: nId }).lean();
    
    const subscribersList = await Promise.all(
      pregnantRecords.map(async (record: any) => {
        const subDoc = await Subscriber.findById(record.subscriberId).lean() as any;
        let fullName = "مشتركة";
        if (subDoc) {
          const u = await User.findById(subDoc.userId).select("fullName name").lean() as any;
          fullName = u?.fullName || u?.name || "مشتركة";
        }

        // تحويل الرقم المكتوب في الداتابيز لنص مفهوم للعرض في الجدول
        const trimesterMap: { [key: string]: string } = {
          "1": "الثلث الأول",
          "2": "الثلث الثاني",
          "3": "الثلث الثالث"
        };

        return {
          _id: record._id,
          name: fullName,
          gestationalWeek: record.pregnancyDetails?.gestationalWeek || 0,
          trimester: trimesterMap[record.pregnancyDetails?.trimester] || "غير محدد",
          dueDate: record.pregnancyDetails?.expectedDeliveryDate, 
          nextVisitDate: record.pregnancyDetails?.nextVisitDate,
          weight: record.healthMetrics?.weight|| 0,
          initialWeight: subDoc?.weight || 0, 
          weeklyWeightLog: record.healthMetrics?.weeklyWeightLog || [],
          bloodPressure: record.healthMetrics?.bloodPressure || "120/80",
          hemoglobin: record.healthMetrics?.hemoglobin || 0,
          supplements: record.medicalInfo?.supplements || [],
          nutritionNotes: record.medicalInfo?.notes || "لا توجد ملاحظات حالياً",
        };
      })
    );

    // العدادات بناءً على الأرقام المخزنة في الداتابيز (1، 2، 3)
    const stats = {
      firstTrimester: await PregnantMother.countDocuments({ 
        nutritionistId: nId, 
        "pregnancyDetails.trimester": "1" 
      }),
      secondTrimester: await PregnantMother.countDocuments({ 
        nutritionistId: nId, 
        "pregnancyDetails.trimester": "2" 
      }),
      thirdTrimester: await PregnantMother.countDocuments({ 
        nutritionistId: nId, 
        "pregnancyDetails.trimester": "3" 
      }),
    };

    return NextResponse.json({ success: true, stats, subscribersList });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const { recordId, supplements } = await req.json();
    const updated = await PregnantMother.findByIdAndUpdate(
      recordId,
      { $set: { "medicalInfo.supplements": supplements } },
      { new: true }
    );
    return NextResponse.json({ success: true, supplements: updated.medicalInfo.supplements });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}