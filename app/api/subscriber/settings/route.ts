import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) return NextResponse.json({ success: false, error: "Email required" }, { status: 400 });

    const user = await User.findOne({ email }).lean() as any;
    if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

    const sub = await Subscriber.findOne({ userId: user._id }).lean() as any;

    // الماب المحدث ليشمل كل الحالات الجديدة
    const goalMap: any = {
    "weight_loss": "إنقاص وزن",
      "lose_weight": "إنقاص وزن",
      "build_muscle": "بناء عضلات",
      "gain_weight": "زيادة وزن",
      "Follow-up of a diabetic patient": "متابعة مريض سكري",
      "Monitoring a patient with high blood pressure": "متابعة مريض ضغط دم مرتفع",
      "Monitoring pregnant woman's nutrition": "متابعة تغذية الحوامل"
    };

    return NextResponse.json({
      success: true,
      data: {
        fullName: user.fullName || user.name || "",
        email: user.email,
        phone: user.phone || "",
        age: sub?.age || "",
        // إذا الهدف مش موجود في الماب بنعرضه زي ما هو
        target: goalMap[sub?.goal] || sub?.goal || "غير محدد", 
        currentWeight: sub?.weight || "",
        targetWeight: sub?.targetWeight || "",
        height: sub?.height || "",
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { email, password, ...updateData } = body;

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ success: false, error: "User not found" });

    const userUpdates: any = { 
      fullName: updateData.fullName,
      phone: updateData.phone 
    };
    
    if (password && password.trim() !== "") {
      userUpdates.password = password; 
    }
    
    await User.updateOne({ _id: user._id }, { $set: userUpdates });

    await Subscriber.updateOne(
      { userId: user._id },
      {
        $set: {
          age: updateData.age,
          weight: updateData.currentWeight,
          targetWeight: updateData.targetWeight,
          height: updateData.height,
        }
      }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}