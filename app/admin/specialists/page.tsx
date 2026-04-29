import { SpecialistsGrid } from "@/components/admin/specialists-grid"

export default function SpecialistsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold lg:text-2xl">ادارة الأخصائيين</h2>
        <p className="text-sm text-muted-foreground">
          عرض وادارة أخصائيي التغذية والمدربين الرياضيين
        </p>
      </div>
      <SpecialistsGrid />
    </div>
  )
}