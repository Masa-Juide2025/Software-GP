import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Subscriber from "@/models/Subscriber";
import Nutritionist from "@/models/Nutritionist";
import Trainer from "@/models/Trainer";

export async function POST(req: Request) {
  try {
    await connectDB();

    const data = await req.json();

    // 1. فك البيانات مع مراعاة المسميات القادمة من Frontend (RegisterPage)
    const {
      fullName,      // من Step1Data
      email,
      password,
      phone,
      userRole,      // المسمى في Frontend هو userRole

      // بيانات المشترك (SubscriberStepData)
      age,
      height,
      weight,        // الوزن الحالي
      goalWeight,    // الوزن المستهدف من Frontend
      goalType,      // الهدف من Frontend
      diseases,
      allergies,

      // البيانات المهنية (SpecialistStepData)
      certificatesLink, // رابط الدرايف
      specialization,
      yearsOfExperience,
      description,
      workHoursFrom,
      workHoursTo,
      availableDays,
      maxSubscribers,
    } = data;

    // 2. التأكد من عدم تكرار البريد الإلكتروني
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ error: "البريد الإلكتروني مسجل بالفعل" }, { status: 400 });
    }

    // 3. تحديد الحالة والدور
    const role = userRole; 
    const status = (role === "nutritionist" || role === "trainer") ? "pending" : "approved";

    // 4. إنشاء سجل المستخدم الأساسي
    const newUser = await User.create({
      name: fullName || "بدون اسم",
      email,
      password,
      phone,
      role,
      status,
    });

    // 5. توزيع البيانات على الجداول الفرعية (التعديل الأساسي هنا)

    // أ- المشترك (Subscriber)
    if (role === "subscriber") {
      await Subscriber.create({
        userId: newUser._id,
        age: Number(age),
        height: Number(height),
        weight: Number(weight),        // تم التأكد من المسمى
        targetWeight: Number(goalWeight), // ربط goalWeight بـ targetWeight في الموديل
        goal: goalType,                // ربط goalType بـ goal في الموديل
        diseases,
        allergies,
        nutritionistId: null, 
    trainerId: null,
        bmi: 0 // يتم حسابه لاحقاً أو افتراضياً
      });
    }

    // ب- أخصائي التغذية (Nutritionist)
    if (role === "nutritionist") {
      await Nutritionist.create({
        userId: newUser._id,
        certificateUrl: certificatesLink, // تخزين رابط الدرايف
        specialization,
        experienceYears: Number(yearsOfExperience),
        bio: description,
        workingHoursFrom: workHoursFrom,
        workingHoursTo: workHoursTo,
        maxSubscribers: Number(maxSubscribers),
        availableSlots: Number(maxSubscribers),
        currentSubscribers:0,
        availableDays,
      });
    }

    // ج- المدرب (Trainer)
    if (role === "trainer") {
      await Trainer.create({
        userId: newUser._id,
        certificates: certificatesLink,
        specialization,
        experienceYears: Number(yearsOfExperience),
        bio: description,
        workingHoursFrom: workHoursFrom,
        workingHoursTo: workHoursTo,
        maxSubscribers: Number(maxSubscribers),
        availableSlots: Number(maxSubscribers),
        currentSubscribers:0,
        availableDays,
      });
    }

    return Response.json({
      message: status === "pending" ? "تم تقديم طلبك بنجاح" : "تم إنشاء الحساب بنجاح",
      user: { id: newUser._id, name: newUser.name, role: newUser.role }
    });

  } catch (error) {
    console.error("Register error:", error);
    return Response.json({ error: "فشل في عملية التسجيل" }, { status: 500 });
  }
}