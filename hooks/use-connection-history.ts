"use client"

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './use-auth';
import { toast } from 'sonner';

interface ConnectionHistory {
  id: string;
  type: 'specialist' | 'caregiver';
  action: 'accepted' | 'rejected' | 'removed';
  childId: string;
  childName: string;
  parentId: string;
  parentName: string;
  connectedUserId: string;
  connectedUserEmail: string;
  connectedUserName: string;
  createdAt: Date;
}

export function useConnectionHistory(childId?: string) {
  const [history, setHistory] = useState<ConnectionHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) {
      setHistory([]);
      setLoading(false);
      return;
    }

    let q;
    if (childId) {
      // Get history for specific child
      q = query(
        collection(db, 'connectionHistory'),
        where('childId', '==', childId)
      );
    } else {
      // Get history for all children user is connected to
      q = query(
        collection(db, 'connectionHistory'),
        where(user.userType === 'parent' ? 'parentId' : 'connectedUserId', '==', user.id)
      );
    }

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        try {
          const historyData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate()
          })) as ConnectionHistory[];
          
          setHistory(historyData);
        } catch (error) {
          console.error("Error processing history:", error);
          toast.error("Failed to load connection history");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Error fetching history:", error);
        toast.error("Failed to load connection history");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.id, user?.userType, childId]);

  return {
    history: history.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    loading
  };
}