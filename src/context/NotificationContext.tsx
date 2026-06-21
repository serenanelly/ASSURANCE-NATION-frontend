"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "@/components/icons";
import { cn } from "@/utils/cn";
import { siteConfig } from "@/config/site";

export type NotificationType = "success" | "error" | "info" | "warning";

export interface Notification {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number;
}

interface NotificationContextValue {
  notifications: Notification[];
  notify: (notification: Omit<Notification, "id">) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  dismiss: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined
);

const DEFAULT_DURATION = 5000;

const iconMap = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const styleMap = {
  success: "border-success/30 bg-success/10 text-success",
  error: "border-error/30 bg-error/10 text-error",
  info: "border-info/30 bg-info/10 text-info",
  warning: "border-warning/30 bg-warning/10 text-warning",
};

function NotificationToast({
  notification,
  onDismiss,
}: {
  notification: Notification;
  onDismiss: (id: string) => void;
}) {
  const Icon = iconMap[notification.type];

  return (
    <div
      role="alert"
      className={cn(
        "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-sm",
        styleMap[notification.type]
      )}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
      <div className="min-w-0 flex-1">
        {notification.title && (
          <p className="text-sm font-semibold text-foreground">
            {notification.title}
          </p>
        )}
        <p className="text-sm text-foreground">{notification.message}</p>
      </div>
      <button
        type="button"
        onClick={() => onDismiss(notification.id)}
        className="shrink-0 rounded p-1 text-muted transition-colors hover:bg-black/5 dark:hover:bg-white/10"
        aria-label="Fermer la notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const enabled = siteConfig.features.notifications;

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const notify = useCallback(
    (notification: Omit<Notification, "id">) => {
      if (!enabled) return;

      const id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`;

      const entry: Notification = { ...notification, id };
      setNotifications((prev) => [...prev, entry]);

      const duration = notification.duration ?? DEFAULT_DURATION;
      if (duration > 0) {
        window.setTimeout(() => dismiss(id), duration);
      }
    },
    [dismiss, enabled]
  );

  const success = useCallback(
    (message: string, title = "Succès") => notify({ type: "success", message, title }),
    [notify]
  );

  const error = useCallback(
    (message: string, title = "Erreur") => notify({ type: "error", message, title }),
    [notify]
  );

  const info = useCallback(
    (message: string, title = "Information") => notify({ type: "info", message, title }),
    [notify]
  );

  const warning = useCallback(
    (message: string, title = "Attention") => notify({ type: "warning", message, title }),
    [notify]
  );

  const clearAll = useCallback(() => setNotifications([]), []);

  const value = useMemo(
    () => ({
      notifications,
      notify,
      success,
      error,
      info,
      warning,
      dismiss,
      clearAll,
    }),
    [notifications, notify, success, error, info, warning, dismiss, clearAll]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {enabled && notifications.length > 0 && (
        <div
          className="pointer-events-none fixed bottom-4 right-4 z-[100] flex flex-col gap-2"
          aria-live="polite"
          aria-relevant="additions"
        >
          {notifications.map((notification) => (
            <NotificationToast
              key={notification.id}
              notification={notification}
              onDismiss={dismiss}
            />
          ))}
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification(): NotificationContextValue {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification doit être utilisé dans un NotificationProvider"
    );
  }
  return context;
}
