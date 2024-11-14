"use client"

// Previous imports remain...
import { getMessaging, getToken } from "firebase/messaging"

export function useSessions() {
  // Previous state and hooks remain...

  const sendMessageToAttendees = async (sessionId: string, message: string) => {
    if (!user?.id) {
      toast.error('You must be logged in to send messages')
      return
    }

    try {
      const sessionRef = doc(db, 'sessions', sessionId)
      const sessionSnap = await getDoc(sessionRef)
      
      if (!sessionSnap.exists()) {
        toast.error("Session not found")
        return
      }

      const sessionData = sessionSnap.data()
      const timestamp = Timestamp.fromDate(new Date())

      // Get FCM tokens for all attendees
      const attendeeIds = [sessionData.parentId, sessionData.specialistId]
        .filter(id => id && id !== user.id) // Remove sender and null values

      // Create notifications for each attendee
      const batch = writeBatch(db)
      
      for (const attendeeId of attendeeIds) {
        const notificationRef = doc(collection(db, 'notifications'))
        batch.set(notificationRef, {
          userId: attendeeId,
          type: 'session_message',
          title: 'New Session Message',
          message: `${user.name}: ${message}`,
          read: false,
          createdAt: timestamp,
          actionUrl: sessionData.specialistId === user.id 
            ? '/specialist/dashboard/calendar'
            : '/dashboard/sessions',
          metadata: {
            sessionId,
            senderId: user.id,
            childId: sessionData.childId
          }
        })
      }

      // Add message to session history
      const messageRef = doc(collection(db, `sessions/${sessionId}/messages`))
      batch.set(messageRef, {
        content: message,
        senderId: user.id,
        senderName: user.name,
        senderType: user.userType,
        createdAt: timestamp
      })

      await batch.commit()

      // Send FCM notification if available
      try {
        const messaging = getMessaging(app)
        const fcmToken = await getToken(messaging)
        
        if (fcmToken) {
          // Call your backend API to send FCM notification
          // This requires a server component as FCM admin SDK can't be used in client
          await fetch('/api/notifications/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId,
              message,
              senderName: user.name,
              attendeeIds
            })
          })
        }
      } catch (error) {
        console.error("FCM error:", error)
        // Don't throw - FCM is optional, in-app notifications still work
      }

      toast.success('Message sent successfully')
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error('Failed to send message')
      throw error
    }
  }

  return {
    sessions: sessions.sort((a, b) => b.date.getTime() - a.date.getTime()),
    loading,
    addSession,
    updateSession,
    cancelSession,
    deleteSession,
    respondToInvitation,
    sendMessageToAttendees
  }
}