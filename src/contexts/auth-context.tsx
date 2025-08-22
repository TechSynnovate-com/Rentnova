'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { 
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { User } from '@/types'
import toast from 'react-hot-toast'
import { getAuthErrorMessage, logAuthError } from '@/utils/firebase-errors'

interface AuthContextType {
  user: User | null
  firebaseUser: FirebaseUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName: string, role: 'tenant' | 'landlord') => Promise<void>
  signOut: () => Promise<void>
  updateUserProfile: (updates: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setFirebaseUser(firebaseUser)
          console.log('Firebase user authenticated:', firebaseUser.uid)
          const userDoc = await getUserDocument(firebaseUser.uid)
          console.log('User document retrieved:', userDoc)
          setUser(userDoc)
        } else {
          setFirebaseUser(null)
          setUser(null)
        }
      } catch (error) {
        logAuthError(error, 'auth_state_change')
        toast.error(getAuthErrorMessage(error))
      } finally {
        setLoading(false)
      }
    })

    return unsubscribe
  }, [])

  const getUserDocument = async (uid: string): Promise<User | null> => {
    try {
      const userRef = doc(db, 'users', uid)
      const userSnap = await getDoc(userRef)
      
      if (userSnap.exists()) {
        const userData = userSnap.data()
        return {
          id: userSnap.id,
          ...userData,
          createdAt: userData.createdAt?.toDate() || new Date(),
          updatedAt: userData.updatedAt?.toDate() || new Date(),
        } as User
      }
      
      return null
    } catch (error) {
      logAuthError(error, 'get_user_document')
      return null
    }
  }

  const createUserDocument = async (firebaseUser: FirebaseUser, additionalData: any) => {
    const userRef = doc(db, 'users', firebaseUser.uid)
    const userSnap = await getDoc(userRef)
    
    if (!userSnap.exists()) {
      const { displayName, email, photoURL } = firebaseUser
      const userData = {
        id: firebaseUser.uid, // Ensure ID is always set
        email,
        displayName: displayName || additionalData.displayName,
        photoURL: photoURL || '',
        role: additionalData.role || 'tenant',
        preferences: {
          notifications: true,
          emailUpdates: true,
          theme: 'light' as const,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        ...additionalData,
      }
      
      try {
        await setDoc(userRef, userData)
        return {
          ...userData,
          id: firebaseUser.uid
        } as User
      } catch (error) {
        logAuthError(error, 'create_user_document')
        throw new Error(getAuthErrorMessage(error))
      }
    }
    
    return getUserDocument(firebaseUser.uid)
  }

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      toast.success('Welcome back!')
    } catch (error: any) {
      logAuthError(error, 'sign_in')
      const errorMessage = getAuthErrorMessage(error)
      toast.error(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const signUp = async (email: string, password: string, displayName: string, role: 'tenant' | 'landlord') => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(result.user, { displayName })
      
      const userData = await createUserDocument(result.user, { displayName, role })
      setUser(userData)
      
      toast.success('Account created successfully! Welcome to RentNova!')
    } catch (error: any) {
      logAuthError(error, 'sign_up')
      const errorMessage = getAuthErrorMessage(error)
      toast.error(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      setUser(null)
      setFirebaseUser(null)
      toast.success('Goodbye! Come back soon.')
    } catch (error: any) {
      logAuthError(error, 'sign_out')
      toast.error(getAuthErrorMessage(error))
    }
  }

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user || !firebaseUser || !user.id) {
      console.error('Cannot update profile: user not found or missing ID')
      toast.error('User not properly authenticated')
      return
    }

    try {
      const userRef = doc(db, 'users', user.id)
      const updateData = {
        ...updates,
        updatedAt: new Date(),
      }
      
      await setDoc(userRef, updateData, { merge: true })
      
      const updatedUser = { ...user, ...updateData }
      setUser(updatedUser)
      
      toast.success('Profile updated successfully!')
    } catch (error: any) {
      console.error('Update profile error:', error)
      toast.error('Failed to update profile')
      throw error
    }
  }

  const value = {
    user,
    firebaseUser,
    loading,
    signIn,
    signUp,
    signOut,
    updateUserProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}