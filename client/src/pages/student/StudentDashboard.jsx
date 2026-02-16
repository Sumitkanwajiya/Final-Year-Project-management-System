import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats } from "../../store/slices/studentSlice";
import {
  LayoutDashboard,
  Clock,
  Bell,
  FileText,
  User,
  CheckCircle,
  AlertCircle,
  Calendar,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  Briefcase,
  Loader2,
  XCircle,
  Target,
  Layers,
  CalendarDays,
  FileBox,
  Hash,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";

const StudentDashboard = () => {
  const dispatch = useDispatch();

  // Use 'authUser' from auth state (as defined in authSlice.js)
  const { authUser } = useSelector((state) => state.auth || {});
  const { dashboardStats, loading: statsLoading } = useSelector((state) => state.student);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  // Safe destructuring with fallback
  const stats = dashboardStats || {};
  const {
    project = null,
    upcomingDeadline = [],
    topNotifications = [],
    feedbackNotification = null,
    supervisorName = null
  } = stats;

  const loading = statsLoading;

  // Extract first name safely
  const userName = authUser?.name ? authUser.name.split(' ')[0] : "Student";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-slate-500 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved": return "text-green-700 bg-green-50 border-green-200 ring-green-500/20";
      case "Rejected": return "text-red-700 bg-red-50 border-red-200 ring-red-500/20";
      case "Pending": return "text-yellow-700 bg-yellow-50 border-yellow-200 ring-yellow-500/20";
      default: return "text-slate-700 bg-slate-50 border-slate-200 ring-slate-500/20";
    }
  };

  const formatDate = (dateString, includeTime = false) => {
    if (!dateString) return "No Date";
    const options = {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    };
    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-800 pb-12">
      {/* Hero Header - Standardized Blue Theme */}
      <div className="bg-slate-900 pb-20 pt-8 px-4 md:px-6 lg:px-8 overflow-hidden shadow-md relative">
        {/* Abstract Background Elements - Subtle */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute right-0 top-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute left-10 bottom-0 w-[400px] h-[400px] bg-slate-700/10 rounded-full blur-[100px] translate-y-1/2"></div>
        </div>

        <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6 z-10">
          <div>
            <div className="flex items-center gap-2 text-blue-200 font-medium mb-3">
              <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-white/10 shadow-sm flex items-center gap-2">
                <LayoutDashboard className="w-3 h-3" /> Student Dashboard
              </span>
              <span className="text-slate-500 text-sm hidden sm:inline">|</span>
              <span className="text-slate-400 text-sm hidden sm:inline">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </span>
            </div>
            <h1 className="text-2xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">{userName}</span>!
            </h1>
            <p className="text-slate-400 mt-2 md:mt-3 max-w-2xl text-sm md:text-lg font-light leading-relaxed">
              Managing your Final Year Project has never been easier.
            </p>
          </div>

          {/* Quick Stats Badge - Hidden on mobile to save space */}
          {project && (
            <div className="hidden md:block animate-in slide-in-from-right duration-700">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 px-6 py-4 rounded-xl shadow-lg">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Current Status</p>
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${project.status === 'Approved' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : project.status === 'Pending' ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]' : 'bg-slate-400'}`}></span>
                  <p className="text-2xl font-bold text-white tracking-wide">
                    {project.status || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 -mt-12 md:-mt-20 space-y-6 md:space-y-8 relative z-20 pb-20 md:pb-12">

        {/* Top Stats Grid - Horizontal Scroll on Mobile */}
        <div className="flex overflow-x-auto pb-4 gap-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 md:pb-0 hide-scrollbar snap-x -mx-4 px-4 md:mx-0 md:px-0">

          {/* Supervisor Card */}
          <div className="min-w-[280px] md:min-w-0 bg-white p-5 md:p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 group snap-center">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <User className="w-5 h-5 md:w-6 md:h-6" />
              </div>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Supervisor</p>
            <h3 className="text-lg font-bold text-slate-900 truncate mt-1">{supervisorName || "Not Assigned"}</h3>
            {!supervisorName ? (
              <Link to="/student/supervisor" className="text-xs font-bold text-blue-600 mt-3 inline-flex items-center gap-1 hover:underline">
                Find Supervisor <ArrowRight className="w-3 h-3" />
              </Link>
            ) : (
              <p className="text-xs text-slate-500 mt-1">Assigned Support</p>
            )}
          </div>

          {/* Deadlines Card */}
          <div className="min-w-[280px] md:min-w-0 bg-white p-5 md:p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 group snap-center">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-50 rounded-lg flex items-center justify-center text-yellow-600 group-hover:bg-yellow-600 group-hover:text-white transition-all duration-300">
                <Clock className="w-5 h-5 md:w-6 md:h-6" />
              </div>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Next Deadline</p>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              {upcomingDeadline.length > 0 ? formatDate(upcomingDeadline[0].deadline) : "N/A"}
            </h3>
            <p className="text-xs text-slate-500 mt-1 truncate">
              {upcomingDeadline.length > 0 ? upcomingDeadline[0].title : "No pending items"}
            </p>
          </div>

          {/* Feedback Card */}
          <div className="min-w-[280px] md:min-w-0 bg-white p-5 md:p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 group snap-center">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-50 rounded-lg flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
                <MessageSquare className="w-5 h-5 md:w-6 md:h-6" />
              </div>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Latest Feedback</p>
            <p className="text-sm font-medium text-slate-700 italic line-clamp-1 mt-1 min-h-[1.25rem]">
              "{feedbackNotification || "No recent feedback"}"
            </p>
            <Link to={`/student/feedback`} className="text-xs font-bold text-green-600 mt-3 inline-block hover:underline">View All Feedback</Link>
          </div>

          {/* Notifications Card */}
          <div className="min-w-[280px] md:min-w-0 bg-white p-5 md:p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 group snap-center">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-red-50 rounded-lg flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                <Bell className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${topNotifications.length > 0 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'}`}>
                {topNotifications.length} New
              </span>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Notifications</p>
            <h3 className="text-lg font-bold text-slate-900 mt-1">Recent Alerts</h3>
            <Link to={`/student/notifications`} className="text-xs font-bold text-red-600 mt-3 inline-block hover:underline">View History</Link>
          </div>
        </div>

        {/* Main Content Split */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN: Comprehensive Project Details */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-blue-600" />
              Project Dashboard
            </h2>

            {project ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full ring-1 ring-slate-200/50">
                {/* Project Header */}
                <div className="p-5 md:p-8 pb-6 border-b border-slate-100 bg-slate-50/50 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-extrabold uppercase tracking-widest border border-blue-100">
                          <Target className="w-3 h-3" /> Active Project
                        </span>
                        <span className="text-xs font-mono text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">ID: {project._id?.slice(-6).toUpperCase()}</span>
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ring-2 ring-white shadow-sm flex items-center gap-2 ${getStatusColor(project.status)}`}>
                        {project.status === 'Approved' ? <CheckCircle className="w-3.5 h-3.5" /> : project.status === 'Pending' ? <Clock className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                        {project.status}
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-2 tracking-tight">{project.title}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-slate-500 mt-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>Submitted: <span className="font-semibold text-slate-700">{formatDate(project.createdAt)}</span></span>
                      </div>
                      {project.updatedAt && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span>Last Updated: <span className="font-semibold text-slate-700">{formatDate(project.updatedAt)}</span></span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-5 md:p-8 pt-6 flex-1 bg-white">
                  <div className="grid md:grid-cols-3 gap-8">
                    {/* Description Column */}
                    <div className="md:col-span-2 space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-blue-500" /> Abstract / Description
                      </h4>
                      <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 text-slate-700 leading-relaxed text-sm whitespace-pre-wrap">
                        {project.description}
                      </div>

                      {/* Quick Stats Row */}
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 flex items-center gap-3">
                          <div className="bg-white p-2 rounded-lg shadow-sm text-blue-600">
                            <Layers className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xl font-bold text-slate-900">{project.files?.length || 0}</p>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Files</p>
                          </div>
                        </div>
                        <div className="bg-green-50/50 p-4 rounded-xl border border-green-100/50 flex items-center gap-3">
                          <div className="bg-white p-2 rounded-lg shadow-sm text-green-600">
                            <Hash className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xl font-bold text-slate-900">v1.0</p>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Version</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Sidebar Column */}
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                          <User className="w-4 h-4 text-blue-500" /> Supervisor
                        </h4>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-colors group">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                              {supervisorName ? supervisorName.charAt(0) : "?"}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-slate-900 truncate">{supervisorName || "Pending"}</p>
                              <p className="text-xs text-slate-500">Faculty Guide</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                          <FileBox className="w-4 h-4 text-blue-500" /> Deliverables
                        </h4>
                        <Link to="/student/upload-files" className="block w-full text-center py-3 px-4 bg-slate-900 hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg text-sm transform hover:-translate-y-0.5 active:translate-y-0">
                          Manage Files & Code
                        </Link>
                        <button className="block w-full text-center py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-200 transition-all text-sm">
                          View History
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 text-center relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform duration-300">
                    <Briefcase className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">No Project Started</h3>
                  <p className="text-slate-500 max-w-md mx-auto leading-relaxed text-base md:text-lg">
                    You haven't submitted a project proposal yet. Kickstart your academic year by creating a new proposal today.
                  </p>
                  <Link to="/student/submit-proposal" className="mt-8 inline-flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-xl transition-all shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5">
                    <Sparkles className="w-5 h-5 text-blue-200" /> Create Project Proposal
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Activity & Feed */}
          <div className="space-y-6">
            {/* Feed */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-red-500" /> Activity Feed
                </h3>
              </div>
              <div className="divide-y divide-slate-50 max-h-[400px] overflow-y-auto custom-scrollbar">
                {topNotifications.length > 0 ? (
                  topNotifications.map((notif, index) => (
                    <div key={index} className="p-4 hover:bg-slate-50 transition-colors group cursor-pointer relative">
                      {notif.type === 'Alert' && <span className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>}
                      <div className="flex gap-3">
                        <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ring-2 ring-white shadow-sm ${notif.type === 'Alert' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                        <div>
                          <p className="text-sm text-slate-700 font-medium leading-relaxed group-hover:text-blue-700 transition-colors">{notif.message}</p>
                          <p className="text-xs text-slate-400 mt-1 font-semibold">{formatDate(notif.createdAt, true)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Bell className="w-5 h-5 text-slate-300" />
                    </div>
                    <p className="text-slate-400 text-sm font-medium">No new notifications</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recommended Actions or Deadlines */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-green-500" /> Upcoming
                </h3>
              </div>
              <div className="p-4 space-y-3">
                {upcomingDeadline.length > 0 ? (
                  upcomingDeadline.map((deadline, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-orange-50/30 border border-orange-100 hover:border-orange-200 transition-all shadow-sm group">
                      <div className="bg-white p-2.5 rounded-lg text-center min-w-[3.5rem] shadow-sm border border-orange-50 group-hover:scale-105 transition-transform">
                        <span className="block text-[10px] font-bold text-orange-600 uppercase tracking-tight">{new Date(deadline.deadline).toLocaleString('default', { month: 'short' })}</span>
                        <span className="block text-xl font-bold text-slate-900 leading-none mt-0.5">{new Date(deadline.deadline).getDate()}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-orange-700 transition-colors">{deadline.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <p className="text-xs text-slate-500 font-medium truncate">{deadline.description}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center bg-slate-50/30 rounded-xl border border-dashed border-slate-200">
                    <CheckCircle className="w-8 h-8 text-green-200 mx-auto mb-2" />
                    <p className="text-sm text-slate-400 font-medium">All caught up!</p>
                    <p className="text-xs text-slate-300">No pending deadlines</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
