import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTeacherDashboardStats } from "../../store/slices/teacherSlice";
import { useNavigate } from "react-router-dom";
import {
  Users,
  GraduationCap,
  Briefcase,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Bell,
  FileText,
  Loader2,
  BarChart3
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

const TeacherDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dashboardStats, loading } = useSelector((state) => state.teacher);
  const { authUser } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getTeacherDashboardStats());
  }, [dispatch]);

  // Refresh on window focus
  useEffect(() => {
    const handleFocus = () => {
      dispatch(getTeacherDashboardStats());
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [dispatch]);

  const projectStatusData = useMemo(() => {
    if (!dashboardStats) return [];
    return [
      { name: 'Active', value: dashboardStats.activeProjects || 0, color: '#3b82f6' },
      { name: 'Pending', value: dashboardStats.pendingProjects || 0, color: '#f59e0b' },
      { name: 'Completed', value: dashboardStats.completedProjects || 0, color: '#10b981' }
    ];
  }, [dashboardStats]);

  const projectStatsForBar = useMemo(() => {
    if (!dashboardStats) return [];
    return [
      { name: 'Active', count: dashboardStats.activeProjects || 0 },
      { name: 'Pending', count: dashboardStats.pendingProjects || 0 },
      { name: 'Completed', count: dashboardStats.completedProjects || 0 }
    ];
  }, [dashboardStats]);

  if (loading && !dashboardStats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            Welcome back, {authUser?.name}!
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            Here's an overview of your supervision activities
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Pending Requests"
            value={dashboardStats?.pendingRequests || 0}
            icon={<Clock className="w-6 h-6 text-amber-600" />}
            bg="bg-amber-50"
            border="border-amber-100"
            onClick={() => navigate("/teacher/pending-requests")}
            trend={dashboardStats?.pendingRequests > 0 ? "Needs attention" : "All clear"}
          />
          <StatCard
            title="Assigned Students"
            value={dashboardStats?.assignedStudents || 0}
            icon={<Users className="w-6 h-6 text-blue-600" />}
            bg="bg-blue-50"
            border="border-blue-100"
            onClick={() => navigate("/teacher/assigned-students")}
          />
          <StatCard
            title="Total Projects"
            value={dashboardStats?.totalProjects || 0}
            icon={<Briefcase className="w-6 h-6 text-indigo-600" />}
            bg="bg-indigo-50"
            border="border-indigo-100"
          />
          <StatCard
            title="Completed Projects"
            value={dashboardStats?.completedProjects || 0}
            icon={<CheckCircle className="w-6 h-6 text-emerald-600" />}
            bg="bg-emerald-50"
            border="border-emerald-100"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Project Status Pie Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Project Status Distribution</h2>
            </div>
            {projectStatusData.some(d => d.value > 0) ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={projectStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {projectStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No projects yet</p>
                </div>
              </div>
            )}
          </div>

          {/* Project Stats Bar Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Project Overview</h2>
            </div>
            {projectStatsForBar.some(d => d.count > 0) ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={projectStatsForBar}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No project data</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Bell className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Recent Notifications</h2>
          </div>
          {dashboardStats?.recentNotifications && dashboardStats.recentNotifications.length > 0 ? (
            <div className="space-y-3">
              {dashboardStats.recentNotifications.map((notification, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${notification.priority === 'High' ? 'bg-red-100' :
                      notification.priority === 'Medium' ? 'bg-amber-100' :
                        'bg-blue-100'
                    }`}>
                    <Bell className={`w-4 h-4 ${notification.priority === 'High' ? 'text-red-600' :
                        notification.priority === 'Medium' ? 'text-amber-600' :
                          'text-blue-600'
                      }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">{notification.message}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(notification.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No recent notifications</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickActionCard
            title="View Pending Requests"
            description="Review supervisor requests from students"
            icon={<Clock className="w-6 h-6" />}
            color="amber"
            onClick={() => navigate("/teacher/pending-requests")}
          />
          <QuickActionCard
            title="Assigned Students"
            description="Manage your supervised students"
            icon={<Users className="w-6 h-6" />}
            color="blue"
            onClick={() => navigate("/teacher/assigned-students")}
          />
          <QuickActionCard
            title="Project Files"
            description="Access student project submissions"
            icon={<FileText className="w-6 h-6" />}
            color="indigo"
            onClick={() => navigate("/teacher/files")}
          />
        </div>
      </div>
    </div>
  );
};

// StatCard Component
const StatCard = ({ title, value, icon, bg, border, onClick, trend }) => (
  <div
    onClick={onClick}
    className={`${bg} border ${border} rounded-2xl p-6 shadow-sm hover:shadow-md transition-all ${onClick ? 'cursor-pointer hover:scale-105' : ''
      }`}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-white rounded-xl shadow-sm">{icon}</div>
      {trend && (
        <span className="text-xs font-semibold text-slate-600 bg-white px-2 py-1 rounded-full">
          {trend}
        </span>
      )}
    </div>
    <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-1">{title}</h3>
    <p className="text-3xl font-extrabold text-slate-900">{value}</p>
  </div>
);

// QuickActionCard Component
const QuickActionCard = ({ title, description, icon, color, onClick }) => {
  const colorClasses = {
    amber: "bg-amber-50 border-amber-200 hover:bg-amber-100 text-amber-600",
    blue: "bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-600",
    indigo: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100 text-indigo-600"
  };

  return (
    <div
      onClick={onClick}
      className={`${colorClasses[color]} border rounded-2xl p-6 cursor-pointer hover:shadow-md transition-all hover:scale-105`}
    >
      <div className="p-3 bg-white rounded-xl shadow-sm w-fit mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  );
};

export default TeacherDashboard;
