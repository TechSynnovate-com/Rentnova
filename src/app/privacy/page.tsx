
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Shield, Eye, Lock, Users, Server, Mail, Phone, CheckCircle } from 'lucide-react'



export default function PrivacyPage() {
  const privacyPrinciples = [
    {
      icon: Shield,
      title: "Data Protection",
      description: "Your data is encrypted and secured with industry-standard protection",
      color: "bg-green-500"
    },
    {
      icon: Eye,
      title: "Transparency",
      description: "We're clear about what data we collect and how we use it",
      color: "bg-blue-500"
    },
    {
      icon: Lock,
      title: "User Control",
      description: "You have full control over your personal information",
      color: "bg-purple-500"
    },
    {
      icon: Users,
      title: "Limited Sharing",
      description: "We only share data when necessary for our services",
      color: "bg-orange-500"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <Shield className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              Privacy Policy
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-8 sm:mb-10 max-w-3xl mx-auto">
              Your privacy is important to us. Learn how we collect, use, and protect your personal information.
            </p>
            <div className="text-sm sm:text-base text-blue-200">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Privacy Principles */}
        <div className="mb-16 sm:mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Privacy Principles
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              We built RentNova with privacy in mind, following these core principles
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {privacyPrinciples.map((principle, index) => {
              const IconComponent = principle.icon
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className={`${principle.color} text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">{principle.title}</h3>
                    <p className="text-sm sm:text-base text-gray-600">{principle.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Information Collection */}
          <div className="mb-12 sm:mb-16">
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 sm:p-8">
                <CardTitle className="text-2xl sm:text-3xl">Information We Collect</CardTitle>
                <p className="text-blue-100 mt-2">We collect information you provide directly to us and automatically when you use our services.</p>
              </CardHeader>
              <CardContent className="p-6 sm:p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Information</h3>
                    <ul className="space-y-2">
                      {[
                        "Name, email address, and phone number",
                        "National Identification Number (NIN) for verification",
                        "Date of birth and emergency contact information",
                        "Employment and financial information for rental applications",
                        "Property details and images for listings"
                      ].map((item, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm sm:text-base text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Automatically Collected Information</h3>
                    <ul className="space-y-2">
                      {[
                        "Device information and IP address",
                        "Browser type and operating system",
                        "Pages visited and time spent on our site",
                        "Location data (with your consent)"
                      ].map((item, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm sm:text-base text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* How We Use Information */}
          <div className="mb-12 sm:mb-16">
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 sm:p-8">
                <CardTitle className="text-2xl sm:text-3xl">How We Use Your Information</CardTitle>
                <p className="text-green-100 mt-2">We use your information to provide and improve our rental services.</p>
              </CardHeader>
              <CardContent className="p-6 sm:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Provide, maintain, and improve our services",
                    "Process rental applications and facilitate lease agreements",
                    "Verify user identity and prevent fraud",
                    "Send important notifications about your account",
                    "Provide customer support and respond to inquiries",
                    "Comply with legal obligations and enforce our terms"
                  ].map((use, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-700">{use}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Information Sharing */}
          <div className="mb-12 sm:mb-16">
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 sm:p-8">
                <CardTitle className="text-2xl sm:text-3xl">Information Sharing</CardTitle>
                <p className="text-purple-100 mt-2">We don't sell your data. Here's when we may share information.</p>
              </CardHeader>
              <CardContent className="p-6 sm:p-8">
                <div className="space-y-4">
                  {[
                    { title: "With Landlords", desc: "When you apply for their properties" },
                    { title: "With Tenants", desc: "When you are a landlord managing applications" },
                    { title: "With Service Providers", desc: "Who help us operate our platform securely" },
                    { title: "For Legal Compliance", desc: "When required by law or to protect rights" }
                  ].map((sharing, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900">{sharing.title}</h4>
                        <p className="text-sm text-gray-600">{sharing.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Data Security */}
          <div className="mb-12 sm:mb-16">
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-red-500 to-orange-600 text-white p-6 sm:p-8">
                <CardTitle className="text-2xl sm:text-3xl">Data Security</CardTitle>
                <p className="text-red-100 mt-2">We use industry-leading security measures to protect your information.</p>
              </CardHeader>
              <CardContent className="p-6 sm:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-red-500 p-2 rounded-full">
                      <Lock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Encryption</h4>
                      <p className="text-sm text-gray-600">All data is encrypted in transit and at rest using AES-256 encryption.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-red-500 p-2 rounded-full">
                      <Server className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Secure Infrastructure</h4>
                      <p className="text-sm text-gray-600">Our servers are hosted in secure data centers with 24/7 monitoring.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-6 sm:p-8 lg:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Questions About Privacy?
          </h2>
          <p className="text-base sm:text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            If you have questions about this Privacy Policy or how we handle your data, please contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold">
              <Mail className="mr-2 h-5 w-5" />
              privacy@rentnova.com
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Phone className="mr-2 h-5 w-5" />
              (234) 800-PRIVACY
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}