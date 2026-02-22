'use client'

export function CalendarView({ appointments }: { appointments: any[] }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  
  return (
    <div className="grid grid-cols-5 gap-4">
      {days.map(day => (
        <div key={day} className="text-center">
          <div className="font-semibold text-gray-700 mb-2">{day}</div>
          <div className="space-y-2">
            {appointments
              .filter(a => new Date(a.startTime).toLocaleDateString('en-US', {weekday: 'short'}) === day)
              .map(apt => (
                <div key={apt.id} className="bg-blue-100 p-2 rounded text-sm">
                  {new Date(apt.startTime).toLocaleTimeString('en-US', {hour: 'numeric', minute: '2-digit'})}
                  <div className="text-xs text-gray-600">
                    {apt.client.firstName[0]}. {apt.client.lastName}
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      ))}
    </div>
  )
}
