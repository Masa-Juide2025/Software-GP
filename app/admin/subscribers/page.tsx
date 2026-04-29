import { SubscribersTable } from "@/components/admin/subscribers-table"

export default function SubscribersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold lg:text-2xl">ادارة المشتركين</h2>
        <p className="text-sm text-muted-foreground">
          عرض وادارة جميع المشتركين في النظام
        </p>
      </div>
      <SubscribersTable />
    </div>
  )
}