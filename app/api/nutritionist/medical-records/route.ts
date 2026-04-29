import { connectDB } from "@/lib/mongodb";
import DiabetesRecord from "@/models/DiabetesRecord";
import BloodPressureRecord from "@/models/BloodPressureRecord";
import PatientHealthData from "@/models/patients_health_data"; 
import Subscriber from "@/models/Subscriber";
import User from "@/models/User";
import Nutritionist from "@/models/Nutritionist";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const getSubs = searchParams.get("getSubs");
    const condition = searchParams.get("condition");

    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const userAccount = await User.findOne({ email: email.toLowerCase() });
    const nutritionist = await Nutritionist.findOne({ userId: userAccount?._id });
    if (!nutritionist) return NextResponse.json({ error: "Nutritionist not found" }, { status: 404 });

    if (getSubs === "true") {
      const targetGoal = condition === "سكري" ? "Follow-up of a diabetic patient" : "Follow-up of a hypertensive patient";
      const subs = await Subscriber.find({ nutritionistId: nutritionist._id, goal: targetGoal })
        .populate("userId", "fullName name")
        .lean();
      return NextResponse.json(subs);
    }

    const [diabetesDocs, bpDocs] = await Promise.all([
      DiabetesRecord.find({ nutritionistId: nutritionist._id }).lean(),
      BloodPressureRecord.find({ nutritionistId: nutritionist._id }).lean()
    ]);

    const formatData = async (doc: any, type: "diabetes" | "bp") => {
      const sub = await Subscriber.findById(doc.subscriberId).lean();
      const user = sub ? await User.findById(sub.userId).lean() : null;
      const patientName = doc.patientName || user?.fullName || user?.name || "مريض غير معروف";

      const healthData: any = await PatientHealthData.findOne(
        { subscriberId: doc.subscriberId },
        {},
        { sort: { createdAt: -1 } }
      ).lean();

      let labResults = type === "diabetes" ? [
        { name: "HbA1c", value: doc.hba1c || "--" },
        { name: "سكر صائم", value: doc.fastingBloodSugar || "--" },
        { name: "سكر عشوائي", value: doc.randomBloodSugar || "--" },
        { name: "LDL", value: doc.ldl || "--" },
        { name: "HDL", value: doc.hdl || "--" },
        { name: "كرياتينين", value: doc.creatinine || "--" },
        { name: "يوريا", value: doc.urea || "--" } // عرض اليوريا في السكري
      ] : [
        { name: "دهون الدم (Lipids)", value: doc.bloodLipids || "--" },
        { name: "يوريا", value: doc.urea || "--" },
        { name: "كرياتينين", value: doc.creatinine || "--" },
        { name: "سكر صائم (اختياري)", value: doc.fastingBloodSugar || "--" }
      ];

      return {
        id: doc._id.toString(),
        subscriberId: doc.subscriberId.toString(),
        patientName,
        patientInitials: patientName.substring(0, 2),
        condition: type === "diabetes" ? "سكري" : "ضغط دم",
        date: new Date(doc.createdAt).toLocaleDateString('en-CA'),
        vitals: {
          weight: healthData?.healthMetrics?.weight || "--",
          bloodPressure: healthData?.healthMetrics?.bloodPressure || "--",
          heartRate: healthData?.healthMetrics?.heartRate || "--",
          bloodSugar: healthData?.healthMetrics?.bloodSugar || "--",
        },
        labResults
      };
    };

    const formattedDiabetes = await Promise.all(diabetesDocs.map(d => formatData(d, "diabetes")));
    const formattedBP = await Promise.all(bpDocs.map(d => formatData(d, "bp")));

    return NextResponse.json([...formattedDiabetes, ...formattedBP].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { subscriberId, nutritionistEmail, condition, labData, patientName, vitals } = await req.json();
    const userAccount = await User.findOne({ email: nutritionistEmail.toLowerCase() });
    const nutritionist = await Nutritionist.findOne({ userId: userAccount?._id });

    if (!nutritionist) throw new Error("Nutritionist not found");

    await PatientHealthData.create({
      subscriberId,
      nutritionistId: nutritionist._id,
      subscriberName: patientName,
      healthMetrics: {
        weight: vitals.weight,
        bloodPressure: vitals.bloodPressure,
        heartRate: vitals.heartRate,
        bloodSugar: vitals.bloodSugar
      },
      medicalInfo: { date: new Date(), status: "active" }
    });

    const medicalRecord = {
      subscriberId,
      nutritionistId: nutritionist._id,
      patientName,
      ...labData // سيتم تخزين اليوريا هنا لمريض السكري
    };

    if (condition === "سكري") {
      await DiabetesRecord.create(medicalRecord);
    } else {
      await BloodPressureRecord.create(medicalRecord);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}