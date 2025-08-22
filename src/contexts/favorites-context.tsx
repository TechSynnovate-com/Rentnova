'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './auth-context'
import { db } from '@/lib/firebase'
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { toast } from 'react-hot-toast'

interface FavoritesContextType {
  favorites: string[]
  addToFavorites: (propertyId: string) => Promise<void>
  removeFromFavorites: (propertyId: string) => Promise<void>
  isFavorite: (propertyId: string) => boolean
  loading: boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userId = user?.id
    console.log('Favorites context - user state:', user ? 'logged in' : 'not logged in', 'userId:', userId)
    
    if (!userId) {
      setFavorites([])
      setLoading(false)
      return
    }

    const loadFavorites = async () => {
      try {
        console.log('Loading favorites for user:', userId)
        const favoritesRef = doc(db, 'users', userId, 'favorites', 'userFavorites')
        const favoritesSnap = await getDoc(favoritesRef)
        
        if (favoritesSnap.exists()) {
          const data = favoritesSnap.data()
          console.log('Favorites data loaded:', data)
          setFavorites(data.properties || [])
        } else {
          // Create initial favorites document if it doesn't exist
          console.log('Creating initial favorites document for user:', userId)
          await setDoc(favoritesRef, {
            userId: userId,
            properties: [],
            createdAt: new Date(),
            updatedAt: new Date()
          })
          setFavorites([])
        }
      } catch (error) {
        console.error('Error loading favorites:', error)
        setFavorites([])
      } finally {
        setLoading(false)
      }
    }

    loadFavorites()
  }, [user])

  const addToFavorites = async (propertyId: string) => {
    const userId = user?.id
    console.log('Adding to favorites - user:', userId, 'property:', propertyId)
    
    if (!userId) {
      console.log('No user found for favorites')
      toast.error('Please login to save favorites')
      return
    }

    try {
      const favoritesRef = doc(db, 'users', userId, 'favorites', 'userFavorites')
      const favoritesSnap = await getDoc(favoritesRef)

      if (favoritesSnap.exists()) {
        await updateDoc(favoritesRef, {
          properties: arrayUnion(propertyId),
          updatedAt: new Date()
        })
      } else {
        await setDoc(favoritesRef, {
          userId: userId,
          properties: [propertyId],
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }

      setFavorites(prev => [...prev, propertyId])
      toast.success('Added to favorites')
      console.log('Successfully added to favorites')
    } catch (error) {
      console.error('Error adding to favorites:', error)
      toast.error('Failed to add to favorites')
    }
  }

  const removeFromFavorites = async (propertyId: string) => {
    const userId = user?.id
    if (!userId) return

    try {
      const favoritesRef = doc(db, 'users', userId, 'favorites', 'userFavorites')
      await updateDoc(favoritesRef, {
        properties: arrayRemove(propertyId),
        updatedAt: new Date()
      })

      setFavorites(prev => prev.filter(id => id !== propertyId))
      toast.success('Removed from favorites')
    } catch (error) {
      console.error('Error removing from favorites:', error)
      toast.error('Failed to remove from favorites')
    }
  }

  const isFavorite = (propertyId: string) => {
    return favorites.includes(propertyId)
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        loading
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}