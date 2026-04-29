import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Subscriber from "@/models/Subscriber";
import Trainer from "@/models/Trainer";
import Nutritionist from "@/models/Nutritionist";
import mongoose from "mongoose";

const cityDistances: { [key: string]: { [key: string]: number } } = {
  "nablus": { "nablus": 0, "ramallah": 45, "hebron": 85, "jenin": 25, "tulkarm": 30, "jericho": 55, "qalqilya": 35 },
  "ramallah": { "ramallah": 0, "nablus": 45, "hebron": 40, "jenin": 70, "jericho": 35, "jerusalem": 20 },
  "hebron": { "hebron": 0, "ramallah": 40, "nablus": 85, "jerusalem": 35, "bethlehem": 20 },
};

function getDistance(city1: string, city2: string): number {
  const c1 = city1.toLowerCase().trim();
  const c2 = city2.toLowerCase().trim();
  if (cityDistances[c1]?.[c2] !== undefined) return cityDistances[c1][c2];
  if (cityDistances[c2]?.[c1] !== undefined) return cityDistances[c2][c1];
  return 999;
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    const { subscriberEmail, location, appointmentTime, providerType, lat, lng } = await req.json();
    
    const user = await User.findOne({ email: subscriberEmail }).lean() as any;
    const sub = await Subscriber.findOne({ userId: user._id }).lean() as any;
    const isTrainer = providerType === "trainer";
    const providerId = isTrainer ? sub.trainerId : sub.nutritionistId;
    
    const enrollmentCollection = isTrainer ? "TrainerEnrollment" : "Enrollments"; 
    const providerIdKey = isTrainer ? "trainerId" : "nutritionistId";
    const targetCollection = isTrainer ? "TrainerBookings" : "NutritionistBookings";

    // تصليح جلب اسم الترينر أو الأخصائي
    let pName = "غير معروف";
    if (isTrainer && sub.trainerId) {
        // تحويل الـ ID لـ ObjectId لضمان نجاح البحث في Trainer
        const t = await Trainer.findOne({ _id: new mongoose.Types.ObjectId(sub.trainerId.toString()) }).lean() as any;
        if (t?.userId) {
            const tu = await User.findById(t.userId).lean() as any;
            pName = tu?.fullName || tu?.name || "مدرب غير مسجل";
        }
    } else if (!isTrainer && sub.nutritionistId) {
        const n = await Nutritionist.findOne({ _id: new mongoose.Types.ObjectId(sub.nutritionistId.toString()) }).lean() as any;
        if (n?.userId) {
            const nu = await User.findById(n.userId).lean() as any;
            pName = nu?.fullName || nu?.name || "أخصائي غير مسجل";
        }
    }

    const enrollments = await db?.collection(enrollmentCollection).find({ 
        [providerIdKey]: providerId.toString() 
    }).toArray();

    let availableCentersWithDistance = [];
    for (const en of enrollments || []) {
      const centerDoc = await db?.collection("Centers").findOne({ _id: new mongoose.Types.ObjectId(en.centerId) });
      if (centerDoc) {
        const centerCity = Object.keys(cityDistances).find(city => (centerDoc.address || "").toLowerCase().includes(city)) || "";
        availableCentersWithDistance.push({
          centerId: centerDoc._id.toString(),
          centerName: centerDoc.name,
          centerAddress: centerDoc.address,
          distance: getDistance((location || "").toLowerCase(), centerCity)
        });
      }
    }
    availableCentersWithDistance.sort((a, b) => a.distance - b.distance);
    const matchedCenter = availableCentersWithDistance[0] || null;

    const bookingPayload: any = {
      subscriberId: sub.userId,
      subscriberName: user.fullName || user.name,
      subscriberLocation: location,
      coordinates: { lat, lng },
      [providerIdKey]: providerId,
      appointmentTime,
      status: "pending",
      assignedCenters: matchedCenter ? [matchedCenter] : [],
      createdAt: new Date()
    };
    if (isTrainer) bookingPayload.trainerName = pName;
    else bookingPayload.nutritionistName = pName;

    await db?.collection(targetCollection).insertOne(bookingPayload);
    return NextResponse.json({ success: true, closest: matchedCenter });
  } catch (error: any) { 
    return NextResponse.json({ success: false, error: error.message }, { status: 500 }); 
  }
}

export async function GET(req: Request) {
    try {
      await connectDB();
      const db = mongoose.connection.db;
      const { searchParams } = new URL(req.url);
      const email = searchParams.get("email");
      const user = await User.findOne({ email }).lean() as any;
      if (!user) return NextResponse.json({ success: false, error: "User not found" });

      const sub = await Subscriber.findOne({ userId: user._id }).lean() as any;
      
      let nutData: any = null, trnData: any = null;
      
      const cleanDate = (d: any) => {
        if (!d) return "اليوم";
        const dateObj = new Date(d);
        if (isNaN(dateObj.getTime())) return String(d).split(' ').slice(0, 4).join(' ');
        return dateObj.toISOString().split('T')[0];
      };

      if (sub?.nutritionistId) {
         const n = await Nutritionist.findById(sub.nutritionistId).lean() as any;
         const nu = await User.findById(n?.userId).lean() as any;
         const appointments = await db?.collection("Appointment").find({ 
            nutritionistId: new mongoose.Types.ObjectId(sub.nutritionistId.toString()) 
         }).toArray();

         nutData = { 
            name: nu?.fullName || nu?.name || "غير معروف",
            days: n?.availableDays || [],
            hours: `${n?.workingHours?.from || n?.workingHoursFrom || '--'} - ${n?.workingHours?.to || n?.workingHoursTo || '--'}`,
            bookedSlots: appointments?.map(a => ({ time: a.time, date: cleanDate(a.day || a.date) })) || []
         };
      }

      if (sub?.trainerId) {
         const t = await Trainer.findById(sub.trainerId).lean() as any;
         const tu = await User.findById(t?.userId).lean() as any;
         const appointments = await db?.collection("Appointment").find({ 
            trainerId: sub.trainerId.toString() 
         }).toArray();

         trnData = { 
            name: tu?.fullName || tu?.name || "غير معروف",
            days: t?.availableDays || [],
            hours: `${t?.workingHours?.from || t?.workingHoursFrom || '--'} - ${t?.workingHours?.to || t?.workingHoursTo || '--'}`,
            bookedSlots: appointments?.map(a => ({ time: a.time, date: cleanDate(a.day || a.date) })) || []
         };
      }

      return NextResponse.json({ 
        success: true, 
        data: { 
          subscriberName: user.fullName || user.name, 
          nutritionist: nutData, 
          trainer: trnData, 
          nutritionistName: nutData?.name, 
          trainerName: trnData?.name 
        } 
      });
    } catch (e: any) { return NextResponse.json({ success: false, error: e.message }); }
}