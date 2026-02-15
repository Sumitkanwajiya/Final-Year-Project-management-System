import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
} from "../../store/slices/notificationSlice";
import {
  Bell,
  Check,
  Clock,
  Trash2,
  Filter,
  MoreHorizontal,
  CheckCircle2,
  AlertTriangle,
  Info,
  MessageSquare,
  FileText,
  Calendar,
  Loader2,
  MailOpen,
  Zap,
  Star,
  ShieldAlert,
  Inbox,
  CalendarDays
} from "lucide-react";

const NotificationsPage = () => {
  const dispatch = useDispatch();
  const {
    list = [],
    unreadCount,
    readCount,
    highPriorityMessages,
    thisWeekNotifications,
    loading
  } = useSelector((state) => state.notification);

  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(getNotifications());
  }, [dispatch]);

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id));
  };

  const handleDelete = (id) => {
    dispatch(deleteNotification(id));
  };

  const handleMarkAllRead = () => {
    dispatch(markAllAsRead());
  };

  const getNotificationStyle = (type, priority) => {
    if (priority === 'High') return {
      bg: 'bg-rose-50', border: 'border-rose-100', iconBg: 'bg-rose-100', iconColor: 'text-rose-600', icon: <ShieldAlert className="w-5 h-5" />
    };

    switch (type) {
      case "Project": return { bg: 'bg-indigo-50', border: 'border-indigo-100', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600', icon: <FileText className="w-5 h-5" /> };
      case "Feedback": return { bg: 'bg-teal-50', border: 'border-teal-100', iconBg: 'bg-teal-100', iconColor: 'text-teal-600', icon: <MessageSquare className="w-5 h-5" /> };
      case "Deadline": return { bg: 'bg-amber-50', border: 'border-amber-100', iconBg: 'bg-amber-100', iconColor: 'text-amber-600', icon: <Clock className="w-5 h-5" /> };
      case "Approval": return { bg: 'bg-emerald-50', border: 'border-emerald-100', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', icon: <CheckCircle2 className="w-5 h-5" /> };
      case "Rejection": return { bg: 'bg-red-50', border: 'border-red-100', iconBg: 'bg-red-100', iconColor: 'text-red-600', icon: <AlertTriangle className="w-5 h-5" /> };
      default: return { bg: 'bg-slate-50', border: 'border-slate-100', iconBg: 'bg-slate-100', iconColor: 'text-slate-600', icon: <Info className="w-5 h-5" /> };
    }
  };

  const filteredList = list.filter((note) => {
    if (filter === "unread") return !note.isRead;
    if (filter === "high") return note.priority === "High";
    if (filter === "week") {
      const date = new Date(note.createdAt);
      const now = new Date();
      const dayOfWeek = now.getDay();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - dayOfWeek);
      startOfWeek.setHours(0, 0, 0, 0);
      return date >= startOfWeek;
    }
    return true;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    if (diffDays === 2) return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading && list.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans pb-12">
      {/* Vibrant Header Section (Restored V1) */}
      <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 pb-24 pt-12 px-6 lg:px-8 shadow-xl relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 rounded-full bg-indigo-400/20 blur-2xl"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider border border-white/20 shadow-sm flex items-center gap-2">
                  <Bell className="w-3 h-3" /> Notifications Center
                </span>
              </div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
                Activity & <span className="text-indigo-200">Updates</span>
              </h1>
              <p className="text-indigo-100 mt-2 text-lg font-light max-w-xl">
                Stay on top of your deadlines, feedback, and project milestones.
              </p>
            </div>

            <div className="flex gap-4">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="bg-white hover:bg-indigo-50 text-indigo-700 px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2 ring-2 ring-white/50"
                >
                  <MailOpen className="w-4 h-4" /> Mark All Read
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 -mt-16 space-y-6 relative z-20">

        {/* Colorful Stats Cards - Integrated 4th card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            onClick={() => setFilter('all')}
            className={`relative overflow-hidden bg-white p-6 rounded-2xl shadow-md border-b-4 border-indigo-500 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl group ${filter === 'all' ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}
          >
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Inbox className="w-24 h-24 text-indigo-600" />
            </div>
            <div className="relative z-10">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Inbox</p>
              <h3 className="text-3xl font-extrabold text-slate-800">{list.length}</h3>
              <p className="text-xs text-indigo-600 font-medium mt-2 flex items-center gap-1">
                <Inbox className="w-3 h-3" /> All messages
              </p>
            </div>
          </div>

          <div
            onClick={() => setFilter('unread')}
            className={`relative overflow-hidden bg-white p-6 rounded-2xl shadow-md border-b-4 border-amber-500 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl group ${filter === 'unread' ? 'ring-2 ring-amber-500 ring-offset-2' : ''}`}
          >
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap className="w-24 h-24 text-amber-600" />
            </div>
            <div className="relative z-10">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Unread</p>
              <h3 className="text-3xl font-extrabold text-slate-800">{unreadCount}</h3>
              <p className="text-xs text-amber-600 font-medium mt-2 flex items-center gap-1">
                <Info className="w-3 h-3" /> Actions Needed
              </p>
            </div>
          </div>

          <div
            onClick={() => setFilter('high')}
            className={`relative overflow-hidden bg-white p-6 rounded-2xl shadow-md border-b-4 border-rose-500 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl group ${filter === 'high' ? 'ring-2 ring-rose-500 ring-offset-2' : ''}`}
          >
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <AlertTriangle className="w-24 h-24 text-rose-600" />
            </div>
            <div className="relative z-10">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">High Priority</p>
              <h3 className="text-3xl font-extrabold text-slate-800">{highPriorityMessages}</h3>
              <p className="text-xs text-rose-600 font-medium mt-2 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" /> Urgent Attention
              </p>
            </div>
          </div>

          <div
            onClick={() => setFilter('week')}
            className={`relative overflow-hidden bg-white p-6 rounded-2xl shadow-md border-b-4 border-teal-500 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl group ${filter === 'week' ? 'ring-2 ring-teal-500 ring-offset-2' : ''}`}
          >
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <CalendarDays className="w-24 h-24 text-teal-600" />
            </div>
            <div className="relative z-10">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">This Week</p>
              <h3 className="text-3xl font-extrabold text-slate-800">{thisWeekNotifications}</h3>
              <p className="text-xs text-teal-600 font-medium mt-2 flex items-center gap-1">
                <CalendarDays className="w-3 h-3" /> Recent Activity
              </p>
            </div>
          </div>
        </div>

        {/* Notifications List - Restored V1 Spacing */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              {filter === 'all' && "All Notifications"}
              {filter === 'unread' && "Unread Messages"}
              {filter === 'high' && "High Priority Alerts"}
              {filter === 'week' && "This Week's Activity"}
            </h2>
            <span className="text-xs text-slate-500 font-medium bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
              Showing {filteredList.length} results
            </span>
          </div>

          {filteredList.length > 0 ? (
            filteredList.map((notification) => {
              const style = getNotificationStyle(notification.type, notification.priority);
              return (
                <div
                  key={notification._id}
                  className={`group relative bg-white rounded-2xl border transition-all duration-300 ${notification.isRead ? 'border-slate-200 opacity-80 hover:opacity-100' : 'border-l-4 border-l-indigo-500 border-y-slate-200 border-r-slate-200 shadow-md transform hover:-translate-y-0.5'}`}
                >
                  <div className="p-6 flex gap-5 items-start">
                    {/* Colorful Icon Box */}
                    <div className={`mt-1 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${style.iconBg} ${style.iconColor}`}>
                      {style.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h4 className={`text-base font-bold flex items-center gap-3 ${notification.isRead ? 'text-slate-600' : 'text-slate-900'}`}>
                            {notification.type}
                            {notification.priority === 'High' && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-rose-50 text-rose-600 border border-rose-100">
                                High Priority
                              </span>
                            )}
                            {!notification.isRead && (
                              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                            )}
                          </h4>
                          <p className={`text-sm mt-1.5 leading-relaxed ${notification.isRead ? 'text-slate-500' : 'text-slate-700 font-medium'}`}>
                            {notification.message}
                          </p>
                        </div>
                        <span className="text-xs text-slate-400 font-medium whitespace-nowrap bg-slate-50 px-2 py-1 rounded border border-slate-100">
                          {formatDate(notification.createdAt)}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="mt-4 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0">
                        {!notification.isRead && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleMarkAsRead(notification._id); }}
                            className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" /> Mark Read
                          </button>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(notification._id); }}
                          className="text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-100 blur-xl rounded-full opacity-50"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-indigo-50 to-white rounded-full flex items-center justify-center border border-indigo-100 shadow-sm mb-6">
                  <Inbox className="w-10 h-10 text-indigo-300" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900">It's quiet here</h3>
              <p className="text-slate-500 mt-2 text-center max-w-xs">
                No {filter !== 'all' ? filter : ''} notifications found. Enjoy your focus time!
              </p>
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="mt-6 text-indigo-600 font-bold text-sm hover:underline"
                >
                  View all notifications
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
