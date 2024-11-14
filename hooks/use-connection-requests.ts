"use client"

import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  writeBatch,
  addDoc,
  Timestamp,
  getDocs,
  arrayUnion,
  or
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './use-auth';
import { toast } from 'sonner';
import { ConnectionRequest } from '@/lib/types';

export function useConnectionRequests() {
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id || !user?.email) {
      setRequests([]);
      setLoading(false);
      return;
    }

    try {
      // Query requests where user is either sender or recipient
      const q = query(
        collection(db, 'connectionRequests'),
        or(
          where('recipientEmail', '==', user.email.toLowerCase()),
          where('senderId', '==', user.id)
        ),
        where('status', '==', 'pending')
      );

      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          const requestsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate(),
            updatedAt: doc.data().updatedAt?.toDate()
          })) as ConnectionRequest[];
          
          setRequests(requestsData);
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching requests:", error);
          toast.error("Failed to load connection requests");
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error("Error setting up connection requests listener:", error);
      setLoading(false);
    }
  }, [user?.id, user?.email]);

  const sendInvitation = async (
    childId: string,
    childName: string,
    recipientEmail: string,
    recipientName: string,
    type: 'specialist' | 'parent'
  ) => {
    if (!user?.id) {
      toast.error('You must be logged in to send invitations');
      return null;
    }

    const batch = writeBatch(db);
    
    try {
      // Check if recipient already has an account
      const usersQuery = query(
        collection(db, 'users'),
        where('email', '==', recipientEmail.toLowerCase()),
        where('userType', '==', type)
      );
      const userSnapshot = await getDocs(usersQuery);
      const recipientExists = !userSnapshot.empty;
      const recipientId = recipientExists ? userSnapshot.docs[0].id : null;

      // Check for existing pending request
      const existingRequestQuery = query(
        collection(db, 'connectionRequests'),
        where('childId', '==', childId),
        where('recipientEmail', '==', recipientEmail.toLowerCase()),
        where('status', '==', 'pending')
      );
      const existingRequestSnapshot = await getDocs(existingRequestQuery);
      
      if (!existingRequestSnapshot.empty) {
        toast.error('An invitation is already pending for this email');
        return null;
      }

      const timestamp = Timestamp.fromDate(new Date());

      // Create connection request
      const requestRef = doc(collection(db, 'connectionRequests'));
      batch.set(requestRef, {
        type,
        childId,
        childName,
        senderId: user.id,
        senderName: user.name,
        recipientEmail: recipientEmail.toLowerCase(),
        recipientName,
        recipientId,
        status: 'pending',
        createdAt: timestamp,
        updatedAt: timestamp
      });

      // Update child document with pending connection
      const childRef = doc(db, 'children', childId);
      const pendingData = {
        email: recipientEmail.toLowerCase(),
        name: recipientName,
        status: 'pending',
        requestId: requestRef.id,
        invitedAt: timestamp
      };

      batch.update(childRef, {
        [`pending${type === 'specialist' ? 'Specialists' : 'Parents'}`]: arrayUnion(pendingData),
        updatedAt: timestamp
      });

      // Create notification for recipient if they exist
      if (recipientExists && recipientId) {
        const notificationRef = doc(collection(db, 'notifications'));
        batch.set(notificationRef, {
          userId: recipientId,
          type: 'connection_request',
          title: 'New Connection Request',
          message: `${user.name} has invited you to connect with ${childName}`,
          read: false,
          createdAt: timestamp,
          metadata: {
            requestId: requestRef.id,
            childId,
            senderId: user.id
          }
        });
      }

      await batch.commit();

      toast.success(recipientExists 
        ? `Invitation sent to ${type}'s dashboard` 
        : `Invitation email will be sent to ${recipientEmail}`
      );

      return {
        success: true,
        recipientExists,
        requestId: requestRef.id
      };
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast.error('Failed to send invitation');
      return null;
    }
  };

  const handleRequest = async (requestId: string, status: 'accepted' | 'rejected') => {
    if (!user?.id) {
      toast.error('You must be logged in to handle requests');
      return;
    }

    const batch = writeBatch(db);

    try {
      const request = requests.find(r => r.id === requestId);
      if (!request) {
        throw new Error('Request not found');
      }

      const timestamp = Timestamp.fromDate(new Date());
      const requestRef = doc(db, 'connectionRequests', requestId);
      const childRef = doc(db, 'children', request.childId);

      // Update request status
      batch.update(requestRef, {
        status,
        recipientId: user.id,
        recipientName: user.name,
        updatedAt: timestamp
      });

      // Update child document if accepted
      if (status === 'accepted') {
        batch.update(childRef, {
          [`${request.type === 'specialist' ? 'specialistIds' : 'parentIds'}`]: arrayUnion(user.id),
          updatedAt: timestamp
        });
      }

      // Create notification for sender
      const notificationRef = doc(collection(db, 'notifications'));
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
      });

      await batch.commit();
      toast.success(`Request ${status} successfully`);
    } catch (error) {
      console.error("Error handling request:", error);
      toast.error('Failed to handle request');
    }
  };

  return {
    requests: requests.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    loading,
    sendInvitation,
    handleRequest
  };
}