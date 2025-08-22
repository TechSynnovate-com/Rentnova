import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, MessageCircle, Phone, Mail, Book, HelpCircle, Users, Shield, FileText, Zap } from 'lucide-react'
import Link from 'next/link'

export default function HelpPage() {
  const helpCategories = [
    {
      icon: Users,
      title: "Getting Started",
      description: "Learn the basics of using RentNova",
      color: "bg-blue-500",
      articles: [
        "How to create your account",
        "Setting up your profile",
        "Verifying your identity",
        "Understanding our platform"
      ]
    },
    {
      icon: Search,
      title: "Finding Properties",
      description: "Search and discover your perfect rental",
      color: "bg-green-500",
      articles: [
        "Advanced search filters",
        "Understanding property listings",
        "Saving favorite properties",
        "Setting up property alerts"
      ]
    },
    {
      icon: FileText,
      title: "Applications & Documents",
      description: "Apply for properties and manage documents",
      color: "bg-purple-500",
      articles: [
        "Submitting rental applications",
        "Required documents checklist",
        "Application status tracking",
        "Document verification process"
      ]
    },
    {
      icon: Shield,
      title: "Safety & Security",
      description: "Stay safe while renting",
      color: "bg-red-500",
      articles: [
        "Avoiding rental scams",
        "Verifying landlord credentials",
        "Safe viewing practices",
        "Reporting suspicious activity"
      ]
    },
    {
      icon: MessageCircle,
      title: "Communication",
      description: "Connect with landlords and support",
      color: "bg-yellow-500",
      articles: [
        "Messaging system guide",
        "Contacting property owners",
        "Scheduling property viewings",
        "Getting help from support"
      ]
    },
    {
      icon: Zap,
      title: "Premium Features",
      description: "Make the most of RentNova Pro",
      color: "bg-indigo-500",
      articles: [
        "Featured property listings",
        "Priority customer support",
        "Advanced analytics dashboard",
        "Bulk property management"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              How can we help you?
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-8 sm:mb-10 max-w-3xl mx-auto">
              Find answers to your questions, learn how to use RentNova, and get the support you need
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search for help articles, guides, and FAQs..."
                className="pl-12 h-12 sm:h-14 text-base sm:text-lg bg-white/90 backdrop-blur-sm border-0 shadow-lg"
              />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 h-8 sm:h-10">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <CardContent className="p-6 sm:p-8 text-center">
              <MessageCircle className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Live Chat</h3>
              <p className="text-green-100 text-sm sm:text-base mb-4">Get instant help from our support team</p>
              <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                Start Chat
              </Button>
            </CardContent>
          </Card>
          
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
            <CardContent className="p-6 sm:p-8 text-center">
              <Phone className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Call Support</h3>
              <p className="text-blue-100 text-sm sm:text-base mb-4">Speak directly with our experts</p>
              <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                Call Now
              </Button>
            </CardContent>
          </Card>
          
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-purple-500 to-pink-600 text-white">
            <CardContent className="p-6 sm:p-8 text-center">
              <Mail className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Email Us</h3>
              <p className="text-purple-100 text-sm sm:text-base mb-4">Send us a detailed message</p>
              <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                Send Email
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Help Categories */}
        <div className="mb-12 sm:mb-16">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Browse Help Topics
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Find detailed guides and answers organized by category
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {helpCategories.map((category, index) => {
              const IconComponent = category.icon
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                  <CardHeader className={`${category.color} text-white p-6`}>
                    <div className="flex items-center space-x-3">
                      <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 group-hover:scale-110 transition-transform" />
                      <CardTitle className="text-lg sm:text-xl">{category.title}</CardTitle>
                    </div>
                    <p className="text-sm sm:text-base opacity-90 mt-2">{category.description}</p>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ul className="space-y-3">
                      {category.articles.map((article, articleIndex) => (
                        <li key={articleIndex}>
                          <Link href="#" className="flex items-center text-gray-700 hover:text-blue-600 transition-colors text-sm sm:text-base">
                            <HelpCircle className="h-4 w-4 mr-3 text-gray-400" />
                            {article}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" className="w-full mt-6 group-hover:bg-blue-50">
                      View All Articles
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Popular Articles */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 sm:p-8 lg:p-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Popular Help Articles
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Most searched and helpful articles from our community
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {[
              { title: "How to verify my identity for rental applications", views: "15.2k", badge: "Getting Started" },
              { title: "Understanding rental application fees and deposits", views: "12.8k", badge: "Payments" },
              { title: "What to do if a property listing seems suspicious", views: "11.5k", badge: "Safety" },
              { title: "How to schedule and prepare for property viewings", views: "9.3k", badge: "Viewing" },
              { title: "Communicating effectively with landlords", views: "8.7k", badge: "Communication" },
              { title: "Setting up automatic rent payment reminders", views: "7.9k", badge: "Payments" }
            ].map((article, index) => (
              <Link key={index} href="#" className="block">
                <Card className="hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-300">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex justify-between items-start mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {article.badge}
                      </Badge>
                      <span className="text-xs text-gray-500">{article.views} views</span>
                    </div>
                    <h3 className="text-sm sm:text-base font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}