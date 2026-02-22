'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function BookingForm({ therapistId, timezone, sessionDuration }: {
  therapistId: string
  timezone: string
  sessionDuration: number
}) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    insurance: '',
    copay: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement booking API call
    alert('Booking submitted! (API integration needed)')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">First Name</label>
          <input
            type="text"
            required
            className="w-full px-3 py-2 border rounded-md"
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <input
            type="text"
            required
            className="w-full px-3 py-2 border rounded-md"
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="tel"
            required
            className="w-full px-3 py-2 border rounded-md"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded-md"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Insurance Provider</label>
          <select
            className="w-full px-3 py-2 border rounded-md"
            value={formData.insurance}
            onChange={(e) => setFormData({...formData, insurance: e.target.value})}
          >
            <option value="">Self-pay</option>
            <option value="Blue Cross">Blue Cross</option>
            <option value="Aetna">Aetna</option>
            <option value="UnitedHealthcare">UnitedHealthcare</option>
            <option value="Cigna">Cigna</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Copay Amount</label>
          <input
            type="number"
            className="w-full px-3 py-2 border rounded-md"
            value={formData.copay}
            onChange={(e) => setFormData({...formData, copay: e.target.value})}
          />
        </div>
      </div>

      <Button type="submit" className="w-full">Confirm Booking</Button>
    </form>
  )
}
