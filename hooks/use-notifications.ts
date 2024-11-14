"use client"

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, writeBatch, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './use-auth';
import { toast } from 'sonner';

export interface Notification {
  id: string;
  userId: string;
  type: 'connection_request' | 'connection_accepted' | 'connection_declined';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
  metadata?: {
    childId?: string;
    requestId?: string;
    senderId?: string;
  };
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.id),
      where('deleted', '==', false)
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        try {
          const notificationsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date()
          })) as Notification[];
          
          setNotifications(notificationsData);
          setUnreadCount(notificationsData.filter(n => !n.read).length);
        } catch (error) {
          console.error("Error processing notifications:", error);
          toast.error("Failed to load notifications");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Error fetching notifications:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.id]);

  const markAsRead = async (notificationId: string) => {
    if (!user?.id) return;

    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, {
        read: true,
        updatedAt: Timestamp.fromDate(new Date())
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read");
    }
  };

  const markAllAsRead = async () => {
    if (!user?.id) return;

    try {
      const batch = writeBatch(db);
      notifications.forEach(notification => {
        if (!notification.read) {
          const notificationRef = doc(db, 'notifications', notification.id);
          batch.update(notificationRef, {
            read: true,
            updatedAt: Timestamp.fromDate(new Date())
          });
        }
      });
      await batch.commit();
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error("Failed to mark all notifications as read");
    }
  };

  const deleteNotification = async (notificationId: string) => {
    if (!user?.id) return;

    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, {
        deleted: true,
        updatedAt: Timestamp.fromDate(new Date())
      });
      toast.success("Notification deleted");
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  return {
    notifications: notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };
}