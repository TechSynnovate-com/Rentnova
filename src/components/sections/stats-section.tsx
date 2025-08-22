export function StatsSection() {
  const stats = [
    { number: '10,000+', label: 'Properties Listed' },
    { number: '50,000+', label: 'Happy Tenants' },
    { number: '5,000+', label: 'Property Owners' },
    { number: '98%', label: 'Success Rate' },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-lavender-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}