"use client"

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, writeBatch, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './use-auth';
import { toast } from 'sonner';
import { ConnectionRequest } from '@/lib/types';

export function useSpecialistRequests() {
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id || !user?.email || user.userType !== 'specialist') {
      setRequests([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'connectionRequests'),
      where('recipientEmail', '==', user.email.toLowerCase()),
      where('type', '==', 'specialist'),
      where('status', '==', 'pending')
    );

    const unsubscribe = onSnapshot(q, 
      async (querySnapshot) => {
        try {
          const requestsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate(),
            updatedAt: doc.data().updatedAt ? doc.data().updatedAt.toDate() : undefined
          })) as ConnectionRequest[];
          
          setRequests(requestsData);
        } catch (error) {
          console.error("Error processing requests:", error);
          toast.error("Failed to process requests");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Error fetching requests:", error);
        toast.error("Failed to load requests");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.id, user?.email, user?.userType]);

  const handleRequest = async (requestId: string, status: 'accepted' | 'rejected') => {
    if (!user?.id || !user?.email) {
      toast.error('You must be logged in to handle requests');
      return;
    }

    try {
      const batch = writeBatch(db);
      const requestRef = doc(db, 'connectionRequests', requestId);
      const requestSnap = await getDoc(requestRef);
      
      if (!requestSnap.exists()) {
        throw new Error('Request not found');
      }

      const request = requestSnap.data() as ConnectionRequest;
      const childRef = doc(db, 'children', request.childId);
      const childSnap = await getDoc(childRef);

      if (!childSnap.exists()) {
        throw new Error('Child not found');
      }

      // Update request status
      batch.update(requestRef, {
        status,
        recipientId: user.id,
        updatedAt: new Date()
      });

      // Update child document
      const childUpdates: any = {
        updatedAt: new Date()
      };

      if (status === 'accepted') {
        childUpdates.specialistIds = arrayUnion(user.id);
        childUpdates.pendingSpecialists = arrayUnion({
          email: user.email.toLowerCase(),
          name: user.name,
          uid: user.id,
          status: 'accepted',
          invitedAt: new Date()
        });
      } else {
        childUpdates.pendingSpecialists = arrayUnion({
          email: user.email.toLowerCase(),
          name: user.name,
          uid: user.id,
          status: 'rejected',
          invitedAt: new Date()
        });
      }

      batch.update(childRef, childUpdates);

      // Add to connection history
      const historyRef = collection(db, 'connectionHistory');
      batch.set(doc(historyRef), {
        type: 'specialist',
        action: status === 'accepted' ? 'accepted' : 'rejected',
        childId: request.childId,
        childName: request.childName,
        parentId: request.parentId,
        parentName: request.parentName,
        connectedUserId: user.id,
        connectedUserEmail: user.email,
        connectedUserName: user.name,
        createdAt: new Date()
      });

      // Commit all updates atomically
      await batch.commit();
      toast.success(status === 'accepted' ? 'Request accepted successfully' : 'Request declined');
    } catch (error) {
      console.error("Error handling request:", error);
      toast.error('Failed to handle request');
    }
  };

  return {
    requests: requests.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    loading,
    handleRequest
  };
}