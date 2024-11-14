"use client"

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Milestone } from '@/lib/types';
import { toast } from 'sonner';
import { isAfter } from 'date-fns';
import { useAuth } from './use-auth';

export function useMilestones() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) {
      setMilestones([]);
      setLoading(false);
      return;
    }

    // Query milestones for the current user only
    const q = query(
      collection(db, 'milestones'),
      where('userId', '==', user.id)
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const milestonesData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const milestone = {
          id: doc.id,
          ...data,
        } as Milestone;

        // Only update status to past-due if it's not completed and the date has passed
        if (milestone.status !== 'completed' && isAfter(new Date(), new Date(milestone.date))) {
          milestone.status = 'past-due';
        }

        return milestone;
      });
      
      setMilestones(milestonesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching milestones:", error);
      toast.error("Failed to load milestones");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.id]);

  const addMilestone = async (milestone: Omit<Milestone, 'id'>) => {
    if (!user?.id) {
      toast.error('You must be logged in to add milestones');
      return;
    }

    try {
      const milestoneWithUser = {
        ...milestone,
        userId: user.id,
        createdAt: new Date(),
      };
      
      await addDoc(collection(db, 'milestones'), milestoneWithUser);
      toast.success('Milestone added successfully');
    } catch (error) {
      console.error("Error adding milestone:", error);
      toast.error('Failed to add milestone');
    }
  };

  const updateMilestone = async (id: string, updates: Partial<Milestone>) => {
    if (!user?.id) {
      toast.error('You must be logged in to update milestones');
      return;
    }

    try {
      const milestoneRef = doc(db, 'milestones', id);
      await updateDoc(milestoneRef, {
        ...updates,
        updatedAt: new Date(),
      });
      toast.success('Milestone updated successfully');
    } catch (error) {
      console.error("Error updating milestone:", error);
      toast.error('Failed to update milestone');
    }
  };

  const deleteMilestone = async (id: string) => {
    if (!user?.id) {
      toast.error('You must be logged in to delete milestones');
      return;
    }

    try {
      await deleteDoc(doc(db, 'milestones', id));
      toast.success('Milestone deleted successfully');
    } catch (error) {
      console.error("Error deleting milestone:", error);
      toast.error('Failed to delete milestone');
    }
  };

  return {
    milestones,
    loading,
    addMilestone,
    updateMilestone,
    deleteMilestone,
  };
}