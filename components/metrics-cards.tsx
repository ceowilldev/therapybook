export function MetricsCards({ completedSessions, noShowRate, weeklyRevenue, activeClients }: {
  completedSessions: number
  noShowRate: number
  weeklyRevenue: number
  activeClients: number
}) {
  return (
    <div className="grid md:grid-cols-4 gap-6">
      <MetricCard title="Sessions" value={completedSessions.toString()} subtitle="This Week" />
      <MetricCard title="No-Show Rate" value={`${noShowRate.toFixed(1)}%`} subtitle="" />
      <MetricCard title="Weekly Revenue" value={`$${weeklyRevenue}`} subtitle="" />
      <MetricCard title="Active Clients" value={activeClients.toString()} subtitle="" />
    </div>
  )
}

function MetricCard({ title, value, subtitle }: { title: string; value: string; subtitle: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="text-sm text-gray-600 mb-1">{title}</div>
      <div className="text-3xl font-bold">{value}</div>
      {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
    </div>
  )
}
