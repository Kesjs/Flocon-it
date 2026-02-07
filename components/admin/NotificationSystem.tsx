"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, Check, AlertTriangle, Info, ShoppingCart, Users, TrendingUp, Ban, DollarSign, AlertCircle } from "lucide-react";

// Types de notifications
export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'new_order' | 'new_user' | 'payment_confirmed' | 'payment_rejected';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  data?: any; // Données supplémentaires (orderId, userEmail, etc.)
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAll: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Demander la permission pour les notifications navigateur au premier chargement
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
      });
    }
  }, []);

  // Charger les notifications depuis localStorage au démarrage
  useEffect(() => {
    const saved = localStorage.getItem('admin_notifications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNotifications(parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        })));
      } catch (e) {
      }
    }
  }, []);

  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('admin_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Limiter à 50 notifications

    // Jouer un son si disponible
    playNotificationSound(newNotification.type);

    // Notification navigateur si permis
    if (Notification.permission === 'granted') {
      new Notification(newNotification.title, {
        body: newNotification.message,
        icon: '/favicon.ico'
      });
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearNotification,
      clearAll,
      unreadCount
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

// Fonction pour jouer le son de notification
function playNotificationSound(type: NotificationType) {
  try {
    const audio = new Audio('/notification.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {
    });
  } catch (e) {
  }
}

// Composant d'icône selon le type avec icônes Lucide React
function NotificationIcon({ type }: { type: NotificationType }) {
  const iconClass = "w-5 h-5";
  
  switch (type) {
    case 'success':
      return <Check className={`${iconClass} text-green-600`} />;
    case 'warning':
      return <AlertTriangle className={`${iconClass} text-orange-600`} />;
    case 'error':
      return <Ban className={`${iconClass} text-red-600`} />;
    case 'new_order':
      return <ShoppingCart className={`${iconClass} text-blue-600`} />;
    case 'new_user':
      return <Users className={`${iconClass} text-purple-600`} />;
    case 'payment_confirmed':
      return <DollarSign className={`${iconClass} text-green-600`} />;
    case 'payment_rejected':
      return <AlertCircle className={`${iconClass} text-red-600`} />;
    default:
      return <Info className={`${iconClass} text-blue-600`} />;
  }
}

// Composant de notification individuelle
function NotificationItem({ notification, onMarkAsRead, onClear }: {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onClear: (id: string) => void;
}) {
  const bgColor = notification.read ? 'bg-white' : 'bg-blue-50';
  const borderColor = notification.read ? 'border-slate-200' : 'border-blue-200';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className={`${bgColor} border ${borderColor} rounded-lg p-3 shadow-sm`}
    >
      <div className="flex items-start gap-2">
        <NotificationIcon type={notification.type} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-slate-900 text-xs">
              {notification.title}
            </h4>
            <div className="flex items-center gap-1">
              {!notification.read && (
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              )}
              <button
                onClick={() => onClear(notification.id)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                <X size={12} />
              </button>
            </div>
          </div>
          <p className="text-slate-600 text-xs mb-2">{notification.message}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {notification.timestamp.toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
            <div className="flex gap-1">
              {notification.action && (
                <button
                  onClick={() => {
                    notification.action!.onClick();
                    onMarkAsRead(notification.id);
                  }}
                  className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                >
                  {notification.action.label}
                </button>
              )}
              {!notification.read && (
                <button
                  onClick={() => onMarkAsRead(notification.id)}
                  className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Marquer comme lu
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Panneau de notifications
export function NotificationPanel() {
  const { notifications, markAsRead, markAllAsRead, clearNotification, clearAll, unreadCount } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Bouton de notification */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 sm:p-2 hover:bg-slate-100 rounded-lg transition-colors"
      >
        <Bell size={20} className="text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-6 h-6 sm:w-5 sm:h-5 rounded-full flex items-center justify-center font-black animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Panneau déroulant */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Panneau */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed right-0 top-12 left-0 sm:left-auto sm:right-0 w-72 sm:w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 max-h-80 overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">
                    Notifications
                  </h3>
                  <div className="flex gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={() => {
                          markAllAsRead();
                        }}
                        className="text-xs text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        Tout marquer comme lu
                      </button>
                    )}
                    <button
                      onClick={() => {
                        clearAll();
                        setIsOpen(false);
                      }}
                      className="text-xs text-red-600 hover:text-red-700 transition-colors"
                    >
                      Tout effacer
                    </button>
                  </div>
                </div>
              </div>

              {/* Liste des notifications */}
              <div className="max-h-60 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center">
                    <Bell size={24} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-slate-500 text-xs">Aucune notification</p>
                  </div>
                ) : (
                  <div className="p-2 space-y-1">
                    <AnimatePresence>
                      {notifications.map((notification) => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                          onMarkAsRead={markAsRead}
                          onClear={clearNotification}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
