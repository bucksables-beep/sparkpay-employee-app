import React, { useState } from 'react';
import type { Notification } from '../types';

const initialNotifications: Notification[] = [
    { id: '1', icon: 'payments', title: 'Your salary for June has been processed', time: '10:30 AM', isRead: false, category: 'Today' },
    { id: '2', icon: 'campaign', title: 'New company policy update', time: '9:15 AM', isRead: false, category: 'Today' },
    { id: '3', icon: 'description', title: 'Payslip for May is now available', time: '4:45 PM', isRead: true, category: 'Yesterday' },
    { id: '4', icon: 'settings_suggest', title: 'System maintenance scheduled for tonight', time: '2:00 PM', isRead: true, category: 'Yesterday' },
];

const NotificationItem: React.FC<{ notification: Notification; onClick: () => void }> = ({ notification, onClick }) => (
    <button onClick={onClick} className={`w-full text-left flex items-start gap-4 rounded-lg p-4 shadow-sm transition-opacity interactive-scale ${notification.isRead ? 'bg-surface-light/50 dark:bg-surface-dark/40 opacity-70' : 'bg-surface-light dark:bg-surface-dark'}`}>
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${notification.isRead ? 'bg-primary/5 dark:bg-accent-blue/10' : 'bg-primary/10 dark:bg-accent-blue/20'} text-primary dark:text-accent-blue`}>
            <span className="material-symbols-outlined">{notification.icon}</span>
        </div>
        <div className="flex-1">
            <p className={`font-semibold ${notification.isRead ? 'text-subtext-light dark:text-subtext-dark' : 'text-text-light dark:text-text-dark'}`}>{notification.title}</p>
            <p className="text-sm text-subtext-light dark:text-subtext-dark mt-1">{notification.time}</p>
        </div>
        {!notification.isRead && (
            <div className="h-2.5 w-2.5 rounded-full bg-primary flex-shrink-0 mt-1" aria-hidden="true">
                <span className="sr-only">Unread</span>
            </div>
        )}
    </button>
);

const Notifications: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    };

    const markAsRead = (id: string) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    const todayNotifications = notifications.filter(n => n.category === 'Today');
    const yesterdayNotifications = notifications.filter(n => n.category === 'Yesterday');

    return (
        <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-border-light dark:border-border-dark">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="w-1/3"></div>
                        <h1 className="text-lg font-bold text-text-light dark:text-text-dark text-center w-1/3">Notifications</h1>
                        <div className="w-1/3 flex justify-end">
                            <button 
                                onClick={markAllAsRead} 
                                className="text-sm font-semibold text-primary dark:text-accent-blue hover:opacity-80 transition-opacity interactive-scale"
                            >
                                Mark all as read
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto p-4 space-y-6">
                {todayNotifications.length > 0 && (
                    <section>
                        <h2 className="text-base font-bold text-subtext-light dark:text-subtext-dark px-2 mb-3">Today</h2>
                        <div className="space-y-3">
                            {todayNotifications.map(notification => (
                                <NotificationItem key={notification.id} notification={notification} onClick={() => markAsRead(notification.id)} />
                            ))}
                        </div>
                    </section>
                )}
                {yesterdayNotifications.length > 0 && (
                    <section>
                        <h2 className="text-base font-bold text-subtext-light dark:text-subtext-dark px-2 mb-3">Yesterday</h2>
                        <div className="space-y-3">
                            {yesterdayNotifications.map(notification => (
                                <NotificationItem key={notification.id} notification={notification} onClick={() => markAsRead(notification.id)} />
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

export default Notifications;
