export type NotificationType =
  | 'crash_report_new'
  | 'crash_report_updated'
  | 'crash_report_assigned'
  | 'maintenance_scheduled'
  | 'maintenance_completed'
  | 'status_changed';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: {
    report_id?: string;
    train_id?: string;
    severity?: string;
    old_status?: string;
    new_status?: string;
    [key: string]: any;
  };
  is_read: boolean;
  created_at: string;
  read_at?: string;
}

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
}