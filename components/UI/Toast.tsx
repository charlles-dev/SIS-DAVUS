import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { Notification, useNotification } from '../../context/NotificationContext';

const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
};

const colors = {
    success: 'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800',
    error: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800',
    info: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800',
};

export const Toast: React.FC<{ notification: Notification }> = ({ notification }) => {
    const { removeNotification } = useNotification();
    const Icon = icons[notification.type];

    return (
        <div
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg max-w-sm w-full animate-slide-in ${colors[notification.type]}`}
            role="alert"
        >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium flex-1">{notification.message}</p>
            <button
                onClick={() => removeNotification(notification.id)}
                className="text-current opacity-60 hover:opacity-100 transition-opacity"
            >
                <X size={18} />
            </button>
        </div>
    );
};

export const ToastContainer: React.FC = () => {
    const { notifications } = useNotification();

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
            {notifications.map((notification) => (
                <div key={notification.id} className="pointer-events-auto">
                    <Toast notification={notification} />
                </div>
            ))}
        </div>
    );
};
