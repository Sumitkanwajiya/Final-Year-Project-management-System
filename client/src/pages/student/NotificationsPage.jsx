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
      bg: 'bg-red-50', border: 'border-red-100', iconBg: 'bg-red-100', iconColor: 'text-red-600', icon: <ShieldAlert className="w-5 h-5" />
    };

    switch (type) {
      case "Project": return { bg: 'bg-blue-50', border: 'border-blue-100', iconBg: 'bg-blue-100', iconColor: 'text-blue-600', icon: <FileText className="w-5 h-5" /> };
      case "Feedback": return { bg: 'bg-green-50', border: 'border-green-100', iconBg: 'bg-green-100', iconColor: 'text-green-600', icon: <MessageSquare className="w-5 h-5" /> };
      case "Deadline": return { bg: 'bg-yellow-50', border: 'border-yellow-100', iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600', icon: <Clock className="w-5 h-5" /> };
      case "Approval": return { bg: 'bg-green-50', border: 'border-green-100', iconBg: 'bg-green-100', iconColor: 'text-green-600', icon: <CheckCircle2 className="w-5 h-5" /> };
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
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans pb-20 md:pb-12 text-slate-800">
      {/* Vibrant Header Section (Restored V1) */}
      <div className="bg-slate-900 pb-20 pt-8 px-4 md:px-6 lg:px-8 shadow-md relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute right-0 top-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-300 uppercase tracking-wider border border-white/10 shadow-sm flex items-center gap-2">
                  <Bell className="w-3 h-3" /> Notifications Center
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tight leading-tight">
                Activity & <span className="text-blue-400">Updates</span>
              </h1>
              <p className="text-slate-400 mt-2 text-sm md:text-lg max-w-xl">
                Stay on top of your deadlines, feedback, and project milestones.
              </p>
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="w-full md:w-auto bg-white hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-lg font-bold text-sm shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 border border-slate-200"
                >
                  <MailOpen className="w-4 h-4" /> Mark All Read
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 -mt-12 md:-mt-16 space-y-6 md:space-y-6 relative z-20">

        {/* Colorful Stats Cards - Integrated 4th card */}
        <div className="flex overflow-x-auto pb-4 gap-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 md:pb-0 hide-scrollbar snap-x -mx-4 px-4 md:mx-0 md:px-0">
          <div
            onClick={() => setFilter('all')}
            className={`min-w-[260px] md:min-w-0 snap-center relative overflow-hidden bg-white p-5 md:p-6 rounded-xl shadow-sm border-b-4 border-blue-500 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg group ${filter === 'all' ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
          >
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Inbox className="w-24 h-24 text-blue-600" />
            </div>
            <div className="relative z-10">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Inbox</p>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-800">{list.length}</h3>
              <p className="text-xs text-blue-600 font-medium mt-2 flex items-center gap-1">
                <Inbox className="w-3 h-3" /> All messages
              </p>
            </div>
          </div>

          <div
            onClick={() => setFilter('unread')}
            className={`min-w-[260px] md:min-w-0 snap-center relative overflow-hidden bg-white p-5 md:p-6 rounded-xl shadow-sm border-b-4 border-yellow-500 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg group ${filter === 'unread' ? 'ring-2 ring-yellow-500 ring-offset-2' : ''}`}
          >
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap className="w-24 h-24 text-yellow-600" />
            </div>
            <div className="relative z-10">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Unread</p>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-800">{unreadCount}</h3>
              <p className="text-xs text-yellow-600 font-medium mt-2 flex items-center gap-1">
                <Info className="w-3 h-3" /> Actions Needed
              </p>
            </div>
          </div>

          <div
            onClick={() => setFilter('high')}
            className={`min-w-[260px] md:min-w-0 snap-center relative overflow-hidden bg-white p-5 md:p-6 rounded-xl shadow-sm border-b-4 border-red-500 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg group ${filter === 'high' ? 'ring-2 ring-red-500 ring-offset-2' : ''}`}
          >
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <AlertTriangle className="w-24 h-24 text-red-600" />
            </div>
            <div className="relative z-10">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">High Priority</p>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-800">{highPriorityMessages}</h3>
              <p className="text-xs text-red-600 font-medium mt-2 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" /> Urgent Attention
              </p>
            </div>
          </div>

          <div
            onClick={() => setFilter('week')}
            className={`min-w-[260px] md:min-w-0 snap-center relative overflow-hidden bg-white p-5 md:p-6 rounded-xl shadow-sm border-b-4 border-green-500 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg group ${filter === 'week' ? 'ring-2 ring-green-500 ring-offset-2' : ''}`}
          >
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <CalendarDays className="w-24 h-24 text-green-600" />
            </div>
            <div className="relative z-10">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">This Week</p>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-800">{thisWeekNotifications}</h3>
              <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
                <CalendarDays className="w-3 h-3" /> Recent Activity
              </p>
            </div>
          </div>
        </div>

        {/* Notifications List - Restored V1 Spacing */}
        <div className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-2 gap-2">
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
                  className={`group relative bg-white rounded-xl border transition-all duration-300 ${notification.isRead ? 'border-slate-200 opacity-90' : 'border-l-4 border-l-blue-500 border-y-slate-200 border-r-slate-200 shadow-sm transform hover:-translate-y-0.5 hover:shadow-md'}`}
                >
                  <div className="p-4 md:p-6 flex gap-4 md:gap-5 items-start">
                    {/* Colorful Icon Box */}
                    <div className={`mt-1 w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${style.iconBg} ${style.iconColor}`}>
                      {style.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-2 md:gap-4">
                        <div>
                          <h4 className={`text-base font-bold flex items-center gap-2 flex-wrap ${notification.isRead ? 'text-slate-600' : 'text-slate-900'}`}>
                            {notification.type}
                            {notification.priority === 'High' && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-red-50 text-red-600 border border-red-100">
                                High Priority
                              </span>
                            )}
                            {!notification.isRead && (
                              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                            )}
                          </h4>
                          <p className={`text-sm mt-1.5 leading-relaxed ${notification.isRead ? 'text-slate-500' : 'text-slate-700 font-medium'}`}>
                            {notification.message}
                          </p>
                        </div>
                        <span className="text-xs text-slate-400 font-medium whitespace-nowrap bg-slate-50 px-2 py-1 rounded border border-slate-100 self-start md:self-auto">
                          {formatDate(notification.createdAt)}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="mt-4 flex items-center gap-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-200 md:translate-y-2 md:group-hover:translate-y-0">
                        {!notification.isRead && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleMarkAsRead(notification._id); }}
                            className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" /> Mark Read
                          </button>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(notification._id); }}
                          className="text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
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
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-100 blur-xl rounded-full opacity-50"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-blue-50 to-white rounded-full flex items-center justify-center border border-blue-100 shadow-sm mb-6">
                  <Inbox className="w-10 h-10 text-blue-300" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900">It's quiet here</h3>
              <p className="text-slate-500 mt-2 text-center max-w-xs">
                No {filter !== 'all' ? filter : ''} notifications found. Enjoy your focus time!
              </p>
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="mt-6 text-blue-600 font-bold text-sm hover:underline"
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
