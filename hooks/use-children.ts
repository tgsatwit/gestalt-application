"use client"

import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot,
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  Timestamp,
  or
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Child } from '@/lib/types';
import { toast } from 'sonner';
import { useAuth } from './use-auth';

export function useChildren() {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) {
      setChildren([]);
      setLoading(false);
      return;
    }

    try {
      const childrenRef = collection(db, 'children');
      const q = query(
        childrenRef,
        or(
          where('primaryParentId', '==', user.id),
          where('parentIds', 'array-contains', user.id),
          where('specialistIds', 'array-contains', user.id)
        )
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const childrenData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            dateOfBirth: doc.data().dateOfBirth?.toDate() || new Date(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate(),
            parentIds: doc.data().parentIds || [],
            specialistIds: doc.data().specialistIds || [],
            pendingSpecialists: doc.data().pendingSpecialists || [],
            pendingParents: doc.data().pendingParents || [],
            vanitySpecialists: doc.data().vanitySpecialists || []
          })) as Child[];

          setChildren(childrenData);
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching children:", error);
          toast.error("Failed to load children profiles");
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error("Error setting up children listener:", error);
      setLoading(false);
    }
  }, [user?.id]);

  const addChild = async (childData: Omit<Child, 'id' | 'parentIds' | 'specialistIds' | 'createdAt'>) => {
    if (!user?.id) {
      toast.error('You must be logged in to add children');
      return;
    }

    try {
      const timestamp = Timestamp.fromDate(new Date());
      const newChild = {
        ...childData,
        primaryParentId: user.id,
        parentIds: [user.id],
        specialistIds: [],
        pendingSpecialists: [],
        pendingParents: [],
        vanitySpecialists: [],
        createdAt: timestamp,
        updatedAt: timestamp,
        dateOfBirth: Timestamp.fromDate(new Date(childData.dateOfBirth))
      };
      
      await addDoc(collection(db, 'children'), newChild);
      toast.success('Child profile added successfully');
    } catch (error) {
      console.error("Error adding child:", error);
      toast.error('Failed to add child profile');
      throw error;
    }
  };

  const updateChild = async (id: string, updates: Partial<Child>) => {
    if (!user?.id) {
      toast.error('You must be logged in to update children');
      return;
    }

    try {
      const childRef = doc(db, 'children', id);
      const updateData = {
        ...updates,
        updatedAt: Timestamp.fromDate(new Date())
      };

      if (updates.dateOfBirth) {
        updateData.dateOfBirth = Timestamp.fromDate(new Date(updates.dateOfBirth));
      }

      await updateDoc(childRef, updateData);
      toast.success('Child profile updated successfully');
    } catch (error) {
      console.error("Error updating child:", error);
      toast.error('Failed to update child profile');
      throw error;
    }
  };

  const deleteChild = async (id: string) => {
    if (!user?.id) {
      toast.error('You must be logged in to delete children');
      return;
    }

    try {
      await deleteDoc(doc(db, 'children', id));
      toast.success('Child profile deleted successfully');
    } catch (error) {
      console.error("Error deleting child:", error);
      toast.error('Failed to delete child profile');
      throw error;
    }
  };

  return {
    children: children.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    loading,
    addChild,
    updateChild,
    deleteChild
  };
}