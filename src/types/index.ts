export type UserRole = 'asha' | 'phc';

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  contactNumber: string;
  address: string;
  village: string;
  pregnancyStatus?: 'pregnant' | 'delivered' | 'none';
  lmpDate?: string; // Last Menstrual Period
  eddDate?: string; // Expected Date of Delivery
  ancVisits: ANCVisit[];
  vaccinations: Vaccination[];
  childId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ANCVisit {
  id: string;
  visitNumber: number;
  scheduledDate: string;
  completedDate?: string;
  status: 'scheduled' | 'completed' | 'missed';
  notes?: string;
  bloodPressure?: string;
  weight?: string;
  hemoglobin?: string;
}

export interface Vaccination {
  id: string;
  name: string;
  scheduledDate: string;
  completedDate?: string;
  status: 'scheduled' | 'completed' | 'missed';
  dueForChild?: boolean;
}

export interface Reminder {
  id: string;
  patientId: string;
  patientName: string;
  type: 'anc' | 'vaccination';
  title: string;
  dueDate: string;
  status: 'upcoming' | 'overdue' | 'completed';
}

export type Language = 'en' | 'hi' | 'bn';
