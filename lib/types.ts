// Existing types remain...

export interface User {
  id: string;
  email: string;
  name: string;
  userType: 'parent' | 'specialist' | 'admin';
  createdAt: Date;
  updatedAt?: Date;
}