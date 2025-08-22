'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { SidebarMenu } from './sidebar-menu'
import { CountrySelector } from './country-selector'
import { useCountry } from '@/contexts/country-context'
import { Menu, X, Home, Building, User, LogOut, FileText, MessageSquare, Settings, Bell, ChevronDown, Search, Lightbulb, Phone, Info } from 'lucide-react'

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, signOut } = useAuth()
  const { setSelectedCountry } = useCountry()

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <Building className="h-8 w-8 text-lavender-600" />
              <span className="text-xl font-bold text-gray-900">RentNova</span>
            </Link>
          </div>

          {/* Country Selector and Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <CountrySelector onCountryChange={setSelectedCountry} />
            <div className="flex items-baseline space-x-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-lavender-600 px-2 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                href="/properties"
                className="text-gray-700 hover:text-lavender-600 px-2 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Properties
              </Link>
              <Link
                href="/recommendations"
                className="text-gray-700 hover:text-lavender-600 px-2 py-2 rounded-md text-sm font-medium transition-colors"
              >
                AI Recommendations
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-lavender-600 px-2 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Contact
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-lavender-600 px-2 py-2 rounded-md text-sm font-medium transition-colors"
              >
                About
              </Link>
            </div>
          </div>

          {/* Mobile/Tablet Menu Dropdown */}
          <div className="lg:hidden relative">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center space-x-2 text-gray-700 hover:text-lavender-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <Menu className="h-4 w-4" />
              <span>Menu</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            
            {/* Mobile Dropdown Menu */}
            {isMobileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1">
                  <Link
                    href="/"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Home className="h-4 w-4 mr-3" />
                    Home
                  </Link>
                  <Link
                    href="/properties"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Search className="h-4 w-4 mr-3" />
                    Properties
                  </Link>
                  <Link
                    href="/recommendations"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Lightbulb className="h-4 w-4 mr-3" />
                    AI Recommendations
                  </Link>
                  <Link
                    href="/contact"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Phone className="h-4 w-4 mr-3" />
                    Contact
                  </Link>
                  <Link
                    href="/about"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Info className="h-4 w-4 mr-3" />
                    About
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <div className="px-4 py-2">
                    <CountrySelector onCountryChange={setSelectedCountry} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Auth/User Menu */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {user ? (
              <div className="flex items-center space-x-1 lg:space-x-3">
                <Button variant="ghost" size="sm" className="relative p-2">
                  <Bell className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span className="absolute -top-1 -right-1 h-2 w-2 lg:h-3 lg:w-3 bg-red-500 rounded-full text-xs"></span>
                </Button>
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-1 lg:space-x-2 p-1 lg:p-2 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-lavender-100 rounded-full flex items-center justify-center">
                      <User className="h-3 w-3 lg:h-4 lg:w-4 text-lavender-600" />
                    </div>
                    <div className="text-left hidden lg:block">
                      <div className="text-xs lg:text-sm font-medium text-gray-900">{user.displayName}</div>
                      <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                    </div>
                    <ChevronDown className="h-3 w-3 lg:h-4 lg:w-4 text-gray-400" />
                  </button>
                  
                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                      <div className="py-1">
                        <Link
                          href="/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Home className="h-4 w-4 mr-3" />
                          Dashboard
                        </Link>

                        <Link
                          href="/dashboard/account"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="h-4 w-4 mr-3" />
                          Account
                        </Link>
                        <Link
                          href="/dashboard/documents"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FileText className="h-4 w-4 mr-3" />
                          Documents
                        </Link>
                        <Link
                          href="/dashboard/messages"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <MessageSquare className="h-4 w-4 mr-3" />
                          Messages
                        </Link>
                        <Link
                          href="/dashboard/settings"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4 mr-3" />
                          Settings
                        </Link>
                        <hr className="my-1" />
                        <button
                          onClick={() => {
                            signOut()
                            setIsUserMenuOpen(false)
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth/login">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm" className="bg-lavender-600 hover:bg-lavender-700">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>


        </div>

        {/* Sidebar Menu */}
        <SidebarMenu isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      </div>
    </nav>
  )
}