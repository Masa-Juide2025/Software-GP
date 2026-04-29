import { connectDB } from "@/lib/mongodb"
import Nutritionist from "@/models/Nutritionist"
import User from "@/models/User"

export async function GET() {
  try {
    await connectDB()

    const nutritionists = await Nutritionist.find({ approved: false })
      .populate("userId")

    return Response.json(nutritionists)
  } catch (error) {
    return Response.json({ error: "Failed to fetch" }, { status: 500 })
  }
}