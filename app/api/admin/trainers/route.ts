import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();
    
    // استخدام Aggregate لربط الجداول
    const trainers = await mongoose.model('User').aggregate([
      // 1. الفلترة: جلب المدربين فقط
      {
        $match: {
          role: "trainer",
          status: { $in: ["approved", "active"] }
        }
      },
      // 2. الربط الأول: جلب بيانات الـ trainer من جدول trainers
      {
        $lookup: {
          from: "trainers", // اسم جدول المدربين في قاعدة البيانات
          localField: "_id",
          foreignField: "userId", 
          as: "trainerDetails"
        }
      },
      // 3. تحويل مصفوفة الـ trainer إلى كائن (Object)
      {
        $unwind: {
          path: "$trainerDetails",
          preserveNullAndEmptyArrays: true 
        }
      },
      // 4. الربط الثاني: جلب المشتركين من جدول الـ subscribers
      {
        $lookup: {
          from: "subscribers",
          let: { trainerObjId: "$trainerDetails._id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [
                    { $toString: "$trainerId" }, // الحقل الذي يربط المشترك بالمدرب
                    { $toString: "$$trainerObjId" }
                  ]
                }
              }
            }
          ],
          as: "activeSubscribers"
        }
      },
      // 5. الربط الثالث: جلب تفاصيل المستخدمين من جدول Users للمشتركين
      {
        $lookup: {
          from: "User",
          localField: "activeSubscribers.userId",
          foreignField: "_id",
          as: "subscriberDetails"
        }
      },
      // 6. تشكيل الحقول النهائية
      {
        $project: {
          _id: 1,
          // *** معالجة اسم المدرب (fullName أو name) ***
          displayName: { $ifNull: ["$fullName", "$name", "اسم غير معروف"] },
          email: 1, 
          phone: 1, 
          role: 1,
          specialization: "$trainerDetails.specialization",
          rating: "$trainerDetails.rating",
          experienceYears: "$trainerDetails.experienceYears", 
          maxClients: "$trainerDetails.maxSubscribers",
          bio: "$trainerDetails.bio",
          
          // *** معالجة أيام العمل (availableDays أو availabilityDays) ***
          availableDays: { 
            $ifNull: [
              "$trainerDetails.availableDays", 
              "$trainerDetails.availabilityDays", 
              [] 
            ] 
          },

          currentClients: { $size: "$activeSubscribers" },
          
          // *** جلب قائمة أسماء المشتركين مع التحقق من الحقل (name أو fullName) ***
          subscriberList: {
            $map: {
              input: "$subscriberDetails",
              as: "sub",
              in: {
                // *** تحقق هنا: استخدام name أو fullName للمشترك ***
                displayName2: { $ifNull: ["$$sub.fullName", "$$sub.name", "اسم غير معروف"] },
                phone: { $ifNull: ["$$sub.phone", "لا يوجد رقم"] }
              }
            }
          }
        }
      }
    ]);

    return NextResponse.json(trainers);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}