import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

export async function sendAppointmentReminder(
  clientPhone: string,
  therapistName: string,
  appointmentTime: Date
) {
  const message = `Reminder: You have an appointment with ${therapistName} tomorrow at ${appointmentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}. Reply CONFIRM or call to reschedule.`

  return await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: clientPhone
  })
}

export async function sendBookingConfirmation(
  clientPhone: string,
  therapistName: string,
  appointmentTime: Date
) {
  const message = `Appointment confirmed with ${therapistName} on ${appointmentTime.toLocaleDateString()} at ${appointmentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}. You'll receive a reminder 24 hours before.`

  return await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: clientPhone
  })
}
