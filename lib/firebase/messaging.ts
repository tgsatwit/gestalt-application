"use client"

import { getMessaging, getToken, onMessage } from "firebase/messaging"
import { app } from "@/lib/firebase"
import { toast } from "sonner"

const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY

export async function initializeMessaging() {
  try {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications")
      return null
    }

    let permission = Notification.permission
    if (permission !== "granted") {
      permission = await Notification.requestPermission()
    }

    if (permission !== "granted") {
      console.log("Notification permission not granted")
      return null
    }

    const messaging = getMessaging(app)
    const token = await getToken(messaging, { vapidKey })

    // Listen for messages when app is in foreground
    onMessage(messaging, (payload) => {
      console.log("Received foreground message:", payload)
      toast.info(payload.notification?.title || "New Message", {
        description: payload.notification?.body,
      })
    })

    return token
  } catch (error) {
    console.error("Error initializing messaging:", error)
    return null
  }
}