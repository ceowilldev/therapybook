import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { BookingForm } from '@/components/booking-form'
import { format } from 'date-fns'

export default async function BookingPage({ params }: { params: { slug: string } }) {
  const therapist = await prisma.therapist.findUnique({
    where: { slug: params.slug },
    include: { user: true }
  })

  if (!therapist) notFound()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Therapist Info */}
        <div className="bg-white p-8 rounded-lg shadow mb-8">
          <div className="flex items-start gap-6">
            {therapist.user.image && (
              <img 
                src={therapist.user.image} 
                alt={therapist.user.name || 'Therapist'} 
                className="w-24 h-24 rounded-full"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold mb-2">{therapist.user.name}</h1>
              {therapist.licenseNumber && (
                <p className="text-gray-600 mb-2">License: {therapist.licenseNumber}</p>
              )}
              {therapist.specialties && therapist.specialties.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {therapist.specialties.map(s => (
                    <span key={s} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {s}
                    </span>
                  ))}
                </div>
              )}
              {therapist.bio && (
                <p className="text-gray-700">{therapist.bio}</p>
              )}
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">Book an Appointment</h2>
          <BookingForm 
            therapistId={therapist.id}
            timezone={therapist.timezone}
            sessionDuration={therapist.sessionDuration}
          />
        </div>
      </div>
    </div>
  )
}
