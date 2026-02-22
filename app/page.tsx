import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">TherapyBook</h1>
          <div className="space-x-4">
            <Link href="/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold mb-6">
          Scheduling for Therapists.<br />
          Simple. Private. HIPAA-aware.
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Stop juggling spreadsheets, missed appointments, and billing chaos. 
          TherapyBook handles scheduling, reminders, and insurance codes so you can focus on care.
        </p>
        <Link href="/signup">
          <Button size="lg" className="text-lg px-8 py-6">
            Start Free Trial →
          </Button>
        </Link>
        <p className="text-sm text-gray-500 mt-4">No credit card required • 5 clients free forever</p>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Everything you need</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            title="Online Booking"
            description="Clients book directly from your custom link. Auto-sync with Google Calendar."
          />
          <FeatureCard 
            title="SMS Reminders"
            description="24-hour automatic reminders reduce no-shows by 70%."
          />
          <FeatureCard 
            title="Insurance Billing"
            description="CPT codes (90834, 90837) ready. Export claims in seconds."
          />
          <FeatureCard 
            title="Client Privacy"
            description="HIPAA-aware design. Initials-only display. Encrypted notes."
          />
          <FeatureCard 
            title="No-Show Tracking"
            description="Identify patterns. Set deposit requirements for repeat offenders."
          />
          <FeatureCard 
            title="Revenue Dashboard"
            description="See weekly earnings, utilization %, and session trends."
          />
        </div>
      </section>

      {/* Pricing */}
      <section className="container mx-auto px-4 py-16" id="pricing">
        <h3 className="text-3xl font-bold text-center mb-12">Simple, transparent pricing</h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <PricingCard
            name="Free"
            price="$0"
            period="/forever"
            features={[
              "5 active clients",
              "Unlimited appointments",
              "SMS reminders",
              "Basic analytics"
            ]}
          />
          <PricingCard
            name="Pro"
            price="$29"
            period="/month"
            popular
            features={[
              "Unlimited clients",
              "Insurance billing codes",
              "Custom booking page",
              "Priority support",
              "Stripe copay processing"
            ]}
          />
          <PricingCard
            name="Enterprise"
            price="Custom"
            period=""
            features={[
              "Multi-location",
              "Team accounts",
              "API access",
              "White-label branding",
              "Dedicated account manager"
            ]}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 mt-20">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2024 TherapyBook. HIPAA-aware scheduling for mental health professionals.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition">
      <h4 className="font-bold text-lg mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function PricingCard({ name, price, period, features, popular }: {
  name: string
  price: string
  period: string
  features: string[]
  popular?: boolean
}) {
  return (
    <div className={`p-8 rounded-lg border-2 ${popular ? 'border-blue-500 shadow-xl scale-105' : 'border-gray-200'}`}>
      {popular && <div className="text-blue-600 font-semibold text-sm mb-2">MOST POPULAR</div>}
      <h4 className="font-bold text-2xl mb-2">{name}</h4>
      <div className="mb-6">
        <span className="text-4xl font-bold">{price}</span>
        <span className="text-gray-600">{period}</span>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature) => (
          <li key={feature} className="flex items-start">
            <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      <Button className="w-full" variant={popular ? 'default' : 'outline'}>
        {name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
      </Button>
    </div>
  )
}
