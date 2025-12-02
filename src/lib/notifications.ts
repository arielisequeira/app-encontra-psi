import { Notification } from './types';

// Sistema de notificações simulado (em produção, seria integrado com backend)
export const mockNotifications: Notification[] = [];

export const createNotification = (notification: Omit<Notification, 'id' | 'createdAt'>): Notification => {
  const newNotification: Notification = {
    ...notification,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  
  mockNotifications.push(newNotification);
  return newNotification;
};

export const markAsRead = (notificationId: string) => {
  const notification = mockNotifications.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
  }
};

export const getUnreadCount = (userId: string): number => {
  return mockNotifications.filter(n => n.userId === userId && !n.read).length;
};

export const getUserNotifications = (userId: string): Notification[] => {
  return mockNotifications
    .filter(n => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};
