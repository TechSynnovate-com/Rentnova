'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus, Minus, MessageCircle, HelpCircle, Users, Home, CreditCard, Shield } from 'lucide-react'
import { useState } from 'react'

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const faqCategories = [
    {
      icon: Users,
      title: "Account & Profile",
      color: "bg-blue-500",
      count: 12
    },
    {
      icon: Home,
      title: "Property Search",
      color: "bg-green-500",
      count: 8
    },
    {
      icon: CreditCard,
      title: "Payments & Billing",
      color: "bg-purple-500",
      count: 6
    },
    {
      icon: Shield,
      title: "Safety & Security",
      color: "bg-red-500",
      count: 10
    }
  ]

  const faqs = [
    {
      category: "Account & Profile",
      question: "How do I create a RentNova account?",
      answer: "Creating a RentNova account is simple! Click 'Get Started' on our homepage, choose whether you're a tenant or landlord, fill in your basic information, and verify your email address. You'll then be guided through completing your profile with additional details."
    },
    {
      category: "Account & Profile",
      question: "What documents do I need to verify my identity?",
      answer: "For identity verification, you'll need a government-issued photo ID (driver's license, passport, or national ID), proof of income (recent pay stubs or bank statements), and proof of address (utility bill or bank statement from the last 3 months)."
    },
    {
      category: "Account & Profile", 
      question: "Can I have both tenant and landlord accounts?",
      answer: "Yes! You can switch between tenant and landlord modes within the same account. Simply go to your profile settings and toggle your user type. This is perfect for people who both rent and own properties."
    },
    {
      category: "Property Search",
      question: "How does the property search work?",
      answer: "Our advanced search lets you filter by location, price range, property type, number of bedrooms, and amenities. You can also use our AI-powered recommendations to find properties that match your preferences and lifestyle."
    },
    {
      category: "Property Search",
      question: "What do the property match indicators mean?",
      answer: "Match indicators show how well a property matches your search: 'Exact Match' means perfect location match, 'High Match' means strong relevance, 'Partial Match' means some criteria met, and 'Similar' means related but not exact matches."
    },
    {
      category: "Property Search",
      question: "How do I save favorite properties?",
      answer: "Click the heart icon on any property listing to save it to your favorites. You can access all your saved properties from your dashboard under 'My Favorites' and receive notifications if their status changes."
    },
    {
      category: "Payments & Billing",
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, bank transfers, and mobile money payments. All transactions are secured with bank-level encryption to protect your financial information."
    },
    {
      category: "Payments & Billing",
      question: "Are there any fees for using RentNova?",
      answer: "Basic RentNova usage is free for tenants. Landlords can list properties for free, but premium features like featured listings cost ₦29,999 for 30 days. There are no hidden fees, and all costs are clearly displayed."
    },
    {
      category: "Payments & Billing",
      question: "How do security deposits work?",
      answer: "Security deposits are handled directly between tenants and landlords. We provide secure escrow services for deposits to protect both parties. Deposits are typically 1-2 months' rent and are refundable upon lease completion."
    },
    {
      category: "Safety & Security",
      question: "How do you verify landlords and properties?",
      answer: "We verify landlord identities through government IDs and property ownership documents. All properties undergo verification checks, and we use advanced fraud detection systems. Look for the 'Verified' badge on listings."
    },
    {
      category: "Safety & Security",
      question: "What should I do if I suspect a scam?",
      answer: "Report suspicious activity immediately through our platform or contact our security team at (234) 800-SAFE. Never send money before viewing a property, and always use our secure messaging system for communications."
    },
    {
      category: "Safety & Security",
      question: "Is my personal information safe?",
      answer: "Yes! We use enterprise-grade security measures including end-to-end encryption, secure data centers, and regular security audits. Your personal information is never shared without your explicit consent."
    }
  ]

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 text-white py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <HelpCircle className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-lg sm:text-xl text-indigo-100 mb-8 sm:mb-10 max-w-3xl mx-auto">
              Find quick answers to common questions about using RentNova
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 sm:h-14 text-base sm:text-lg bg-white/90 backdrop-blur-sm border-0 shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Category Overview */}
        <div className="mb-12 sm:mb-16">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Find answers organized by topic
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {faqCategories.map((category, index) => {
              const IconComponent = category.icon
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className={`${category.color} text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{category.title}</h3>
                    <Badge variant="secondary" className="text-sm">
                      {category.count} questions
                    </Badge>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="mb-12 sm:mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              {searchTerm ? `Search Results (${filteredFaqs.length})` : 'All Questions'}
            </h2>
            {searchTerm && (
              <p className="text-base sm:text-lg text-gray-600">
                Showing results for "{searchTerm}"
              </p>
            )}
          </div>
          
          <div className="max-w-4xl mx-auto space-y-4">
            {filteredFaqs.map((faq, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader 
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleItem(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline" className="text-xs">
                        {faq.category}
                      </Badge>
                      <CardTitle className="text-base sm:text-lg text-gray-900 flex-1">
                        {faq.question}
                      </CardTitle>
                    </div>
                    <div className="flex-shrink-0">
                      {openItems.includes(index) ? (
                        <Minus className="h-5 w-5 text-gray-500" />
                      ) : (
                        <Plus className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                {openItems.includes(index) && (
                  <CardContent className="pt-0 pb-6">
                    <div className="pl-0 sm:pl-20">
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {filteredFaqs.length === 0 && searchTerm && (
            <div className="text-center py-12">
              <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 mb-6">
                No questions match your search. Try different keywords or browse by category.
              </p>
              <Button onClick={() => setSearchTerm('')} variant="outline">
                Clear Search
              </Button>
            </div>
          )}
        </div>

        {/* Contact Support */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-6 sm:p-8 lg:p-12 text-center">
          <MessageCircle className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-6 text-blue-200" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Still Need Help?
          </h2>
          <p className="text-base sm:text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help you with any questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold">
              <MessageCircle className="mr-2 h-5 w-5" />
              Contact Support
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Browse Help Center
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}