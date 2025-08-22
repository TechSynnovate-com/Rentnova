import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Shield, AlertTriangle, Eye, Phone, FileText, CheckCircle, XCircle, Users, Lock, Flag } from 'lucide-react'

export default function SafetyPage() {
  const safetyTips = [
    {
      icon: Eye,
      title: "Verify Property Listings",
      description: "Always verify property details and landlord credentials before viewing",
      color: "bg-blue-500",
      tips: [
        "Cross-check property photos with online maps",
        "Verify landlord identity through official documents",
        "Look for verified badges on listings",
        "Be wary of prices significantly below market rate"
      ]
    },
    {
      icon: Users,
      title: "Safe Property Viewings",
      description: "Take precautions when visiting properties for viewings",
      color: "bg-green-500",
      tips: [
        "Always bring someone with you to viewings",
        "Meet during daylight hours",
        "Inform others about your viewing schedule",
        "Trust your instincts if something feels wrong"
      ]
    },
    {
      icon: Lock,
      title: "Secure Payments",
      description: "Protect yourself from payment fraud and scams",
      color: "bg-purple-500",
      tips: [
        "Never pay before seeing the property",
        "Use secure payment methods only",
        "Get receipts for all transactions",
        "Avoid cash-only payment requests"
      ]
    },
    {
      icon: FileText,
      title: "Document Everything",
      description: "Keep records of all interactions and agreements",
      color: "bg-orange-500",
      tips: [
        "Save all communication with landlords",
        "Take photos during property viewings",
        "Read all contracts carefully",
        "Keep copies of all signed documents"
      ]
    }
  ]

  const redFlags = [
    "Landlord refuses to meet in person or show ID",
    "Property is priced significantly below market rate",
    "Request for payment via wire transfer or cryptocurrency",
    "No proper rental agreement or lease contract",
    "Pressure to pay immediately without viewing",
    "Landlord claims to be out of the country",
    "Property photos look too professional or stock",
    "No verified contact information provided"
  ]

  const verificationSteps = [
    {
      step: 1,
      title: "Identity Verification",
      description: "Verify the landlord's identity through official documents and credentials"
    },
    {
      step: 2,
      title: "Property Ownership",
      description: "Confirm the landlord actually owns or manages the property legally"
    },
    {
      step: 3,
      title: "Secure Communication",
      description: "Use RentNova's messaging system for all communications"
    },
    {
      step: 4,
      title: "Safe Payments",
      description: "Make all payments through verified and secure payment methods"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 via-pink-600 to-orange-600 text-white py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <Shield className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              Stay Safe While Renting
            </h1>
            <p className="text-lg sm:text-xl text-red-100 mb-8 sm:mb-10 max-w-3xl mx-auto">
              Learn how to protect yourself from rental scams, verify properties, and make secure transactions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 font-semibold">
                <Flag className="mr-2 h-5 w-5" />
                Report Suspicious Activity
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Phone className="mr-2 h-5 w-5" />
                Emergency Support
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Safety Tips */}
        <div className="mb-16 sm:mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Essential Safety Guidelines
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Follow these important safety measures to protect yourself throughout your rental journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {safetyTips.map((tip, index) => {
              const IconComponent = tip.icon
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                  <CardHeader className={`${tip.color} text-white p-6`}>
                    <div className="flex items-center space-x-4">
                      <IconComponent className="h-8 w-8 group-hover:scale-110 transition-transform" />
                      <div>
                        <CardTitle className="text-xl sm:text-2xl">{tip.title}</CardTitle>
                        <p className="text-sm sm:text-base opacity-90 mt-2">{tip.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ul className="space-y-3">
                      {tip.tips.map((tipItem, tipIndex) => (
                        <li key={tipIndex} className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm sm:text-base text-gray-700">{tipItem}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Red Flags Warning */}
        <div className="bg-gradient-to-r from-red-100 to-pink-100 rounded-2xl p-6 sm:p-8 lg:p-12 mb-16 sm:mb-20">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-red-500 p-3 rounded-full">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              🚨 Red Flags to Watch Out For
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Be alert for these common warning signs of rental scams
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {redFlags.map((flag, index) => (
              <div key={index} className="flex items-start space-x-3 bg-white p-4 rounded-lg shadow-sm">
                <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm sm:text-base text-gray-700">{flag}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Process */}
        <div className="mb-16 sm:mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Verification Process
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              RentNova uses a comprehensive verification system to ensure safe rental experiences
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {verificationSteps.map((step, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-2xl p-6 sm:p-8 lg:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Need Immediate Help?
          </h2>
          <p className="text-base sm:text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            If you encounter suspicious activity or feel unsafe, contact our security team immediately
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold">
              <Phone className="mr-2 h-5 w-5" />
              Call Security: (234) 800-SAFE
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Flag className="mr-2 h-5 w-5" />
              Report Incident
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}