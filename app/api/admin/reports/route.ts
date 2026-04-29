import { connectDB } from "@/lib/mongodb"
import Nutritionist from "@/models/Nutritionist"
import Subscriber from "@/models/Subscriber" // تأكد أن هذا هو الموديل الصحيح لجدول السبسكرايبر

export async function GET() {
  try {
    await connectDB()

    const [subscribers, nutritionists] = await Promise.all([
      Subscriber.find({}), // جلب البيانات من جدول المشتركين مباشرة
      Nutritionist.find({})
    ])

    return Response.json({
      subscribers,
      nutritionists
    })
  } catch (error) {
    console.error("Database Error:", error)
    return Response.json({ error: "فشل في جلب البيانات من قاعدة البيانات" }, { status: 500 })
  }
}