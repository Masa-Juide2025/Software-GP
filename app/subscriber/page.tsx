"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { WeightLossDashboard } from "@/components/subscriber-dashboards/weight-loss-dashboard"
import { WeightGainDashboard } from "@/components/subscriber-dashboards/weight-gain-dashboard"
import { SportsNutritionDashboard } from "@/components/subscriber-dashboards/sports-nutrition-dashboard"
import { DiabetesDashboard } from "@/components/subscriber-dashboards/diabetes-dashboard"
import { HypertensionDashboard } from "@/components/subscriber-dashboards/hypertension-dashboard"
import { PregnancyDashboard } from "@/components/subscriber-dashboards/pregnancy-dashboard"

export default function SubscriberMainPage() {
  const router = useRouter();
  const [subscriber, setSubscriber] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const email = localStorage.getItem("userEmail");
        if (!email) {
          router.push("/login");
          return;
        }

        const res = await fetch(`/api/subscriber/dashboard?email=${email}`);
        const result = await res.json();

        if (result.success) {
          console.log("الهدف من الداتابيز هو:", result.data.goal);
          setSubscriber(result.data);
        } else {
          router.push("/login");
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-[#fafafa]">
        <Loader2 className="h-12 w-12 animate-spin text-[#107c41]" />
        <p className="font-bold text-gray-500 italic text-lg text-center">جاري تحميل بياناتك الصحية...</p>
      </div>
    );
  }

  if (!subscriber) return null;

  // تنظيف النص بشكل كامل
  const rawGoal = subscriber.goal?.toString().toLowerCase().trim() || "";

  // 1. فحص زيادة الوزن
  if (rawGoal.includes("gain_weight") || rawGoal.includes("weight_gain") || rawGoal.includes("زيادة")) {
    return <WeightGainDashboard subscriber={subscriber} />;
  }

  // 2. فحص خسارة الوزن
  if (rawGoal.includes("lose_weight") || rawGoal.includes("weight_loss") || rawGoal.includes("خسارة") || rawGoal.includes("إنقاص")) {
    return <WeightLossDashboard subscriber={subscriber} />;
  }

  // 3. فحص بناء العضلات / الرياضة
  if (rawGoal.includes("build_muscle") || rawGoal.includes("sports") || rawGoal.includes("رياضة")) {
    return <SportsNutritionDashboard subscriber={subscriber} />;
  }

  // 4. فحص السكري (بناءً على الكلمات المفتاحية عشان المسافات ما تغلبك)
  if (rawGoal.includes("diabetic") || rawGoal.includes("diabetes") || rawGoal.includes("سكري")) {
    return <DiabetesDashboard subscriber={subscriber} />;
  }

  // 5. فحص ضغط الدم
  if (rawGoal.includes("blood pressure") || rawGoal.includes("hypertension") || rawGoal.includes("ضغط")) {
    return <HypertensionDashboard subscriber={subscriber} />;
  }

  // 6. فحص الحمل
  if (rawGoal.includes("pregnant") || rawGoal.includes("pregnancy") || rawGoal.includes("حمل")) {
    return <PregnancyDashboard subscriber={subscriber} />;
  }

  // الافتراضي في حال لم ينجح أي شرط
  console.warn("القيمة المستلمة لم تطابق الشروط:", rawGoal);
  return <WeightLossDashboard subscriber={subscriber} />;
}