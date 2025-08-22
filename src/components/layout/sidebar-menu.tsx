'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { 
  Home, 
  Search, 
  Info, 
  Phone, 
  User, 
  FileText, 
  MessageSquare, 
  Settings, 
  HelpCircle, 
  LogOut,
  Building,
  Menu,
  X,
  Shield,
  Heart
} from 'lucide-react'

interface SidebarMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function SidebarMenu({ isOpen, onClose }: SidebarMenuProps) {
  const { user, signOut } = useAuth()

  const topLevelPages = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/properties', label: 'Discover Properties', icon: Search },
    { href: '/contact', label: 'Contact Us', icon: Phone },
    { href: '/about', label: 'About RentNova', icon: Info },
  ]

  const userMenuItems = user ? [
    { href: `/dashboard/${user.role}`, label: 'Dashboard', icon: Home },
    { href: '/dashboard/profile', label: 'My Profile', icon: User },
    { href: `/dashboard/${user.role}/documents`, label: 'Documents', icon: FileText },
    { href: `/dashboard/${user.role}/messages`, label: 'Messages', icon: MessageSquare },
    { href: '/help', label: 'Help & Support', icon: HelpCircle },
    { href: '/settings', label: 'Settings', icon: Settings },
  ] : []

  const handleSignOut = async () => {
    try {
      await signOut()
      onClose()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <Link href="/" className="flex items-center space-x-2" onClick={onClose}>
              <Building className="h-8 w-8 text-lavender-600" />
              <span className="text-xl font-bold text-gray-900">RentNova</span>
            </Link>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-md"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Info */}
          {user && (
            <div className="p-6 border-b bg-gradient-to-r from-lavender-50 to-lavender-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-lavender-200 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-lavender-700" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{user.displayName}</h3>
                  <p className="text-sm text-gray-600 capitalize">{user.role}</p>
                  <div className="flex items-center mt-1">
                    <Shield className="h-3 w-3 text-green-600 mr-1" />
                    <span className="text-xs text-green-600">Verified</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Menu Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Top Level Pages */}
            <div className="p-4">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Main Pages
              </h4>
              <nav className="space-y-1">
                {topLevelPages.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100 hover:text-lavender-600 transition-colors"
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
            </div>

            {/* User Menu */}
            {user && (
              <div className="p-4 border-t">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Your Account
                </h4>
                <nav className="space-y-1">
                  {userMenuItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100 hover:text-lavender-600 transition-colors"
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        {item.label}
                      </Link>
                    )
                  })}
                </nav>
              </div>
            )}

            {/* Quick Actions */}
            {user && (
              <div className="p-4 border-t">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Quick Actions
                </h4>
                <div className="space-y-2">
                  {user.role === 'tenant' && (
                    <>
                      <Link href="/properties" onClick={onClose}>
                        <Button variant="outline" className="w-full justify-start" size="sm">
                          <Search className="h-4 w-4 mr-2" />
                          Find Properties
                        </Button>
                      </Link>
                      <Link href="/dashboard/tenant/applications" onClick={onClose}>
                        <Button variant="outline" className="w-full justify-start" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          My Applications
                        </Button>
                      </Link>
                    </>
                  )}
                  {user.role === 'landlord' && (
                    <>
                      <Button variant="outline" className="w-full justify-start" size="sm">
                        <Building className="h-4 w-4 mr-2" />
                        Add Property
                      </Button>
                      <Button variant="outline" className="w-full justify-start" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        View Messages
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t">
            {user ? (
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            ) : (
              <div className="space-y-2">
                <Link href="/auth/login" onClick={onClose}>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register" onClick={onClose}>
                  <Button className="w-full bg-lavender-600 hover:bg-lavender-700">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}