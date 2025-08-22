
import { Button } from '@/components/ui/button'
import { Building, Users, Shield, Award, Heart, Target } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'About Us - RentNova',
  description: 'Learn about RentNova\'s mission to revolutionize the rental market with technology-driven solutions for tenants and landlords.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-lavender-50 via-white to-lavender-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              About <span className="text-lavender-600">RentNova</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              We're revolutionizing the rental market by connecting tenants and landlords 
              through innovative technology and exceptional service.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                At RentNova, we believe that finding and managing rental properties should be 
                simple, transparent, and efficient. Our mission is to eliminate the pain points 
                in the traditional rental process by providing a comprehensive digital platform 
                that serves both tenants and landlords.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                We're committed to building trust in the rental market through verified listings, 
                secure transactions, and exceptional customer support.
              </p>
              <Link href="/auth/register">
                <Button variant="gradient" size="lg">
                  Join Our Community
                </Button>
              </Link>
            </div>
            <div className="bg-gradient-to-br from-lavender-100 to-lavender-200 rounded-lg p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <Target className="h-12 w-12 text-lavender-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Innovation</h3>
                  <p className="text-sm text-gray-600">Cutting-edge solutions for modern rental needs</p>
                </div>
                <div className="text-center">
                  <Shield className="h-12 w-12 text-lavender-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Trust</h3>
                  <p className="text-sm text-gray-600">Verified listings and secure transactions</p>
                </div>
                <div className="text-center">
                  <Users className="h-12 w-12 text-lavender-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Community</h3>
                  <p className="text-sm text-gray-600">Building connections in the rental ecosystem</p>
                </div>
                <div className="text-center">
                  <Heart className="h-12 w-12 text-lavender-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Care</h3>
                  <p className="text-sm text-gray-600">Exceptional support every step of the way</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do and shape the experience we create 
              for our community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="bg-lavender-100 rounded-lg p-3 w-fit mb-6">
                <Shield className="h-8 w-8 text-lavender-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Transparency</h3>
              <p className="text-gray-600">
                We believe in complete transparency in all our processes, from property listings 
                to transaction fees. No hidden costs, no surprises.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="bg-lavender-100 rounded-lg p-3 w-fit mb-6">
                <Award className="h-8 w-8 text-lavender-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quality</h3>
              <p className="text-gray-600">
                We maintain high standards for property listings and user experience, 
                ensuring every interaction on our platform meets our quality benchmarks.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="bg-lavender-100 rounded-lg p-3 w-fit mb-6">
                <Users className="h-8 w-8 text-lavender-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Empowerment</h3>
              <p className="text-gray-600">
                We empower our users with the tools, information, and support they need 
                to make informed decisions about their rental journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-lavender-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Our Impact</h2>
            <p className="text-lg text-lavender-100 max-w-2xl mx-auto">
              Since our founding, we've helped thousands of people find their perfect rental match.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">10,000+</div>
              <div className="text-lavender-100">Properties Listed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">5,000+</div>
              <div className="text-lavender-100">Happy Tenants</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">2,500+</div>
              <div className="text-lavender-100">Verified Landlords</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">98%</div>
              <div className="text-lavender-100">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied users who have transformed their rental experience with RentNova.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register?role=tenant">
              <Button variant="gradient" size="lg" className="w-full sm:w-auto">
                Find a Property
              </Button>
            </Link>
            <Link href="/auth/register?role=landlord">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                List Your Property
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}