
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BellRing, CheckCircle, AlertTriangle, Info, X, CalendarCheck, BookOpen, UserCheck, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { markNotificationAsRead } from '@/lib/services/studentApiService'; 

const NotificationCenter = ({ notifications: initialNotifications }) => {
  const [notifications, setNotifications] = useState(initialNotifications || []);
  const { toast } = useToast();

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      toast({ title: "Notification Updated", description: "Marked as read." });
    } catch (error) {
      toast({ title: "Error", description: "Could not mark notification as read.", variant: "destructive" });
    }
  };
  
  const handleDismiss = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
     toast({ title: "Notification Dismissed", description: "Notification removed from view." });
  };

  const getIcon = (type) => {
    switch (type) {
      case 'schedule': return <CalendarCheck className="text-sky-400" />;
      case 'enrollment': return <BookOpen className="text-emerald-400" />;
      case 'appointment': return <UserCheck className="text-purple-400" />;
      case 'credit': return <BarChart3 className="text-amber-400" />;
      case 'alert': return <AlertTriangle className="text-red-400" />;
      default: return <Info className="text-slate-400" />;
    }
  };
  
  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <Card className="bg-slate-800/60 border-slate-700/50 shadow-xl h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold text-gray-200 flex items-center">
          <BellRing className="mr-3 h-6 w-6 text-rose-400" />
          Notifications
        </CardTitle>
        {unreadNotifications.length > 0 && (
          <span className="px-2.5 py-1 text-xs font-bold text-white bg-rose-500 rounded-full">
            {unreadNotifications.length} New
          </span>
        )}
      </CardHeader>
      <CardContent className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        <AnimatePresence>
          {notifications.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10"
            >
              <BellRing className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No new notifications.</p>
              <p className="text-sm text-slate-500">You're all caught up!</p>
            </motion.div>
          ) : (
            notifications.map((notification) => (
              <motion.div
                key={notification.id}
                layout
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, transition: { duration: 0.2 } }}
                className={`p-3 rounded-lg border ${notification.read ? 'bg-slate-700/30 border-slate-600/50' : 'bg-sky-800/20 border-sky-700/50 hover:bg-sky-800/30'} transition-colors`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 pt-0.5">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${notification.read ? 'text-slate-400' : 'text-sky-300'}`}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{notification.message}</p>
                    <p className="text-xs text-slate-500 mt-1.5">
                      {new Date(notification.created_at).toLocaleDateString()} - {new Date(notification.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-1">
                    {!notification.read && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="p-1 h-auto text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                        title="Mark as read"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    )}
                     <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDismiss(notification.id)}
                        className="p-1 h-auto text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        title="Dismiss"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </CardContent>
      {notifications.length > 0 && (
         <div className="p-4 border-t border-slate-700/50 text-center">
            <Button variant="link" className="text-sky-400 hover:text-sky-300 text-sm" onClick={() => setNotifications([])}>
                Clear All Notifications
            </Button>
         </div>
      )}
    </Card>
  );
};

export default NotificationCenter;
