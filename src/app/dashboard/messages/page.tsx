'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Search, Send, Paperclip, Phone, Video, MoreVertical, Star, Archive, User, Clock } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(1)
  const [newMessage, setNewMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const conversations = [
    { 
      id: 1, 
      name: 'Property Manager - Sunrise Apartments', 
      lastMessage: 'The rent payment has been received. Thank you!', 
      time: '2 hours ago', 
      unread: 2,
      avatar: 'PM',
      type: 'business'
    },
    { 
      id: 2, 
      name: 'John Landlord', 
      lastMessage: 'When would you like to schedule the inspection?', 
      time: '1 day ago', 
      unread: 0,
      avatar: 'JL',
      type: 'landlord'
    },
    { 
      id: 3, 
      name: 'RentNova Support', 
      lastMessage: 'Your verification documents have been approved!', 
      time: '3 days ago', 
      unread: 1,
      avatar: 'RS',
      type: 'support'
    },
    { 
      id: 4, 
      name: 'Sarah Agent', 
      lastMessage: 'I have some great properties that match your criteria.', 
      time: '1 week ago', 
      unread: 0,
      avatar: 'SA',
      type: 'agent'
    }
  ]

  const messages = [
    { id: 1, sender: 'Property Manager', content: 'Hello! Welcome to Sunrise Apartments. How can I help you today?', time: '10:00 AM', isOwn: false },
    { id: 2, sender: 'You', content: 'Hi! I wanted to ask about the rent payment for this month.', time: '10:05 AM', isOwn: true },
    { id: 3, sender: 'Property Manager', content: 'Of course! Your rent payment of ₦150,000 is due on the 1st of each month. Have you made the payment yet?', time: '10:07 AM', isOwn: false },
    { id: 4, sender: 'You', content: 'Yes, I transferred the amount yesterday. Could you please confirm if you received it?', time: '10:10 AM', isOwn: true },
    { id: 5, sender: 'Property Manager', content: 'Let me check our records... Yes, I can confirm that your payment has been received. Thank you for the prompt payment!', time: '2 hours ago', isOwn: false }
  ]

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      toast.success('Message sent!')
      setNewMessage('')
    }
  }

  const getConversationType = (type: string) => {
    const styles = {
      business: 'bg-blue-100 text-blue-800',
      landlord: 'bg-green-100 text-green-800',
      support: 'bg-purple-100 text-purple-800',
      agent: 'bg-orange-100 text-orange-800'
    }
    return styles[type as keyof typeof styles] || 'bg-gray-100 text-gray-800'
  }

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-6 rounded-full">
                <MessageSquare className="h-16 w-16 sm:h-20 sm:w-20 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Messages
            </h1>
            <p className="text-lg sm:text-xl text-indigo-100 mb-6">
              Stay connected with landlords, agents, and property managers
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px]">
          {/* Conversations List */}
          <Card className="lg:col-span-4 border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4">
              <CardTitle className="text-lg">Conversations</CardTitle>
              <div className="relative mt-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white text-gray-900"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto h-[480px]">
              <div className="divide-y divide-gray-200">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedConversation === conversation.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold">
                        {conversation.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">
                            {conversation.name}
                          </h4>
                          {conversation.unread > 0 && (
                            <Badge className="bg-red-500 text-white text-xs">
                              {conversation.unread}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate mb-1">
                          {conversation.lastMessage}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{conversation.time}</span>
                          <Badge className={`text-xs ${getConversationType(conversation.type)}`}>
                            {conversation.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Window */}
          <Card className="lg:col-span-8 border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold">
                    PM
                  </div>
                  <div>
                    <h3 className="font-semibold">Property Manager - Sunrise Apartments</h3>
                    <p className="text-sm text-green-100">Online</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            {/* Messages */}
            <CardContent className="p-0 flex flex-col h-[420px]">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.isOwn
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.isOwn ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Start New Chat</h3>
              <p className="text-sm text-gray-600 mb-4">Connect with landlords or agents</p>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                New Message
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Starred Messages</h3>
              <p className="text-sm text-gray-600 mb-4">Important conversations</p>
              <Button size="sm" variant="outline">
                View Starred
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="bg-green-100 text-green-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Archive className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Archived Chats</h3>
              <p className="text-sm text-gray-600 mb-4">Past conversations</p>
              <Button size="sm" variant="outline">
                View Archive
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}