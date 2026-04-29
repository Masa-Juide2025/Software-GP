import { connectDB } from "@/lib/mongodb";
import Supplement from "@/models/Supplement"; 
import User from "@/models/User"; 
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const supplements = await Supplement.find({})
      .populate({ path: "subscriberId", select: "name fullName", model: User })
      .sort({ createdAt: -1 }); // الترتيب حسب الأحدث
    return NextResponse.json(supplements);
  } catch (error) {
    return NextResponse.json({ error: "failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    
    const newSupplement = await Supplement.create({
      ...data,
      startDate: new Date().toISOString(), // تأمين حقل التاريخ اليدوي
      status: "active"
    });
    
    return NextResponse.json(newSupplement, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "failed to create" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const { id, ...updateData } = await req.json();
    const updated = await Supplement.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "failed to update" }, { status: 500 });
  }
}