import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc,
  doc,
  getDocs,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { FirebaseMessage } from '@/types/firebase-schema'
import { toast } from 'react-hot-toast'

// Define chat room type
interface ChatRoom {
  id: string
  participants: string[]
  lastMessage?: string
  lastMessageTime?: Date
  propertyId?: string
  unreadCount?: number
}

// Query Keys
export const chatKeys = {
  all: ['chat'] as const,
  rooms: (userId: string) => [...chatKeys.all, 'rooms', userId] as const,
  room: (roomId: string) => [...chatKeys.all, 'room', roomId] as const,
  messages: (roomId: string) => [...chatKeys.all, 'messages', roomId] as const,
}

// Real-time chat rooms for a user
export function useChatRooms(userId: string) {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const q = query(
      collection(db, 'chatRooms'),
      where('participants', 'array-contains', userId),
      orderBy('lastUpdated', 'desc')
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const rooms = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ChatRoom[]
        
        setChatRooms(rooms)
        setLoading(false)
        setError(null)
      },
      (error) => {
        console.error('Error fetching chat rooms:', error)
        setError('Failed to load chat rooms')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [userId])

  return { chatRooms, loading, error }
}

// Real-time messages for a chat room
export function useChatMessages(roomId: string) {
  const [messages, setMessages] = useState<FirebaseMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!roomId) {
      setLoading(false)
      return
    }

    const q = query(
      collection(db, 'chatRooms', roomId, 'messages'),
      orderBy('timestamp', 'asc')
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as FirebaseMessage[]
        
        setMessages(msgs)
        setLoading(false)
        setError(null)
      },
      (error) => {
        console.error('Error fetching messages:', error)
        setError('Failed to load messages')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [roomId])

  return { messages, loading, error }
}

// Send message mutation
export function useSendMessage() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ 
      roomId, 
      senderId, 
      receiverId, 
      message 
    }: { 
      roomId: string
      senderId: string
      receiverId: string
      message: string 
    }) => {
      // Add message to subcollection
      await addDoc(collection(db, 'chatRooms', roomId, 'messages'), {
        senderid: senderId,
        receiverId,
        message,
        timestamp: serverTimestamp(),
        read: false
      })

      // Update chat room's last message
      await updateDoc(doc(db, 'chatRooms', roomId), {
        lastMessage: {
          text: message,
          senderId,
          timestamp: serverTimestamp(),
          read: false
        },
        lastUpdated: serverTimestamp()
      })

      return { roomId, message }
    },
    onSuccess: () => {
      // Messages update automatically via real-time listener
    },
    onError: (error) => {
      console.error('Error sending message:', error)
      toast.error('Failed to send message')
    },
  })
}

// Create chat room mutation
export function useCreateChatRoom() {
  return useMutation({
    mutationFn: async ({ 
      propertyId, 
      tenantId, 
      landlordId 
    }: { 
      propertyId: string
      tenantId: string
      landlordId: string 
    }) => {
      // Check if room already exists
      const existingRoomQuery = query(
        collection(db, 'chatRooms'),
        where('propertyId', '==', propertyId),
        where('tenantId', '==', tenantId),
        where('landlordId', '==', landlordId)
      )
      
      const existingRooms = await getDocs(existingRoomQuery)
      
      if (!existingRooms.empty && existingRooms.docs[0]) {
        return existingRooms.docs[0].id
      }

      // Create new room
      const roomDoc = await addDoc(collection(db, 'chatRooms'), {
        propertyId,
        tenantId,
        landlordId,
        participants: [tenantId, landlordId],
        lastMessage: {
          text: '',
          senderId: '',
          timestamp: serverTimestamp(),
          read: false
        },
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp()
      })

      return roomDoc.id
    },
    onError: (error) => {
      console.error('Error creating chat room:', error)
      toast.error('Failed to start conversation')
    },
  })
}

// Mark messages as read
export function useMarkMessagesRead() {
  return useMutation({
    mutationFn: async ({ 
      roomId, 
      userId 
    }: { 
      roomId: string
      userId: string 
    }) => {
      const messagesQuery = query(
        collection(db, 'chatRooms', roomId, 'messages'),
        where('receiverId', '==', userId),
        where('read', '==', false)
      )
      
      const unreadMessages = await getDocs(messagesQuery)
      
      const updatePromises = unreadMessages.docs.map(doc => 
        updateDoc(doc.ref, { read: true })
      )
      
      await Promise.all(updatePromises)
      
      return unreadMessages.size
    },
    onError: (error) => {
      console.error('Error marking messages as read:', error)
    },
  })
}