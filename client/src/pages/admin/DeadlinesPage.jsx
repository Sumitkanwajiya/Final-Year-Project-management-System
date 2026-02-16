import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProjects } from "../../store/slices/adminSlice"; // Use projects instead of deadlines
import CreateDeadlineModal from "../../components/modal/CreateDeadlineModal";
import {
  Calendar,
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  Loader2,
  User,
  Briefcase,
  UserCheck,
  UserX,
  ArrowRight
} from "lucide-react";

const DeadlinesPage = () => {
  const dispatch = useDispatch();
  // Fetch projects from admin slice
  const { projects, loading } = useSelector((state) => state.admin);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  useEffect(() => {
    dispatch(getAllProjects());
  }, [dispatch]);

  // Calculate stats based on project deadlines
  const stats = useMemo(() => {
    if (!projects) return { total: 0, upcoming: 0, passed: 0 };

    // Count projects that HAVE a deadline
    const projectsWithDeadline = projects.filter(p => p.deadline);
    const total = projectsWithDeadline.length;
    const now = new Date();

    const upcoming = projectsWithDeadline.filter(p => new Date(p.deadline) > now).length;
    const passed = projectsWithDeadline.filter(p => new Date(p.deadline) <= now).length;

    return { total, upcoming, passed };
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (!projects) return [];

    return projects.filter(project => {
      const projectTitle = project.title || "";
      const studentName = project.student?.name || "";
      // Search matches
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        projectTitle.toLowerCase().includes(searchLower) ||
        studentName.toLowerCase().includes(searchLower);

      // Filter logic
      const hasDeadline = !!project.deadline;
      const deadlineDate = project.deadline ? new Date(project.deadline) : null;
      const now = new Date();

      if (filter === "upcoming") return matchesSearch && hasDeadline && deadlineDate > now;
      if (filter === "passed") return matchesSearch && hasDeadline && deadlineDate <= now;
      if (filter === "no-deadline") return matchesSearch && !hasDeadline;

      return matchesSearch;
    });
  }, [projects, filter, searchQuery]);

  const handleSetDeadline = (projectId) => {
    setSelectedProjectId(projectId);
    setIsCreateModalOpen(true);
  };

  if (loading && (!projects || projects.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-800 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 md:py-6 sticky top-0 z-10 shadow-sm md:shadow-none transition-all">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 md:w-7 md:h-7 text-indigo-600" />
              Deadlines & Milestones
            </h1>
            <p className="text-slate-500 text-xs md:text-sm mt-1 hidden md:block">
              Manage project timelines and important dates
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 transition-all transform active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>Set New Deadline</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 space-y-6 md:space-y-8">

        {/* Stats Grid - Horizontal Scroll on Mobile */}
        <div className="flex overflow-x-auto pb-4 gap-4 md:grid md:grid-cols-3 md:gap-6 md:pb-0 hide-scrollbar snap-x -mx-4 px-4 md:mx-0 md:px-0">
          <div className="min-w-[260px] md:min-w-0 snap-center">
            <StatCard
              title="Active Deadlines"
              value={stats.total}
              icon={<Calendar className="w-6 h-6 text-blue-600" />}
              bg="bg-blue-50"
              border="border-blue-100"
            />
          </div>
          <div className="min-w-[260px] md:min-w-0 snap-center">
            <StatCard
              title="Upcoming"
              value={stats.upcoming}
              icon={<Clock className="w-6 h-6 text-emerald-600" />}
              bg="bg-emerald-50"
              border="border-emerald-100"
            />
          </div>
          <div className="min-w-[260px] md:min-w-0 snap-center">
            <StatCard
              title="Passed / Overdue"
              value={stats.passed}
              icon={<AlertTriangle className="w-6 h-6 text-amber-600" />}
              bg="bg-amber-50"
              border="border-amber-100"
            />
          </div>
        </div>

        {/* Filters & Search - Mobile Optimized */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm sticky top-[0px] md:static z-20 md:z-auto">
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
            {['all', 'upcoming', 'passed', 'no-deadline'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-slate-500 hover:bg-slate-100'
                  } capitalize whitespace-nowrap flex-shrink-0 border border-transparent ${filter !== f ? 'border-slate-100 bg-slate-50' : ''}`}
              >
                {f.replace('-', ' ')}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 bg-slate-50 focus:bg-white"
            />
          </div>
        </div>

        {/* Table/Card View */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-20 md:mb-0">
          {/* Mobile Card View */}
          <div className="md:hidden space-y-4 p-4 min-h-[300px]">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => {
                const hasDeadline = !!project.deadline;
                const deadlineDate = hasDeadline ? new Date(project.deadline) : null;
                const isPassed = deadlineDate && deadlineDate < new Date();

                return (
                  <div key={project._id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4 relative overflow-hidden">
                    {/* Status Strip */}
                    {hasDeadline && (
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${isPassed ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                    )}

                    <div className="flex justify-between items-start pl-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">
                          {project.student?.name?.charAt(0) || <User className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">
                            {project.student?.name || "Unknown"}
                          </p>
                          <span className="text-xs text-slate-500 block truncate max-w-[150px]">{project.title || "No Title"}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        {hasDeadline ? (
                          <div className="flex flex-col items-end">
                            <span className="text-sm font-bold text-slate-900">
                              {deadlineDate.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                            <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full mt-1 ${isPassed ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                              {isPassed ? 'Overdue' : 'Active'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic bg-slate-50 px-2 py-1 rounded-full border border-slate-100">No Date</span>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-50 flex items-center justify-between pl-3">
                      <div className="text-sm">
                        {project.supervisor ? (
                          <span className="flex items-center gap-1.5 text-slate-600">
                            <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                            {project.supervisor.name}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-slate-400">
                            <UserX className="w-3.5 h-3.5" />
                            Unassigned
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleSetDeadline(project._id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors active:scale-95"
                      >
                        {hasDeadline ? <Clock className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        {hasDeadline ? "Update" : "Set Date"}
                      </button>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-12 text-slate-500">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <p>No projects found matching your filters</p>
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Project Title</th>
                  <th className="px-6 py-4">Supervisor</th>
                  <th className="px-6 py-4">Deadline Status</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => {
                    const hasDeadline = !!project.deadline;
                    const deadlineDate = hasDeadline ? new Date(project.deadline) : null;
                    const isPassed = deadlineDate && deadlineDate < new Date();

                    return (
                      <tr key={project._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                              <User className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 text-sm">
                                {project.student?.name || "Unknown"}
                              </p>
                              <p className="text-xs text-slate-500">
                                {project.student?.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-700">
                            <Briefcase className="w-4 h-4 text-slate-400" />
                            <span className="text-sm font-medium truncate max-w-[200px]" title={project.title}>
                              {project.title || "No Title"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {project.supervisor ? (
                            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full w-fit">
                              <UserCheck className="w-3.5 h-3.5" />
                              <span className="text-xs font-semibold">
                                {project.supervisor.name}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-rose-700 bg-rose-50 px-3 py-1 rounded-full w-fit">
                              <UserX className="w-3.5 h-3.5" />
                              <span className="text-xs font-semibold">Not Assigned</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {hasDeadline ? (
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-slate-900">
                                {deadlineDate.toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                              <span className={`text-xs font-semibold ${isPassed ? 'text-rose-500' : 'text-emerald-600'}`}>
                                {isPassed ? 'Overdue' : 'On Track'}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-slate-400 italic">No Deadline Set</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleSetDeadline(project._id)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title={hasDeadline ? "Update Deadline" : "Set Deadline"}
                          >
                            {hasDeadline ? <Clock className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-12">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <Search className="w-8 h-8 mb-2 opacity-50" />
                        <p>No projects found matching your filters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Floating Action Button for Mobile */}
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="md:hidden fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-xl shadow-indigo-500/40 hover:bg-indigo-700 active:scale-90 transition-all z-40 flex items-center justify-center"
        aria-label="Set New Deadline"
      >
        <Plus size={24} />
      </button>

      <CreateDeadlineModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setSelectedProjectId(null); // Reset selection
          dispatch(getAllProjects());
        }}
        preSelectedProjectId={selectedProjectId} // Pass the selected project ID
      />
    </div>
  );
};

const StatCard = ({ title, value, icon, bg, border }) => (
  <div className={`p-4 md:p-6 rounded-2xl ${bg} border ${border} flex items-center gap-4`}>
    <div className="p-3 bg-white rounded-xl shadow-sm">{icon}</div>
    <div>
      <p className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wider">{title}</p>
      <h3 className="text-xl md:text-2xl font-extrabold text-slate-900">{value}</h3>
    </div>
  </div>
);

export default DeadlinesPage;
