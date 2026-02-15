import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardStats, getAllProjects, getAllUsers } from "../../store/slices/adminSlice";
import { useNavigate } from "react-router-dom";
import AddStudent from "../../components/modal/AddStudent";
import AddTeacher from "../../components/modal/AddTeacher";
import ProjectFileModal from "../../components/modal/ProjectFileModal";

import {
  Users,
  GraduationCap,
  Briefcase,
  UserCheck,
  Loader2,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  LayoutDashboard,
  FileText,
  ClipboardList,
  Plus
} from "lucide-react";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats, students, teachers, loading } = useSelector((state) => state.admin);
  const navigate = useNavigate();
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [fileModal, setFileModal] = useState({ isOpen: false, type: null, title: "" });



  // Force refresh on mount and when navigating back
  useEffect(() => {
    dispatch(getDashboardStats());
    dispatch(getAllProjects());
    dispatch(getAllUsers()); // Fetch students and teachers arrays
  }, [dispatch]);

  // Refresh dashboard when returning to the page (e.g., from ManageStudents)
  useEffect(() => {
    const handleFocus = () => {
      dispatch(getDashboardStats());
      dispatch(getAllProjects());
      dispatch(getAllUsers()); // Refresh students and teachers
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [dispatch]);

  // Refresh dashboard when modals close
  const handleStudentModalClose = () => {
    setIsStudentModalOpen(false);
    // Force refresh after a short delay to ensure backend has processed
    setTimeout(() => {
      dispatch(getDashboardStats());
      dispatch(getAllProjects());
      dispatch(getAllUsers()); // Refresh students and teachers
    }, 300);
  };

  const handleTeacherModalClose = () => {
    setIsTeacherModalOpen(false);
    // Force refresh after a short delay to ensure backend has processed
    setTimeout(() => {
      dispatch(getDashboardStats());
      dispatch(getAllProjects());
      dispatch(getAllUsers()); // Refresh students and teachers
    }, 300);
  };


  const userDistributionData = useMemo(() => {
    return [
      { name: 'Students', count: students?.length || 0, color: '#3b82f6' }, // blue-500
      { name: 'Teachers', count: teachers?.length || 0, color: '#10b981' }, // emerald-500
      { name: 'Supervisors', count: stats?.totalSupervisors || 0, color: '#8b5cf6' }, // violet-500
    ];
  }, [students, teachers, stats]);

  const projectStatusData = useMemo(() => {
    return [
      { name: 'Approved', value: stats?.activeProjects || 0, color: '#3b82f6' }, // blue-500
      { name: 'Pending', value: stats?.pendingProjects || 0, color: '#f59e0b' }, // amber-500
      { name: 'Completed', value: stats?.completeProjects || 0, color: '#10b981' }, // emerald-500
    ];
  }, [stats]);

  if (loading && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="text-slate-500 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-800 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <LayoutDashboard className="w-6 h-6 text-indigo-600" />
              Admin Dashboard
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Overview of system performance and statistics
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-slate-900">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p className="text-xs text-slate-400">System Administrator</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 space-y-8">







        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Students"
            value={students?.length || 0}
            icon={<GraduationCap className="w-6 h-6 text-blue-600" />}
            bg="bg-blue-50"
            border="border-blue-100"
            trend="+12% this month"
          />
          <StatCard
            title="Total Teachers"
            value={teachers?.length || 0}
            icon={<Users className="w-6 h-6 text-emerald-600" />}
            bg="bg-emerald-50"
            border="border-emerald-100"
            trend="Stable"
          />
          <StatCard
            title="Active Supervisors"
            value={stats?.totalSupervisors || 0}
            icon={<UserCheck className="w-6 h-6 text-violet-600" />}
            bg="bg-violet-50"
            border="border-violet-100"
            trend={`${stats?.totalTeachers ? Math.round((stats.totalSupervisors / stats.totalTeachers) * 100) : 0}% of teachers`}
          />
          <StatCard
            title="Total Projects"
            value={stats?.totalProjects || 0}
            icon={<Briefcase className="w-6 h-6 text-amber-600" />}
            bg="bg-amber-50"
            border="border-amber-100"
            trend="Active Cycle"
          />
        </div>

        {/* Status & Alerts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatusCard
            title="Active Projects"
            value={stats?.activeProjects || 0}
            label="Currently Ongoing"
            icon={<Briefcase className="w-5 h-5 text-indigo-500" />}
            color="indigo"
          />
          <StatusCard
            title="Nearby Deadlines"
            value={stats?.nearbyDeadlines || 0}
            label="Due in 2 Weeks"
            icon={<Clock className="w-5 h-5 text-amber-500" />}
            color="amber"
          />
          <StatusCard
            title="Pending Requests"
            value={stats?.pendingRequests || 0}
            label="Supervisor Requests"
            icon={<AlertCircle className="w-5 h-5 text-rose-500" />}
            color="rose"
          />
          <StatusCard
            title="Pending Projects"
            value={stats?.pendingProjects || 0}
            label="Awaiting Approval"
            icon={<Loader2 className="w-5 h-5 text-blue-500" />}
            color="blue"
          />
        </div>

        {/* Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* User Distribution Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-400" /> User Distribution
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userDistributionData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={50}>
                    {userDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Project Status Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-slate-400" /> Project Status
            </h3>
            <div className="h-[300px] w-full flex items-center justify-center">
              {(stats?.activeProjects || 0) + (stats?.completeProjects || 0) + (stats?.pendingProjects || 0) === 0 ? (
                <div className="text-center text-slate-400">
                  <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p className="text-sm">No projects yet</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={projectStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {projectStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

        </div>




        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionButton
            title="Add Student"
            subtitle="Create new student account"
            icon={<GraduationCap className="w-5 h-5" />}
            onClick={() => setIsStudentModalOpen(true)}
            color="blue"
          />
          <QuickActionButton
            title="Add Teacher"
            subtitle="Create new teacher account"
            icon={<Users className="w-5 h-5" />}
            onClick={() => setIsTeacherModalOpen(true)}
            color="emerald"
          />
          <QuickActionButton
            title="View Files"
            subtitle="Access project files"
            icon={<FileText className="w-5 h-5" />}
            onClick={() => setFileModal({ isOpen: true, type: null, title: "All Files" })}
            color="indigo"
          />
          <QuickActionButton
            title="System Reports"
            subtitle="Download statistics"
            icon={<ClipboardList className="w-5 h-5" />}
            onClick={() => setFileModal({ isOpen: true, type: "Report", title: "System Reports" })}
            color="amber"
          />
        </div>

        <AddStudent isOpen={isStudentModalOpen} onClose={handleStudentModalClose} />
        <AddTeacher isOpen={isTeacherModalOpen} onClose={handleTeacherModalClose} />
        <ProjectFileModal
          isOpen={fileModal.isOpen}
          onClose={() => setFileModal({ ...fileModal, isOpen: false })}
          title={fileModal.title}
          filterType={fileModal.type}
        />
      </div>
    </div>
  );
};




const StatCard = ({ title, value, icon, bg, border, trend }) => (
  <div className={`p-6 rounded-2xl ${bg} border ${border} transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-white rounded-xl shadow-sm">
        {icon}
      </div>
      {trend && <span className="text-xs font-bold text-slate-500 bg-white/50 px-2 py-1 rounded-full">{trend}</span>}
    </div>
    <div>
      <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{title}</p>
      <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{value}</h3>
    </div>
  </div>
);

const StatusCard = ({ title, value, label, icon, color }) => {
  const colorStyles = {
    rose: "bg-rose-50 border-rose-100 text-rose-700",
    amber: "bg-amber-50 border-amber-100 text-amber-700",
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-700",
    indigo: "bg-indigo-50 border-indigo-100 text-indigo-700",
    blue: "bg-blue-50 border-blue-100 text-blue-700",
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between group hover:border-indigo-300 transition-colors">
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-xs text-slate-500 mt-1">{label}</p>
      </div>
      <div className={`p-4 rounded-full ${colorStyles[color]} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
    </div>
  );
};

export default AdminDashboard;

// Helper Components
const QuickActionButton = ({ title, subtitle, icon, onClick, color }) => {
  const colorStyles = {
    blue: "bg-blue-600 hover:bg-blue-700 shadow-blue-200",
    emerald: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200",
    indigo: "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200",
    amber: "bg-amber-600 hover:bg-amber-700 shadow-amber-200",
  };

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md hover:border-slate-300 group text-left"
    >
      <div className={`p-3 rounded-lg text-white shadow-lg ${colorStyles[color]} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div>
        <p className="font-bold text-slate-800 text-sm">{title}</p>
        <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
      </div>
    </button>
  );
};
