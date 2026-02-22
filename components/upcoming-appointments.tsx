import { format } from 'date-fns'
import { Button } from '@/components/ui/button'

export function UpcomingAppointments({ appointments }: { appointments: any[] }) {
  return (
    <div className="space-y-3">
      {appointments.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No upcoming appointments</p>
      ) : (
        appointments.map(apt => (
          <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium">
                {apt.client.firstName[0]}. {apt.client.lastName}
              </div>
              <div className="text-sm text-gray-600">
                {format(new Date(apt.startTime), 'MMM d, yyyy h:mm a')}
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">Attended</Button>
              <Button size="sm" variant="outline">No-Show</Button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
