'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { useCountry } from '@/contexts/country-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Building, 
  Heart, 
  MessageSquare,
  FileText,
  Settings,
  Bell
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
// import CountrySelector from './country-selector'

function Header() {
  const { user, signOut } = useAuth()
  const { selectedCountry } = useCountry()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const isLandlord = user?.displayName?.includes('landlord') || false // Simple check, can be enhanced
  const isTenant = user && !isLandlord

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-lavender-600 rounded-lg flex items-center justify-center">
                <Building className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">RentNova</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/properties" className="text-gray-700 hover:text-lavender-600 font-medium">
              Properties
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-lavender-600 font-medium">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-lavender-600 font-medium">
              Contact
            </Link>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center space-x-4">
            {/* <CountrySelector /> */}
            
            {user ? (
              <div className="flex items-center space-x-3">
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-red-500">
                    3
                  </Badge>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                        <AvatarFallback>
                          {user.displayName?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.displayName}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    {isLandlord && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard/landlord">
                            <Building className="mr-2 h-4 w-4" />
                            <span>Landlord Dashboard</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard/landlord/profile">
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard/landlord/properties/new">
                            <Building className="mr-2 h-4 w-4" />
                            <span>Add Property</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    
                    {isTenant && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard/tenant">
                            <User className="mr-2 h-4 w-4" />
                            <span>Tenant Dashboard</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard/tenant/rental-profile">
                            <FileText className="mr-2 h-4 w-4" />
                            <span>Rental Profile</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard/tenant/applications">
                            <FileText className="mr-2 h-4 w-4" />
                            <span>Applications</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard/tenant/favorites">
                            <Heart className="mr-2 h-4 w-4" />
                            <span>Favorites</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/messages">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        <span>Messages</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth/login">
                  <Button variant="outline">Log in</Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="bg-lavender-600 hover:bg-lavender-700">Sign up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link href="/properties" className="text-gray-700 hover:text-lavender-600 font-medium">
                Properties
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-lavender-600 font-medium">
                About
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-lavender-600 font-medium">
                Contact
              </Link>
              
              {user ? (
                <div className="pt-4 border-t space-y-2">
                  <div className="flex items-center space-x-2 mb-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                      <AvatarFallback>
                        {user.displayName?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.displayName}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  
                  {isLandlord && (
                    <>
                      <Link href="/dashboard/landlord" className="block py-2 text-gray-700">
                        Landlord Dashboard
                      </Link>
                      <Link href="/dashboard/landlord/profile" className="block py-2 text-gray-700">
                        Profile
                      </Link>
                    </>
                  )}
                  
                  {isTenant && (
                    <>
                      <Link href="/dashboard/tenant" className="block py-2 text-gray-700">
                        Tenant Dashboard
                      </Link>
                      <Link href="/dashboard/tenant/rental-profile" className="block py-2 text-gray-700">
                        Rental Profile
                      </Link>
                      <Link href="/dashboard/tenant/applications" className="block py-2 text-gray-700">
                        Applications
                      </Link>
                    </>
                  )}
                  
                  <Button onClick={handleSignOut} variant="outline" className="w-full mt-4">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 pt-4 border-t">
                  <Link href="/auth/login">
                    <Button variant="outline" className="w-full">Log in</Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button className="w-full bg-lavender-600 hover:bg-lavender-700">Sign up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
export { Header }