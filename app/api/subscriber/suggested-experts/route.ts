import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Subscriber from "@/models/Subscriber";
import Nutritionist from "@/models/Nutritionist";
import Trainer from "@/models/Trainer";

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    let userGoal = "lose_weight";
    let hasSelectedExperts = false; // متغير جديد للفحص

    if (email && email !== "null") {
      const user = await User.findOne({ email: email.toLowerCase().trim() }).lean();
      if (user) {
        const sub = await Subscriber.findOne({ userId: user._id }).lean();
        if (sub) {
          userGoal = sub.goalType || sub.goal || "lose_weight";
          
          // الفحص الجوهري: إذا كان المشترك يمتلك بالفعل أخصائي أو مدرب في سجله
          // نتحقق من وجود القيم وأنها ليست خالية
          if (sub.nutritionistId || sub.trainerId) {
            hasSelectedExperts = true;
          }
        }
      }
    }

    // إذا كان المشترك قد اختار بالفعل، يمكننا اختصار الوقت وإرجاع النتيجة فوراً
    if (hasSelectedExperts) {
      return NextResponse.json({
        nutritionists: [],
        trainers: [],
        userGoal,
        hasSelectedExperts: true
      });
    }

    const nutritionistsDocs = await Nutritionist.find().lean();
    const trainersDocs = await Trainer.find().lean();

    // دالة المعالجة والفلترة الصارمة (بقيت كما هي تماماً)
    const formatAndStrictFilter = async (docs: any[], type: 'nutritionist' | 'trainer') => {
      const results = await Promise.all(
        docs.map(async (doc: any) => {
          const userDoc = await User.findById(doc.userId).select("fullName name").lean();
          const specText = (doc.specialization || "");
          const goalLower = userGoal.toLowerCase();

          let isMatch = false;

          const weightGoals = ["lose_weight", "weight_loss", "gain_weight", "weight_gain", "maintain"];
          const medicalGoals = [
            "follow-up of a diabetic patient", 
            "monitoring a patient with high blood pressure",
            "follow-up of a kidney patient"
          ];
          const fitnessGoals = [...weightGoals, "build_muscle", "sports_performance"];
          const motherChildGoals = ["breastfeeding", "monitoring pregnant woman's nutrition", "treatment of childhood obesity"];

          if (type === 'nutritionist') {
            if ((weightGoals.some(g => goalLower.includes(g)) || medicalGoals.some(g => goalLower.includes(g))) && specText.includes("علاجية")) {
              isMatch = true;
            }
            if ((goalLower.includes("build_muscle") || goalLower.includes("sports")) && specText.includes("رياضيين")) {
              isMatch = true;
            }
            if (motherChildGoals.some(g => goalLower.includes(g)) && specText.includes("الام الحامل")) {
              isMatch = true;
            }
          } 
          else {
            if (fitnessGoals.some(g => goalLower.includes(g)) && specText.includes("لياقة بدنية معتمد")) {
              isMatch = true;
            }
            if (medicalGoals.some(g => goalLower.includes(g)) && specText.includes("فيزيولوجيا الجهد البدني")) {
              isMatch = true;
            }
          }

          if (!isMatch) return null;

          return {
            id: doc.userId.toString(),
            name: userDoc?.fullName || userDoc?.name || "خبير متخصص",
            specialization: doc.specialization,
            bio: doc.bio,
            experience: doc.experienceYears || "5+",
            activeSubscribers: doc.currentSubscribers || 0,
            availableSlots: (doc.maxSubscribers || 10) - (doc.currentSubscribers || 0),
            isRecommended: true, 
            rating: "4.9"
          };
        })
      );
      return results.filter(item => item !== null);
    };

    const filteredNutritionists = await formatAndStrictFilter(nutritionistsDocs, 'nutritionist');
    const filteredTrainers = await formatAndStrictFilter(trainersDocs, 'trainer');

    return NextResponse.json({
      nutritionists: filteredNutritionists,
      trainers: filteredTrainers,
      userGoal,
      hasSelectedExperts: false // نرسل false إذا لم يسبق له الاختيار
    });

  } catch (error: any) {
    console.error("❌ API Error:", error.message);
    return NextResponse.json({ error: "حدث خطأ في السيرفر" }, { status: 500 });
  }
}