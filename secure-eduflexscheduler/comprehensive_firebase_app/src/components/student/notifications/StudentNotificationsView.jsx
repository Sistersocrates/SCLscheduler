
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchStudentNotifications, markNotificationAsRead } from '@/lib/services/studentApiService';
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle, AlertTriangle, Info, X, MailOpen, MailWarning, Loader2, CalendarDays, BookOpen, UserCheck, BarChart3, AlertCircle } from 'lucide-react';

const StudentNotificationsView = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); 
  const [actionLoading, setActionLoading] = useState(null); 

  const loadNotifications = async () => {
    if (!user?.profile?.id) {
      setError("User profile not available.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const filters = {};
      if (filter === 'unread') filters.read_status = false;
      if (filter === 'read') filters.read_status = true;
      const data = await fetchStudentNotifications(user.profile.id, filters);
      setNotifications(data);
    } catch (err) {
      console.error("Failed to load student notifications:", err);
      setError(err.message || "Could not load notifications.");
      toast({
        title: "Error Loading Notifications",
        description: err.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [user, toast, filter]);

  const handleMarkAsRead = async (notificationId) => {
    setActionLoading(notificationId);
    try {
      await markNotificationAsRead(notificationId);
      
      setNotifications(prev => prev.map(n => n.id === notificationId ? {...n, read: true} : n));
      toast({ title: "Notification Updated", description: "Marked as read." });
    } catch (err) {
      toast({ title: "Update Failed", description: err.message, variant: "destructive" });
    } finally {
      setActionLoading(null);
    }
  };
  
  const handleDismiss = (id) => {
    
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast({ title: "Notification Dismissed", description: "Notification removed from view." });
  };

  const getIcon = (type, isRead) => {
    const baseClass = isRead ? "text-slate-500" : "";
    switch (type) {
      case 'schedule': return <CalendarDays className={`${baseClass} ${!isRead && 'text-sky-400'}`} />;
      case 'enrollment': return <BookOpen className={`${baseClass} ${!isRead && 'text-emerald-400'}`} />;
      case 'appointment': return <UserCheck className={`${baseClass} ${!isRead && 'text-purple-400'}`} />;
      case 'credit': return <BarChart3 className={`${baseClass} ${!isRead && 'text-amber-400'}`} />;
      case 'alert': return <AlertTriangle className={`${baseClass} ${!isRead && 'text-red-400'}`} />;
      default: return <Info className={`${baseClass} ${!isRead && 'text-slate-400'}`} />;
    }
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-sky-500" />
        <p className="ml-3 text-gray-300">Loading notifications...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <Card className="bg-red-900/20 border-red-700/50 shadow-xl">
        <CardHeader><CardTitle className="text-red-300 flex items-center"><AlertCircle className="mr-2"/>Error</CardTitle></CardHeader>
        <CardContent><p className="text-red-400">{error}</p></CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}
        className="flex flex-col sm:flex-row justify-between items-center"
      >
        <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-500 to-orange-500 mb-4 sm:mb-0">
          Notifications
        </h1>
        <div className="flex space-x-2">
          <Button variant={filter === 'all' ? 'default': 'outline'} onClick={() => setFilter('all')} className={filter === 'all' ? 'bg-sky-500 text-white' : 'text-gray-300 border-slate-600 hover:bg-slate-700'}>All</Button>
          <Button variant={filter === 'unread' ? 'default': 'outline'} onClick={() => setFilter('unread')} className={filter === 'unread' ? 'bg-sky-500 text-white' : 'text-gray-300 border-slate-600 hover:bg-slate-700'}>Unread</Button>
          <Button variant={filter === 'read' ? 'default': 'outline'} onClick={() => setFilter('read')} className={filter === 'read' ? 'bg-sky-500 text-white' : 'text-gray-300 border-slate-600 hover:bg-slate-700'}>Read</Button>
        </div>
      </motion.div>

      {notifications.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/40 rounded-lg shadow-inner">
          {filter === 'unread' ? <MailOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" /> : <Bell className="w-16 h-16 text-slate-600 mx-auto mb-4" />}
          <p className="text-xl text-slate-400">
            {filter === 'unread' ? "No unread notifications." : "No notifications found."}
          </p>
          <p className="text-slate-500 mt-1">
            {filter === 'unread' ? "You're all caught up!" : "Check back later for updates."}
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
          <AnimatePresence>
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 30, transition: { duration: 0.2 } }}
                transition={{ delay: index * 0.03 }}
              >
                <Card className={`border ${notification.read ? 'bg-slate-700/40 border-slate-600/60' : 'bg-sky-800/30 border-sky-700/60 hover:bg-sky-800/40'} transition-colors`}>
                  <CardContent className="p-4 flex items-start space-x-3">
                    <div className="flex-shrink-0 pt-1">
                      {getIcon(notification.type, notification.read)}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold ${notification.read ? 'text-slate-300' : 'text-sky-200'}`}>{notification.title}</h4>
                      <p className="text-sm text-slate-400 mt-0.5">{notification.message}</p>
                      <p className="text-xs text-slate-500 mt-1.5">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      {!notification.read && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                          onClick={() => handleMarkAsRead(notification.id)}
                          disabled={actionLoading === notification.id}
                          title="Mark as read"
                        >
                          {actionLoading === notification.id ? <Loader2 className="h-4 w-4 animate-spin"/> : <CheckCircle className="h-4 w-4" />}
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        onClick={() => handleDismiss(notification.id)}
                        title="Dismiss"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default StudentNotificationsView;
