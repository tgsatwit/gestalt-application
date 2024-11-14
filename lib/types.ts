// Existing types remain...

export interface Session {
  id: string;
  childId: string;
  childName: string;
  parentId: string;
  parentName: string;
  specialistId?: string;
  specialistName: string;
  specialistType: 'account' | 'vanity';
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  date: Date;
  startTime: string;
  endTime: string;
  notes?: string;
  privateNotes?: string; // Only visible to creator
  createdAt: Date;
  updatedAt?: Date;
}