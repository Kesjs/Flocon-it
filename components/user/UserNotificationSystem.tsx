"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, Check, AlertTriangle, Info, ShoppingBag, Package, Truck, Star } from "lucide-react";

// Types de notifications spécifiques aux utilisateurs
export type UserNotificationType = 'info' | 'success' | 'warning' | 'error' | 'order_confirmed' | 'order_shipped' | 'order_delivered' | 'payment_received' | 'new_promotion';

export interface UserNotification {
  id: string;
  type: UserNotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  data?: any;
}

interface UserNotificationContextType {
  notifications: UserNotification[];
  addNotification: (notification: Omit<UserNotification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAll: () => void;
  unreadCount: number;
}

const UserNotificationContext = createContext<UserNotificationContextType | undefined>(undefined);

export function UserNotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<UserNotification[]>([]);

  // Demander la permission pour les notifications navigateur au premier chargement
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('Permission notifications utilisateur:', permission);
      });
    }
  }, []);

  // Charger les notifications depuis localStorage au démarrage
  useEffect(() => {
    const saved = localStorage.getItem('user_notifications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNotifications(parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        })));
      } catch (e) {
        console.error('Erreur chargement notifications utilisateur:', e);
      }
    }
  }, []);

  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('user_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notification: Omit<UserNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: UserNotification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 30)); // Limiter à 30 notifications

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
    <UserNotificationContext.Provider value={{
      notifications,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearNotification,
      clearAll,
      unreadCount
    }}>
      {children}
    </UserNotificationContext.Provider>
  );
}

export function useUserNotifications() {
  const context = useContext(UserNotificationContext);
  if (context === undefined) {
    throw new Error('useUserNotifications must be used within a UserNotificationProvider');
  }
  return context;
}

// Fonction pour jouer le son de notification
function playNotificationSound(type: UserNotificationType) {
  try {
    const audio = new Audio('/notification.mp3');
    audio.volume = 0.2;
    audio.play().catch(() => {
      console.log('Impossible de jouer le son de notification utilisateur');
    });
  } catch (e) {
    console.log('Audio non disponible');
  }
}

// Composant d'icône selon le type avec icônes Lucide React
function UserNotificationIcon({ type }: { type: UserNotificationType }) {
  const iconClass = "w-5 h-5";
  
  switch (type) {
    case 'success':
      return <Check className={`${iconClass} text-green-600`} />;
    case 'warning':
      return <AlertTriangle className={`${iconClass} text-orange-600`} />;
    case 'error':
      return <X className={`${iconClass} text-red-600`} />;
    case 'order_confirmed':
      return <ShoppingBag className={`${iconClass} text-blue-600`} />;
    case 'order_shipped':
      return <Package className={`${iconClass} text-purple-600`} />;
    case 'order_delivered':
      return <Truck className={`${iconClass} text-green-600`} />;
    case 'payment_received':
      return <Star className={`${iconClass} text-yellow-600`} />;
    case 'new_promotion':
      return <Star className={`${iconClass} text-pink-600`} />;
    default:
      return <Info className={`${iconClass} text-blue-600`} />;
  }
}

// Composant de notification individuelle
function UserNotificationItem({ notification, onMarkAsRead, onClear }: {
  notification: UserNotification;
  onMarkAsRead: (id: string) => void;
  onClear: (id: string) => void;
}) {
  const bgColor = notification.read ? 'bg-white' : 'bg-blue-50';
  const borderColor = notification.read ? 'border-gray-200' : 'border-blue-200';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className={`${bgColor} border ${borderColor} rounded-lg p-4 shadow-sm`}
    >
      <div className="flex items-start gap-3">
        <UserNotificationIcon type={notification.type} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-gray-900 text-sm">
              {notification.title}
            </h4>
            <div className="flex items-center gap-2">
              {!notification.read && (
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
              )}
              <button
                onClick={() => onClear(notification.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {notification.timestamp.toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
            <div className="flex gap-2">
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
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
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

// Panneau de notifications utilisateur
export function UserNotificationPanel() {
  const { notifications, markAsRead, markAllAsRead, clearNotification, clearAll, unreadCount } = useUserNotifications();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Bouton de notification */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg transition-colors min-h-[44px] relative"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
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
              className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 text-sm">
                    Mes Notifications
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
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell size={32} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 text-sm">Aucune notification</p>
                  </div>
                ) : (
                  <div className="p-2 space-y-2">
                    <AnimatePresence>
                      {notifications.map((notification) => (
                        <UserNotificationItem
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
