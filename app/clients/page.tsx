import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function ClientsPage() {
  const session = await getServerSession()
  if (!session?.user) redirect('/signin')

  const therapist = await prisma.therapist.findUnique({
    where: { userId: session.user.id },
    include: {
      clients: {
        include: {
          appointments: {
            orderBy: { startTime: 'desc' },
            take: 1
          }
        },
        orderBy: { lastName: 'asc' }
      }
    }
  })

  if (!therapist) redirect('/onboarding')

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Clients</h1>
          <Link href="/clients/new">
            <Button>Add Client</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Insurance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Session</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {therapist.clients.map(client => {
                  const lastAppt = client.appointments[0]
                  return (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium">
                          {client.firstName[0]}. {client.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {client.firstName} {client.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          {client.phone.slice(-4)} • {client.email ? client.email.slice(0,3) + '***' : 'No email'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          {client.insuranceProvider || 'Self-pay'}
                          {client.copayAmount && <div className="text-xs text-gray-500">${client.copayAmount} copay</div>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {lastAppt ? format(new Date(lastAppt.startTime), 'MMM d, yyyy') : 'No sessions'}
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/clients/${client.id}`}>
                          <Button variant="ghost" size="sm">View</Button>
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
