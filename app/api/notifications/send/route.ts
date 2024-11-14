import { NextResponse } from "next/server"
import admin from "firebase-admin"
import { getMessaging } from "firebase-admin/messaging"

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  })
}

export async function POST(request: Request) {
  try {
    const { sessionId, message, senderName, attendeeIds } = await request.json()

    // Get FCM tokens for attendees
    const tokens: string[] = []
    const usersRef = admin.firestore().collection("users")
    
    for (const userId of attendeeIds) {
      const userDoc = await usersRef.doc(userId).get()
      const fcmToken = userDoc.data()?.fcmToken
      if (fcmToken) tokens.push(fcmToken)
    }

    if (tokens.length === 0) {
      return NextResponse.json({ success: false, message: "No FCM tokens found" })
    }

    // Send notification to all tokens
    const messaging = getMessaging()
    await messaging.sendMulticast({
      tokens,
      notification: {
        title: "New Session Message",
        body: `${senderName}: ${message}`,
      },
      data: {
        sessionId,
        type: "session_message",
        click_action: "OPEN_SESSION",
      },
      webpush: {
        fcmOptions: {
          link: `/dashboard/sessions?session=${sessionId}`,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending notification:", error)
    return NextResponse.json(
      { success: false, error: "Failed to send notification" },
      { status: 500 }
    )
  }
}