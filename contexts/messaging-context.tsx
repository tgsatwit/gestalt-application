"use client"

import { createContext, useContext, useEffect } from 'react'
import { initializeMessaging } from '@/lib/firebase/messaging'
import { useAuth } from '@/hooks/use-auth'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

const MessagingContext = createContext({})

export function MessagingProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    const initMessaging = async () => {
      const fcmToken = await initializeMessaging()
      if (fcmToken) {
        // Store FCM token in user document
        const userRef = doc(db, 'users', user.id)
        await updateDoc(userRef, { fcmToken })
      }
    }

    initMessaging()
  }, [user])

  return (
    <MessagingContext.Provider value={{}}>
      {children}
    </MessagingContext.Provider>
  )
}