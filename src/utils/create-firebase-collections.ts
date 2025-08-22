import { db } from '@/lib/firebase'
import { collection, doc, setDoc } from 'firebase/firestore'

// Function to create Firebase collections if they don't exist
export const createFirebaseCollections = async () => {
  try {
    // Create user_favorites collection with a sample document
    const favoritesRef = doc(collection(db, 'user_favorites'), 'init')
    await setDoc(favoritesRef, {
      userId: 'init',
      properties: [],
      createdAt: new Date(),
      updatedAt: new Date()
    })

    console.log('Firebase collections initialized successfully')
  } catch (error) {
    console.error('Error creating Firebase collections:', error)
  }
}

// Call this function to initialize collections
if (typeof window !== 'undefined') {
  createFirebaseCollections()
}