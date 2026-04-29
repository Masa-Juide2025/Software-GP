import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    await connectDB();
    
    const body = await req.json();
    const { subscriberId, nutritionistId, message } = body;

    // التأكد من وصول النص للسيرفر (سيظهر في الـ Terminal)
    console.log("Message received to save:", message);

    if (!message || message.trim() === "") {
      return NextResponse.json({ error: "الرسالة فارغة" }, { status: 400 });
    }

    // الوصول المباشر لقاعدة البيانات لتجنب قيود الـ Schema التي تمسح النص
    const db = mongoose.connection.db;
    
    // تأكد من أن الاتصال بالـ DB ليس null
    if (!db) {
        throw new Error("Database connection not established");
    }

    const result = await db.collection("Message").insertOne({
      subscriberId: new mongoose.Types.ObjectId(subscriberId),
      nutritionistId: new mongoose.Types.ObjectId(nutritionistId),
      message: message.trim(), // هذا هو السطر الذي سيجبر التخزين
      sender: "nutritionist",
      createdAt: new Date(),
      updatedAt: new Date(),
      __v: 0
    });

    console.log("Saved successfully with ID:", result.insertedId);

    return NextResponse.json({ 
      success: true, 
      data: { _id: result.insertedId, message: message.trim() } 
    });

  } catch (error: any) {
    console.error("Critical Error during save:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}