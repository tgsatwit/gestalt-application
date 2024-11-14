"use client"

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, updateDoc, doc, arrayUnion, arrayRemove, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './use-auth';
import { toast } from 'sonner';
import { CaregiverRequest } from '@/lib/types';

export function useCaregiverRequests() {
  const [requests, setRequests] = useState<CaregiverRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id || !user?.email || user.userType !== 'parent') {
      setRequests([]);
      setLoading(false);
      return;
    }

    const requestsRef = collection(db, 'caregiverRequests');
    const q = query(
      requestsRef,
      where('caregiverEmail', '==', user.email.toLowerCase()),
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
          })) as CaregiverRequest[];
          
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
      const requestRef = doc(db, 'caregiverRequests', requestId);
      const request = requests.find(r => r.id === requestId);
      
      if (!request) {
        throw new Error('Request not found');
      }

      // First update the request status
      await updateDoc(requestRef, {
        status,
        updatedAt: new Date()
      });

      // Then update the child document
      const childRef = doc(db, 'children', request.childId);
      if (status === 'accepted') {
        await updateDoc(childRef, {
          parentIds: arrayUnion(user.id),
          pendingCaregivers: arrayRemove({
            email: user.email.toLowerCase(),
            status: 'pending'
          })
        });
        toast.success('Request accepted successfully');
      } else {
        await updateDoc(childRef, {
          pendingCaregivers: arrayRemove({
            email: user.email.toLowerCase(),
            status: 'pending'
          })
        });
        toast.success('Request rejected');
      }
    } catch (error) {
      console.error("Error handling request:", error);
      toast.error('Failed to handle request');
      throw error;
    }
  };

  return {
    requests: requests.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    loading,
    handleRequest
  };
}