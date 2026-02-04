'use client';

import { useNotifications } from '@/context/NotificationContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  CheckCheck,
  Trash2,
  AlertCircle,
  Wrench,
  CheckCircle,
  FileText,
  Calendar,
  Bell,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { NotificationType } from '@/types/notification';
import { useRouter } from 'next/navigation';

const notificationIcons: Record<NotificationType, React.ReactNode> = {
  crash_report_new: <AlertCircle className="h-4 w-4 text-red-500" />,
  crash_report_updated: <FileText className="h-4 w-4 text-blue-500" />,
  crash_report_assigned: <Wrench className="h-4 w-4 text-orange-500" />,
  maintenance_scheduled: <Calendar className="h-4 w-4 text-purple-500" />,
  maintenance_completed: <CheckCircle className="h-4 w-4 text-green-500" />,
  status_changed: <FileText className="h-4 w-4 text-blue-500" />,
};

export function NotificationPanel() {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();
  const router = useRouter();

  const handleNotificationClick = async (notification: any) => {
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }

    if (notification.data?.report_id) {
      router.push(`/dashboard/laporan/${notification.data.report_id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">Notifikasi</h3>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="rounded-full px-2">
              {unreadCount}
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllAsRead}
            className="h-8 text-xs"
          >
            <CheckCheck className="mr-1 h-3 w-3" />
            Tandai Semua
          </Button>
        )}
      </div>

      <ScrollArea className="h-96">
        {notifications.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2 text-center">
            <Bell className="h-12 w-12 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              Tidak ada notifikasi
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`group relative cursor-pointer p-4 transition-colors hover:bg-muted/50 ${
                  !notification.is_read ? 'bg-blue-50/50' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                {!notification.is_read && (
                  <div className="absolute left-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-blue-500" />
                )}

                <div className="flex gap-3 pl-4">
                  <div className="mt-0.5 shrink-0">
                    {notificationIcons[notification.type]}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4
                        className={`text-sm ${
                          !notification.is_read ? 'font-semibold' : 'font-medium'
                        }`}
                      >
                        {notification.title}
                      </h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      {formatDistanceToNow(new Date(notification.created_at), {
                        addSuffix: true,
                        locale: localeId,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}