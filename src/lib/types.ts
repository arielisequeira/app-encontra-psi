// Tipos do EncontraPsi

export type TherapyApproach = 
  | 'psicanalise'
  | 'sistemica'
  | 'gestalt'
  | 'humanista'
  | 'tcc'
  | 'grupo';

export interface TherapyInfo {
  id: TherapyApproach;
  name: string;
  description: string;
  detailedDescription: string;
  color: string;
  icon: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
}

export interface QuizOption {
  id: string;
  text: string;
  approach: TherapyApproach;
}

export interface QuizResult {
  approaches: TherapyApproach[];
  scores: Record<TherapyApproach, number>;
}

export interface Psychologist {
  id: string;
  name: string;
  crp: string;
  photo: string;
  approaches: TherapyApproach[];
  specialties: string[];
  bio: string;
  city: string;
  state: string;
  neighborhood?: string;
  address?: string;
  modality: ('online' | 'presencial')[];
  priceRange: string;
  rating: number;
  reviewCount: number;
  availability: string[];
  subscriptionStatus: 'active' | 'inactive' | 'pending' | 'expired';
  subscriptionPlan?: 'monthly';
  subscriptionExpiry?: string;
  documentsValidated?: boolean;
}

export interface Appointment {
  id: string;
  psychologistId: string;
  psychologistName: string;
  psychologistPhoto: string;
  date: string;
  time: string;
  modality: 'online' | 'presencial';
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled';
  createdAt: string;
  notes?: string;
}

export interface PsychologistRegistration {
  fullName: string;
  crp: string;
  email: string;
  phone: string;
  approaches: TherapyApproach[];
  specialties: string[];
  city: string;
  state: string;
  neighborhood: string;
  modality: ('online' | 'presencial')[];
  priceRange: string;
  bio: string;
  documents: File[];
}

export interface Subscription {
  id: string;
  psychologistId: string;
  plan: 'monthly';
  status: 'active' | 'inactive' | 'pending' | 'expired';
  paymentMethod: 'credit_card' | 'pix';
  startDate: string;
  expiryDate: string;
  autoRenew: boolean;
  amount: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'appointment_request' | 'appointment_confirmed' | 'appointment_rejected' | 'appointment_reminder' | 'message' | 'subscription_expiring';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedId?: string; // ID do agendamento ou mensagem relacionada
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  content: string;
  createdAt: string;
  read: boolean;
}
