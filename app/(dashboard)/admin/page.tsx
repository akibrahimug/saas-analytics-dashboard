import { AdminPanel } from "@/components/admin-panel"

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Admin</h1>
        <p className="text-muted-foreground">Manage dashboard data and simulate real-time updates</p>
      </div>

      <AdminPanel />
    </div>
  )
}
