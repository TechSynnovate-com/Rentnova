import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-lavender-600 to-lavender-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-xl text-lavender-100 mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied users who have found their perfect rental through RentNova.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/register">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              Create Free Account
            </Button>
          </Link>
          <Link href="/properties">
            <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-lavender-600">
              Browse Properties
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}