'use client'

import { useAuth } from '@/contexts/auth-context'

export default function DebugUser() {
  const { user, firebaseUser } = useAuth()
  
  if (process.env.NODE_ENV === 'production') {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black bg-opacity-80 text-white p-2 rounded text-xs max-w-xs z-50">
      <div><strong>Auth Debug:</strong></div>
      <div>User: {user ? 'Yes' : 'No'}</div>
      <div>ID: {user?.id || 'None'}</div>
      <div>Email: {user?.email || 'None'}</div>
      <div>Firebase User: {firebaseUser ? 'Yes' : 'No'}</div>
    </div>
  )
}