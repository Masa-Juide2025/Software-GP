// يفضل إنشاء مكون خاص بالمدربين لسهولة التخصيص لاحقاً:
import { TrainersGrid } from "@/components/admin/trainers-grid";

export default function SpecialistsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold lg:text-2xl">ادارة المدربين</h2>
        <p className="text-sm text-muted-foreground">
          عرض وادارة المدربين الرياضيين
        </p>
      </div>
      <TrainersGrid />
    </div>
  )
}