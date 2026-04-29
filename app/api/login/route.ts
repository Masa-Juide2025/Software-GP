import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Nutritionist from "@/models/Nutritionist";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 400 });
    }

    // مقارنة كلمة المرور
    const isMatch = password === user.password;
    if (!isMatch) {
      return Response.json({ error: "Invalid password" }, { status: 400 });
    }

    // منع الحسابات التي لم يتم الموافقة عليها بعد
    if ((user.role === "nutritionist" || user.role === "trainer") && user.status === "pending") {
      return Response.json(
        { error: "Your account is waiting for admin approval" },
        { status: 403 }
      );
    }

    // جلب التخصص للأخصائي فقط
    let specialization = "";
    if (user.role === "nutritionist") {
      const nutritionistData = await Nutritionist.findOne({ userId: user._id });
      specialization = nutritionistData?.specialization || "";
    }

    return Response.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        specialization: specialization, 
      },
    });

  } catch (error) {
    console.error("❌ Login error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}