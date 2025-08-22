
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Scale, Shield, Users, Home, CreditCard, AlertTriangle, Mail, Phone, CheckCircle } from 'lucide-react'

export const metadata = {
  title: 'Terms and Conditions - RentNova',
  description: 'RentNova Terms and Conditions - Understand the terms of use for our rental platform.',
}

export default function TermsPage() {
  const termsSections = [
    {
      icon: Users,
      title: "User Accounts",
      description: "Rules for creating and managing your RentNova account",
      color: "bg-blue-500",
      content: [
        "You must provide accurate and complete registration information",
        "You are responsible for maintaining account security",
        "One person or entity per account",
        "Account termination policies and procedures"
      ]
    },
    {
      icon: Home,
      title: "Property Listings",
      description: "Guidelines for landlords posting property listings",
      color: "bg-green-500",
      content: [
        "All listings must be accurate and up-to-date",
        "Property photos must be recent and genuine",
        "Pricing must be clearly stated with no hidden fees",
        "Properties must be legally available for rent"
      ]
    },
    {
      icon: CreditCard,
      title: "Payments & Fees",
      description: "Information about platform fees and payment processing",
      color: "bg-purple-500",
      content: [
        "Service fees and payment processing charges",
        "Refund and cancellation policies",
        "Security deposit handling procedures",
        "Featured listing upgrade pricing"
      ]
    },
    {
      icon: Shield,
      title: "Platform Rules",
      description: "Community guidelines and prohibited activities",
      color: "bg-red-500",
      content: [
        "No fraudulent or misleading information",
        "Respectful communication is required",
        "No discrimination based on protected characteristics",
        "Prohibited activities and consequences"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 via-blue-600 to-indigo-600 text-white py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <FileText className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              Terms and Conditions
            </h1>
            <p className="text-lg sm:text-xl text-green-100 mb-8 sm:mb-10 max-w-3xl mx-auto">
              Please read these terms carefully before using RentNova. By using our platform, you agree to these terms.
            </p>
            <div className="text-sm sm:text-base text-green-200">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Key Terms Overview */}
        <div className="mb-16 sm:mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Key Terms Overview
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Here are the main areas covered by our terms and conditions
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {termsSections.map((section, index) => {
              const IconComponent = section.icon
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                  <CardHeader className={`${section.color} text-white p-6`}>
                    <div className="flex items-center space-x-4">
                      <IconComponent className="h-8 w-8 group-hover:scale-110 transition-transform" />
                      <div>
                        <CardTitle className="text-xl sm:text-2xl">{section.title}</CardTitle>
                        <p className="text-sm sm:text-base opacity-90 mt-2">{section.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ul className="space-y-3">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm sm:text-base text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Acceptance of Terms */}
          <div className="mb-12 sm:mb-16">
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 sm:p-8">
                <CardTitle className="text-2xl sm:text-3xl flex items-center">
                  <Scale className="h-8 w-8 mr-4" />
                  Acceptance of Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 sm:p-8">
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                  By accessing and using RentNova, you accept and agree to be bound by the terms and provisions of this agreement. 
                  If you do not agree to abide by the above, please do not use this service.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Important:</strong> These terms constitute a legally binding agreement between you and RentNova. 
                    Please read them carefully and contact us if you have any questions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Platform Usage */}
          <div className="mb-12 sm:mb-16">
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 sm:p-8">
                <CardTitle className="text-2xl sm:text-3xl">Platform Usage</CardTitle>
                <p className="text-green-100 mt-2">Guidelines for using RentNova responsibly and legally.</p>
              </CardHeader>
              <CardContent className="p-6 sm:p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Permitted Uses</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        "Search for rental properties",
                        "List properties for rent (landlords)",
                        "Submit rental applications",
                        "Communicate with other users",
                        "Access customer support",
                        "Use our verification services"
                      ].map((use, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm sm:text-base text-gray-700">{use}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Prohibited Activities</h3>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          "Posting false or misleading information",
                          "Attempting to bypass security measures",
                          "Harassing or discriminating against users",
                          "Using the platform for illegal activities",
                          "Sharing another user's personal information",
                          "Creating multiple accounts to manipulate the system"
                        ].map((prohibition, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                            <span className="text-sm text-red-700">{prohibition}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Liability and Disclaimers */}
          <div className="mb-12 sm:mb-16">
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 sm:p-8">
                <CardTitle className="text-2xl sm:text-3xl">Liability and Disclaimers</CardTitle>
                <p className="text-orange-100 mt-2">Important information about platform limitations and user responsibilities.</p>
              </CardHeader>
              <CardContent className="p-6 sm:p-8">
                <div className="space-y-4">
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Platform Role</h4>
                    <p className="text-sm text-gray-700">
                      RentNova is a platform that connects tenants and landlords. We do not own, manage, or control any properties listed on our platform.
                    </p>
                  </div>
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">User Responsibility</h4>
                    <p className="text-sm text-gray-700">
                      Users are responsible for verifying information, conducting due diligence, and ensuring all transactions comply with local laws.
                    </p>
                  </div>
                  <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Limitation of Liability</h4>
                    <p className="text-sm text-gray-700">
                      RentNova's liability is limited to the fees paid for our services. We are not liable for disputes between users or property-related issues.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact for Terms */}
        <div className="bg-gradient-to-r from-green-600 to-blue-700 text-white rounded-2xl p-6 sm:p-8 lg:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Questions About These Terms?
          </h2>
          <p className="text-base sm:text-lg text-green-100 mb-8 max-w-2xl mx-auto">
            If you have questions about these terms or need clarification on any point, please contact our legal team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 font-semibold">
              <Mail className="mr-2 h-5 w-5" />
              legal@rentnova.com
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Phone className="mr-2 h-5 w-5" />
              (234) 800-LEGAL
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}