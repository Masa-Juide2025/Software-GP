import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";
import User from "@/models/User";
import Nutritionist from "@/models/Nutritionist";
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai'; 

const groq = createOpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY,
});

export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");
        if (!email) return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });

        const userDoc = await User.findOne({ email }).lean() as any;
        const nutritionist = await Nutritionist.findOne({ userId: userDoc?._id }).lean() as any;
        
        const rawSubscribers = await Subscriber.find({ nutritionistId: nutritionist?._id })
            .populate({ path: 'userId', select: 'fullName name email age image' })
            .lean();

        const subscribers = rawSubscribers.map((sub: any) => ({
            _id: sub._id.toString(),
            name: sub.userId?.fullName || sub.userId?.name || "مشترك جديد",
            age: sub.age || sub.userId?.age || "--",
            height: sub.height || "--",
            weight: sub.weight || "--",
            calories: sub.caloriesPerDay || sub.targetCalories || "2000",
            goal: sub.goal || "خسارة وزن",
            image: sub.userId?.image || ""
        }));

        return NextResponse.json({ success: true, subscribers });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { subscriber, preferences } = body;

        // الطريقة المضمونة: نطلب نص JSON صريح
        const { text } = await generateText({
            model: groq('llama-3.3-70b-versatile'),
            prompt: `أنت أخصائي تغذية. صمم خطة وجبات ليوم واحد للمشترك ${subscriber.name}.
            الهدف: ${subscriber.goal}, الوزن: ${subscriber.weight}, السعرات: ${subscriber.calories}.
            ملاحظات إضافية: ${preferences}.
            
            رد بصيغة JSON فقط كالتالي:
            {
              "meals": [
                {"name": "فطور", "items": ["صنف 1", "صنف 2"], "calories": 500},
                {"name": "غداء", "items": ["صنف 1", "صنف 2"], "calories": 700},
                {"name": "عشاء", "items": ["صنف 1", "صنف 2"], "calories": 400}
              ],
              "totalCalories": 1600,
              "tips": "نصيحة هنا"
            }
            تأكد أن النص باللغة العربية ولا تضف أي كلام خارج الـ JSON.`
        });

        // تنظيف النص من أي علامات تعليق قد يضيفها الموديل (مثل ```json)
        const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const mealPlan = JSON.parse(cleanJson);

        return NextResponse.json({ success: true, mealPlan });
    } catch (error: any) {
        console.error("AI Error:", error);
        return NextResponse.json({ success: false, error: "فشل في معالجة البيانات، حاول مرة أخرى" }, { status: 500 });
    }
}