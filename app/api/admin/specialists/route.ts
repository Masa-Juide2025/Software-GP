import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();
    
    // استخدام Aggregate لربط الجداول
    const specialists = await mongoose.model('User').aggregate([
      // 1. الفلترة: جلب الأخصائيين فقط
      {
        $match: {
          role: "nutritionist",
          status: { $in: ["approved", "active"] }
        }
      },
      // 2. الربط الأول: جلب بيانات الـ nutritionist من جدول nutritionists
      {
        $lookup: {
          from: "nutritionists", 
          localField: "_id",
          foreignField: "userId", 
          as: "nutritionistDetails"
        }
      },
      // 3. تحويل مصفوفة الـ nutritionist إلى كائن (Object)
      {
        $unwind: {
          path: "$nutritionistDetails",
          preserveNullAndEmptyArrays: true 
        }
      },
      // 4. الربط الثاني: جلب المشتركين من جدول الـ subscribers
      {
        $lookup: {
          from: "subscribers",
          let: { nutritionistObjId: "$nutritionistDetails._id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [
                    { $toString: "$nutritionistId" },
                    { $toString: "$$nutritionistObjId" }
                  ]
                }
              }
            }
          ],
          as: "activeSubscribers"
        }
      },
      // 5. الربط الثالث: جلب تفاصيل المستخدمين من جدول Users
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
          // *** معالجة اسم الأخصائي (fullName أو name) ***
          displayName: { $ifNull: ["$fullName", "$name", "اسم غير معروف"] },
          email: 1, 
          phone: 1, 
          role: 1,
          specialization: "$nutritionistDetails.specialization",
          rating: "$nutritionistDetails.rating",
          experienceYears: "$nutritionistDetails.experienceYears", 
          maxClients: "$nutritionistDetails.maxSubscribers",
          bio: "$nutritionistDetails.bio",
          
          // *** معالجة أيام العمل (availableDays أو availabilityDays) ***
          availableDays: { 
            $ifNull: [
              "$nutritionistDetails.availableDays", 
              "$nutritionistDetails.availabilityDays", 
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

    return NextResponse.json(specialists);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}