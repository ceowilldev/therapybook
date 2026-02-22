import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { CalendarView } from '@/components/calendar-view'
import { MetricsCards } from '@/components/metrics-cards'
import { UpcomingAppointments } from '@/components/upcoming-appointments'

export default async function DashboardPage() {
  const session = await getServerSession()
  if (!session?.user) redirect('/signin')

  const therapist = await prisma.therapist.findUnique({
    where: { userId: session.user.id },
    include: {
      appointments: {
        where: {
          startTime: { gte: new Date() }
        },
        include: { client: true },
        orderBy: { startTime: 'asc' },
        take: 10
      },
      clients: true
    }
  })

  if (!therapist) redirect('/onboarding')

  // Calculate metrics
  const thisWeekStart = new Date()
  thisWeekStart.setHours(0, 0, 0, 0)
  thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay())

  const thisWeekAppointments = await prisma.appointment.findMany({
    where: {
      therapistId: therapist.id,
      startTime: { gte: thisWeekStart }
    },
    include: { client: true, sessionNote: true }
  })

  const completedCount = thisWeekAppointments.filter(a => a.status === 'COMPLETED').length
  const noShowCount = thisWeekAppointments.filter(a => a.status === 'NO_SHOW').length
  const revenue = thisWeekAppointments
    .filter(a => a.status === 'COMPLETED')
    .reduce((sum, a) => sum + Number(a.client.copayAmount || 0), 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Metrics */}
        <MetricsCards
          completedSessions={completedCount}
          noShowRate={thisWeekAppointments.length > 0 ? (noShowCount / thisWeekAppointments.length) * 100 : 0}
          weeklyRevenue={revenue}
          activeClients={therapist.clients.length}
        />

        {/* Calendar */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">This Week</h2>
          <CalendarView appointments={therapist.appointments} />
        </div>

        {/* Upcoming */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Upcoming Appointments</h2>
          <UpcomingAppointments appointments={therapist.appointments} />
        </div>
      </main>
    </div>
  )
}
