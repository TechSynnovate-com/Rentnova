import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Cookie, Settings, Shield, BarChart, Target, CheckCircle, X, Info } from 'lucide-react'

export default function CookiesPage() {
  const cookieTypes = [
    {
      icon: Shield,
      title: "Essential Cookies",
      description: "Required for basic website functionality",
      color: "bg-green-500",
      required: true,
      details: [
        "Authentication and login status",
        "Shopping cart and session data",
        "Security and fraud prevention",
        "Basic website functionality"
      ]
    },
    {
      icon: BarChart,
      title: "Analytics Cookies",
      description: "Help us understand how you use our website",
      color: "bg-blue-500",
      required: false,
      details: [
        "Page views and user behavior",
        "Website performance metrics",
        "Error tracking and debugging",
        "User journey analysis"
      ]
    },
    {
      icon: Target,
      title: "Marketing Cookies",
      description: "Used to show you relevant advertisements",
      color: "bg-purple-500",
      required: false,
      details: [
        "Personalized advertisements",
        "Social media integration",
        "Third-party marketing tools",
        "Campaign effectiveness tracking"
      ]
    },
    {
      icon: Settings,
      title: "Functional Cookies",
      description: "Remember your preferences and settings",
      color: "bg-orange-500",
      required: false,
      details: [
        "Language and region preferences",
        "Theme and display settings",
        "Form data and user choices",
        "Accessibility preferences"
      ]
    }
  ]

  const cookieManagement = [
    {
      title: "Browser Settings",
      description: "Control cookies directly through your browser settings",
      steps: [
        "Open your browser settings/preferences",
        "Navigate to Privacy or Security section",
        "Find Cookies or Site Data options",
        "Choose your preferred cookie settings"
      ]
    },
    {
      title: "RentNova Preferences",
      description: "Manage cookie preferences specific to our website",
      steps: [
        "Click the cookie banner when visiting our site",
        "Select 'Manage Preferences' option",
        "Toggle cookie categories on/off",
        "Save your preferences"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <Cookie className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              Cookie Policy
            </h1>
            <p className="text-lg sm:text-xl text-amber-100 mb-8 sm:mb-10 max-w-3xl mx-auto">
              Learn how RentNova uses cookies to improve your experience and protect your privacy
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 font-semibold">
                <Settings className="mr-2 h-5 w-5" />
                Manage Preferences
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Accept All Cookies
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* What Are Cookies */}
        <div className="mb-16 sm:mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What Are Cookies?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Cookies are small text files that are stored on your device when you visit our website. 
              They help us provide a better, more personalized experience by remembering your preferences 
              and helping us understand how you use our services.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl p-6 sm:p-8 lg:p-12">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-500 p-3 rounded-full flex-shrink-0">
                <Info className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                  Why We Use Cookies
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-gray-700">Improve website performance and speed</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-gray-700">Remember your login status and preferences</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-gray-700">Personalize content and recommendations</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-gray-700">Analyze website usage and improve our services</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cookie Types */}
        <div className="mb-16 sm:mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Types of Cookies We Use
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              We use different types of cookies to provide and improve our services
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {cookieTypes.map((cookie, index) => {
              const IconComponent = cookie.icon
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                  <CardHeader className={`${cookie.color} text-white p-6`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <IconComponent className="h-8 w-8 group-hover:scale-110 transition-transform" />
                        <div>
                          <CardTitle className="text-xl sm:text-2xl">{cookie.title}</CardTitle>
                          <p className="text-sm sm:text-base opacity-90 mt-2">{cookie.description}</p>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {cookie.required ? (
                          <Badge className="bg-white/20 text-white border-white/30">
                            Required
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                            Optional
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ul className="space-y-3">
                      {cookie.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm sm:text-base text-gray-700">{detail}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 flex justify-between items-center">
                      <Button variant="outline" size="sm">
                        Learn More
                      </Button>
                      {!cookie.required && (
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                            <X className="h-4 w-4 mr-1" />
                            Disable
                          </Button>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Enable
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Cookie Management */}
        <div className="mb-16 sm:mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Managing Your Cookie Preferences
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              You have full control over which cookies you accept
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {cookieManagement.map((method, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 p-6">
                  <CardTitle className="text-xl sm:text-2xl text-gray-900">{method.title}</CardTitle>
                  <p className="text-sm sm:text-base text-gray-600 mt-2">{method.description}</p>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {method.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-start space-x-4">
                        <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {stepIndex + 1}
                        </div>
                        <span className="text-sm sm:text-base text-gray-700 pt-1">{step}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Updates & Contact */}
        <div className="bg-gradient-to-r from-orange-600 to-red-700 text-white rounded-2xl p-6 sm:p-8 lg:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Cookie Policy Updates
          </h2>
          <p className="text-base sm:text-lg text-orange-100 mb-8 max-w-2xl mx-auto">
            We may update this cookie policy from time to time. We'll notify you of any significant changes 
            through our website or by email.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 font-semibold">
              <Settings className="mr-2 h-5 w-5" />
              Update Preferences
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Contact Us
            </Button>
          </div>
          <p className="text-sm text-orange-200 mt-6">
            Last updated: January 2024
          </p>
        </div>
      </div>
    </div>
  )
}