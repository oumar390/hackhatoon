import React, { useState, useEffect } from 'react';
import {
  Bell,
  BellRing,
  X,
  CheckCircle
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface NotificationProps {
  className?: string;
  userId: number;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'coach_assigned':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'request_approved':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'request_rejected':
      return <X className="h-5 w-5 text-red-500" />;
    case 'new_comment':
      return <BellRing className="h-5 w-5 text-blue-600" />;
    default:
      return <Bell className="h-5 w-5 text-gray-500" />;
  }
};

export const Notifications: React.FC<NotificationProps> = ({ className, userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, markNotificationAsRead, deleteNotification, getNotificationsForUser } = useStore();
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Récupérer les notifications de l'utilisateur connecté
  const userNotifications = getNotificationsForUser(userId);
  
  // Calculer le nombre de notifications non lues
  useEffect(() => {
    const count = userNotifications.filter(notif => !notif.isRead).length;
    setUnreadCount(count);
    
    // Afficher une notification toast lorsqu'une nouvelle notification arrive
    if (count > 0) {
      const latestNotif = userNotifications
        .filter(notif => !notif.isRead)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
      
      if (latestNotif) {
        toast(latestNotif.title, {
          description: latestNotif.message,
          position: 'top-right',
        });
      }
    }
  }, [userNotifications]);
  
  const handleMarkAsRead = (id: number) => {
    markNotificationAsRead(id);
  };
  
  const handleDelete = (id: number) => {
    deleteNotification(id);
  };
  
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleToggle}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
        aria-label="Notifications"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50 border border-gray-200">
          <div className="p-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {userNotifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                Aucune notification
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {userNotifications.map((notification) => (
                  <li 
                    key={notification.id} 
                    className={`p-3 hover:bg-gray-50 transition-colors duration-150 ${!notification.isRead ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 mr-2">
                        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: fr })}
                        </p>
                      </div>
                      <div className="flex-shrink-0 flex flex-col space-y-1">
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-xs text-blue-600 hover:text-blue-800 focus:outline-none"
                            aria-label="Marquer comme lu"
                          >
                            Marquer lu
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="text-xs text-red-600 hover:text-red-800 focus:outline-none"
                          aria-label="Supprimer"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
