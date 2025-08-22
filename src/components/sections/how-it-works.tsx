import { Search, FileText, Key, Home } from 'lucide-react'

export function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: 'Search Properties',
      description: 'Browse thousands of verified rental properties with detailed photos, virtual tours, and comprehensive information.',
    },
    {
      icon: FileText,
      title: 'Apply Online',
      description: 'Submit secure applications with digital documents, credit checks, and background verification all in one place.',
    },
    {
      icon: Key,
      title: 'Get Approved',
      description: 'Receive instant notifications on application status and communicate directly with property owners.',
    },
    {
      icon: Home,
      title: 'Move In',
      description: 'Complete lease agreements digitally, schedule move-in inspections, and start your rental journey.',
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our streamlined process makes finding and securing your next rental property simple and stress-free.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-lavender-100 text-lavender-600 rounded-full mb-6">
                <step.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}