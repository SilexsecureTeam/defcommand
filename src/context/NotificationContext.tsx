import React, { createContext, useState, useEffect } from "react";
import { EmergencyEvent } from "../utils/types/location";

interface NotificationContextType {
  notifications: any;
  addNotification: any;
  markAsSeen: any;
  clearNotifications: any;
  unseenCount: any;
  notificationOpen: any;
  setNotificationOpen: any;
  toggleNotificationModal: any;
  emergencies: any;
  setEmergencies: any;
}

export const NotificationContext =
  createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notifications, setNotifications] = useState(() => {
    const saved = sessionStorage.getItem("notifications");
    return saved ? JSON.parse(saved) : [];
  });

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [emergencies, setEmergencies] = useState<
    Record<string, EmergencyEvent>
  >({});

  const toggleNotificationModal = () => {
    // if (!notificationOpen) markAllAsSeen();
    setNotificationOpen((prev) => !prev);
  };

  useEffect(() => {
    sessionStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notif: any) => {
    const newNotif = { ...notif, seen: false };
    setNotifications((prev: string | any[]) => [
      newNotif,
      ...prev.slice(0, 49),
    ]);
  };

  const markAsSeen = (id: any) => {
    setNotifications((prev: any[]) =>
      prev.map((n: { data: { id: any } }) =>
        n?.data?.id === id ? { ...n, seen: true } : n,
      ),
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
    sessionStorage.removeItem("notifications");
  };

  const unseenCount = notifications.filter(
    (n: { seen: any }) => !n.seen,
  ).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsSeen,
        clearNotifications,
        unseenCount,
        notificationOpen,
        setNotificationOpen,
        toggleNotificationModal,
        emergencies,
        setEmergencies,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
