import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb"; 
import Notification from "@/models/Notifications"; // تأكد من وجود حرف الـ S هنا أو حذفه حسب اسم ملفك

export async function GET() {
  try {
    console.log("Connecting to DB...");
    await connectDB();
    const notifications = await Notification.find({})
      .sort({ createdAt: -1 })
      .lean();
    console.log("Fetched notifications:", notifications.length);
    return NextResponse.json(notifications);
  } catch (error) {
    console.error("GET API ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    await connectDB();
    const { id, isRead, deleteId } = await request.json();
    
    if (deleteId) {
      await Notification.findByIdAndDelete(deleteId);
      return NextResponse.json({ message: "Deleted" });
    }

    const updated = await Notification.findByIdAndUpdate(
      id, 
      { isRead }, 
      { new: true }
    );
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH API ERROR:", error);
    return NextResponse.json({ error: "Operation failed" }, { status: 500 });
  }
}