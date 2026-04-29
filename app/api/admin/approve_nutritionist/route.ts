import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Nutritionist from "@/models/Nutritionist";

export async function PUT(req: Request) {
  try {
    await connectDB();

    const { userId } = await req.json();

    // ✅ حدثي حالة اليوزر
    await User.findByIdAndUpdate(userId, {
      status: "approved",
    });

    // ✅ حدثي طلب الأخصائي
    await Nutritionist.findOneAndUpdate(
      { userId },
      { approved: true }
    );

    return Response.json({ message: "Approved successfully" });

  } catch (error) {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}