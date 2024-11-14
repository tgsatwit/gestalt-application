"use client"

import { useState, useEffect } from 'react'
import { collection, query, where, onSnapshot, doc, updateDoc, arrayUnion, arrayRemove, Timestamp, writeBatch, getDoc, addDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Child, ConnectionRequest } from '@/lib/types'
import { useAuth } from './use-auth'
import { toast } from 'sonner'

export function useClients() {
  const [clients, setClients] = useState<Child[]>([])
  const [pendingRequests, setPendingRequests] = useState<ConnectionRequest[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user?.id || !user?.email || user.userType !== 'specialist') {
      setClients([])
      setPendingRequests([])
      setLoading(false)
      return
    }

    // Query for active clients
    const clientsQuery = query(
      collection(db, 'children'),
      where('specialistIds', 'array-contains', user.id)
    )

    // Query for pending requests
    const pendingQuery = query(
      collection(db, 'connectionRequests'),
      where('recipientEmail', '==', user.email.toLowerCase()),
      where('type', '==', 'specialist'),
      where('status', '==', 'pending')
    )
    
    const unsubscribeClients = onSnapshot(clientsQuery, (snapshot) => {
      const clientData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        dateOfBirth: doc.data().dateOfBirth.toDate()
      } as Child))
      setClients(clientData)
      setLoading(false)
    }, (error) => {
      console.error("Error fetching clients:", error)
      toast.error("Failed to load clients")
      setLoading(false)
    })

    const unsubscribePending = onSnapshot(pendingQuery, (snapshot) => {
      const pendingData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      } as ConnectionRequest))
      setPendingRequests(pendingData)
    }, (error) => {
      console.error("Error fetching pending requests:", error)
      toast.error("Failed to load pending requests")
    })

    return () => {
      unsubscribeClients()
      unsubscribePending()
    }
  }, [user?.id, user?.email, user?.userType])

  const handleRequest = async (requestId: string, status: 'accepted' | 'rejected') => {
    if (!user?.id || !user?.email) {
      toast.error('You must be logged in to handle requests')
      return
    }

    const batch = writeBatch(db)

    try {
      // Get request data
      const requestRef = doc(db, 'connectionRequests', requestId)
      const requestSnap = await getDoc(requestRef)
      
      if (!requestSnap.exists()) {
        throw new Error('Request not found')
      }

      const request = requestSnap.data() as ConnectionRequest
      const timestamp = Timestamp.fromDate(new Date())

      // Update request status
      batch.update(requestRef, {
        status,
        recipientId: user.id,
        recipientName: user.name,
        updatedAt: timestamp
      })

      // Update child document
      const childRef = doc(db, 'children', request.childId)
      if (status === 'accepted') {
        batch.update(childRef, {
          specialistIds: arrayUnion(user.id),
          pendingSpecialists: arrayRemove({
            email: user.email.toLowerCase(),
            status: 'pending'
          }),
          updatedAt: timestamp
        })
      } else {
        batch.update(childRef, {
          pendingSpecialists: arrayRemove({
            email: user.email.toLowerCase(),
            status: 'pending'
          }),
          updatedAt: timestamp
        })
      }

      // Add to connection history
      const historyRef = doc(collection(db, 'connectionHistory'))
      batch.set(historyRef, {
        type: 'specialist',
        action: status,
        childId: request.childId,
        childName: request.childName,
        parentId: request.senderId,
        parentName: request.senderName,
        connectedUserId: user.id,
        connectedUserEmail: user.email,
        connectedUserName: user.name,
        createdAt: timestamp
      })

      // Create notification for parent
      const notificationRef = doc(collection(db, 'notifications'))
      batch.set(notificationRef, {
        userId: request.senderId,
        type: `connection_${status}`,
        title: `Connection Request ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        message: `${user.name} has ${status} your connection request for ${request.childName}`,
        read: false,
        createdAt: timestamp,
        metadata: {
          requestId,
          childId: request.childId,
          recipientId: user.id
        }
      })

      await batch.commit()
      toast.success(`Request ${status} successfully`)
    } catch (error) {
      console.error("Error handling request:", error)
      toast.error('Failed to handle request')
    }
  }

  const unlinkFromChild = async (childId: string) => {
    if (!user?.id) {
      toast.error('You must be logged in to unlink from a child')
      return
    }

    const batch = writeBatch(db)

    try {
      const childRef = doc(db, 'children', childId)
      const childSnap = await getDoc(childRef)

      if (!childSnap.exists()) {
        throw new Error('Child not found')
      }

      const childData = childSnap.data()
      const timestamp = Timestamp.fromDate(new Date())

      // Update child document
      batch.update(childRef, {
        specialistIds: arrayRemove(user.id),
        updatedAt: timestamp
      })

      // Add to connection history
      const historyRef = doc(collection(db, 'connectionHistory'))
      batch.set(historyRef, {
        type: 'specialist',
        action: 'unlinked',
        childId,
        childName: childData.name,
        parentId: childData.primaryParentId,
        parentName: childData.primaryParentName || '',
        connectedUserId: user.id,
        connectedUserEmail: user.email,
        connectedUserName: user.name,
        createdAt: timestamp
      })

      await batch.commit()
      toast.success('Successfully unlinked from child')
    } catch (error) {
      console.error("Error unlinking from child:", error)
      toast.error('Failed to unlink from child')
    }
  }

  return {
    clients: clients.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    pendingRequests: pendingRequests.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    loading,
    handleRequest,
    unlinkFromChild
  }
}