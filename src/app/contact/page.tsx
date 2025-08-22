'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, CheckCircle, Globe, Users, Shield, Heart } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

export default function ContactPage() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    email: user?.email || '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    try {
      await addDoc(collection(db, 'support_messages'), {
        userId: user?.id || null,
        userEmail: formData.email,
        phone: formData.phone || null,
        subject: formData.subject,
        message: formData.message,
        status: 'open',
        response: null,
        isUserMessage: true,
        createdAt: new Date()
      })

      toast.success("Message sent successfully! We'll get back to you within 24 hours.")

      // Reset form for authenticated users, keep email for non-authenticated
      setFormData({
        email: user?.email || '',
        phone: '',
        subject: '',
        message: ''
      })
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error("Failed to send message. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      primary: "support@rentnova.com",
      secondary: "We'll respond within 24 hours",
      color: "bg-blue-500"
    },
    {
      icon: Phone,
      title: "Phone Support",
      primary: "+234 (0) 123 456 7890",
      secondary: "Monday to Friday, 9 AM - 6 PM",
      color: "bg-green-500"
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      primary: "Available 24/7",
      secondary: "Get instant help from our team",
      color: "bg-purple-500"
    },
    {
      icon: MapPin,
      title: "Visit Our Office",
      primary: "123 Business District, Lagos",
      secondary: "Monday to Friday, 10 AM - 5 PM",
      color: "bg-orange-500"
    }
  ]

  const quickActions = [
    {
      icon: MessageSquare,
      title: "FAQ Center",
      description: "Find answers to common questions",
      href: "/faq",
      color: "bg-blue-100 text-blue-700"
    },
    {
      icon: Shield,
      title: "Safety Guidelines",
      description: "Learn about secure rental practices",
      href: "/safety",
      color: "bg-green-100 text-green-700"
    },
    {
      icon: Users,
      title: "Help Center",
      description: "Browse guides and tutorials",
      href: "/help",
      color: "bg-purple-100 text-purple-700"
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
                <MessageSquare className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              Get in Touch
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-8 sm:mb-10 max-w-3xl mx-auto">
              Have questions about RentNova? We're here to help! Our support team is ready to assist you 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center space-x-2 text-blue-200">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm sm:text-base">24/7 Support</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-200">
                <Globe className="h-5 w-5" />
                <span className="text-sm sm:text-base">Multiple Languages</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-200">
                <Heart className="h-5 w-5" />
                <span className="text-sm sm:text-base">Expert Team</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Contact Methods */}
        <div className="mb-16 sm:mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Multiple Ways to Reach Us
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Choose the contact method that works best for you
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon
              return (
                <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg group">
                  <CardContent className="p-6">
                    <div className={`${method.color} text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{method.title}</h3>
                    <p className="text-sm sm:text-base font-medium text-gray-800 mb-1">{method.primary}</p>
                    <p className="text-xs sm:text-sm text-gray-500">{method.secondary}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Form */}
          <div>
            <Card className="border-0 shadow-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 sm:p-8">
                <CardTitle className="text-2xl sm:text-3xl">Send us a Message</CardTitle>
                <p className="text-blue-100 mt-2">Fill out the form below and we'll get back to you as soon as possible.</p>
              </CardHeader>
              <CardContent className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="+234 123 456 7890"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
                      Subject *
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                      placeholder="What can we help you with?"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="mt-1"
                      placeholder="Please describe your question or concern in detail..."
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 text-base sm:text-lg"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Info */}
          <div className="space-y-8">
            {/* Quick Help Actions */}
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6">
                <CardTitle className="text-xl sm:text-2xl">Quick Help</CardTitle>
                <p className="text-green-100 mt-2">Find answers instantly without waiting</p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {quickActions.map((action, index) => {
                    const IconComponent = action.icon
                    return (
                      <Link key={index} href={action.href} className="block">
                        <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                          <div className={`${action.color} w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <IconComponent className="h-6 w-6" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {action.title}
                            </h4>
                            <p className="text-sm text-gray-600">{action.description}</p>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6">
                <CardTitle className="text-xl sm:text-2xl flex items-center">
                  <Clock className="mr-3 h-6 w-6" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">Monday - Friday</span>
                    <span className="text-gray-600">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">Saturday</span>
                    <span className="text-gray-600">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium text-gray-700">Sunday</span>
                    <span className="text-red-600 font-medium">Closed</span>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Our online support and live chat are available 24/7 for urgent matters.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Location & Additional Info */}
        <div className="mt-16 sm:mt-20">
          <Card className="border-0 shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 sm:p-8">
              <CardTitle className="text-2xl sm:text-3xl flex items-center">
                <MapPin className="mr-4 h-8 w-8" />
                Visit Our Office
              </CardTitle>
              <p className="text-orange-100 mt-2">Come see us in person for personalized assistance</p>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Office Address</h3>
                  <div className="space-y-2 text-gray-600 mb-6">
                    <p className="text-lg">123 Business District</p>
                    <p className="text-lg">Victoria Island, Lagos</p>
                    <p className="text-lg">Nigeria</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Clock className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-sm text-gray-600">Walk-ins welcome during business hours</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-sm text-gray-600">Free parking available</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-lg p-6 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Interactive map coming soon</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}