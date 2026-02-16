import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllProjects,
  approveProject,
  rejectProject,
  getDashboardStats
} from '../../store/slices/adminSlice';
import { downloadProjectFile } from '../../store/slices/projectSlice';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaFileAlt,
  FaSearch,
  FaDownload,
  FaEye,
  FaCalendarAlt,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaSpinner,
  FaProjectDiagram,
  FaFilter,
  FaClock,
  FaBan,
  FaExternalLinkAlt,
  FaExclamationTriangle
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectsPage = () => {
  const dispatch = useDispatch();
  const { projects, stats, loading } = useSelector((state) => state.admin);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Confirmation Modal State
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    type: null, // 'approve' | 'reject'
    projectId: null,
    projectTitle: ''
  });

  useEffect(() => {
    dispatch(getAllProjects());
    dispatch(getDashboardStats());
  }, [dispatch]);

  const filteredProjects = useMemo(() => {
    let result = projects;

    if (filter !== 'All') {
      result = result.filter((project) => project.status === filter);
    }

    if (searchTerm) {
      result = result.filter(
        (project) =>
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.student?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return result;
  }, [projects, filter, searchTerm]);

  // Request Confirmation
  const requestApprove = (project) => {
    setConfirmState({
      isOpen: true,
      type: 'approve',
      projectId: project._id,
      projectTitle: project.title
    });
    // Do NOT close the details modal yet, will close on confirm
  };

  const requestReject = (project) => {
    setConfirmState({
      isOpen: true,
      type: 'reject',
      projectId: project._id,
      projectTitle: project.title
    });
    // Do NOT close the details modal yet, will close on confirm
  };

  // Execute Action
  const executeDecision = async () => {
    // Optimistic UI update or just rely on re-fetch
    if (confirmState.type === 'approve') {
      await dispatch(approveProject(confirmState.projectId));
    } else if (confirmState.type === 'reject') {
      await dispatch(rejectProject(confirmState.projectId));
    }

    // Reset states and close modals
    setConfirmState({ isOpen: false, type: null, projectId: null, projectTitle: '' });
    setIsModalOpen(false); // Close details modal too
    setSelectedProject(null);
  };

  const closeConfirmation = () => {
    setConfirmState({ ...confirmState, isOpen: false });
  };

  const handleDownload = (projectId, fileId, fileName) => {
    dispatch(downloadProjectFile({ projectId, fileId, fileName }));
  };

  const openModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProject(null);
    setIsModalOpen(false);
  };

  // Stats for the top cards
  const projectStats = useMemo(() => {
    const total = projects.length;
    const pending = projects.filter(p => p.status === 'Pending').length;
    const active = projects.filter(p => p.status === 'Approved').length;
    const completed = projects.filter(p => p.status === 'Completed').length;
    const rejected = projects.filter(p => p.status === 'Rejected').length;
    return { total, pending, active, completed, rejected };
  }, [projects]);


  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-800 pb-12">
      {/* Hero Section */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm transition-all pb-2 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <FaProjectDiagram className="text-indigo-600" />
                Project Management
              </h1>
              <p className="text-slate-500 text-xs md:text-sm mt-1 hidden md:block">Oversee, review, and manage all student projects.</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative group w-full md:w-auto">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all w-full md:w-64 text-sm font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Tabs */}
        <div className="max-w-7xl mx-auto px-6 mt-2">
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
            {['All', 'Pending', 'Approved', 'Rejected', 'Completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`pb-3 text-sm font-semibold transition-all relative whitespace-nowrap ${filter === status
                  ? 'text-indigo-600'
                  : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                {status}
                {filter === status && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-6 md:space-y-8 mt-6 md:mt-8">
        {/* Stats Overview - Horizontal Scroll on Mobile */}
        <div className="flex overflow-x-auto pb-4 gap-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-5 md:pb-0 hide-scrollbar snap-x -mx-4 px-4 md:mx-0 md:px-0">
          <div className="min-w-[280px] md:min-w-0 snap-center">
            <StatCard
              title="Total Projects"
              value={projectStats.total}
              icon={<FaProjectDiagram />}
              color="indigo"
            />
          </div>
          <div className="min-w-[280px] md:min-w-0 snap-center">
            <StatCard
              title="Pending Review"
              value={projectStats.pending}
              icon={<FaClock />}
              color="amber"
            />
          </div>
          <div className="min-w-[280px] md:min-w-0 snap-center">
            <StatCard
              title="Active Projects"
              value={projectStats.active}
              icon={<FaCheckCircle />}
              color="emerald"
            />
          </div>
          <div className="min-w-[280px] md:min-w-0 snap-center">
            <StatCard
              title="Completed"
              value={projectStats.completed}
              icon={<FaFileAlt />}
              color="cyan"
            />
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 text-indigo-600">
            <FaSpinner className="animate-spin text-4xl mb-4" />
            <p className="text-sm font-medium animate-pulse">Loading projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <FaFilter className="text-3xl text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-700">No projects found</h3>
            <p className="text-slate-400 text-sm mt-2 max-w-xs text-center">
              We couldn't find any projects matching your current filters.
            </p>
            <button
              onClick={() => { setFilter('All'); setSearchTerm(''); }}
              className="mt-6 text-indigo-600 font-semibold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode='popLayout'>
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onClick={() => openModal(project)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Project Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedProject && (
          <Modal
            project={selectedProject}
            onClose={closeModal}
            onApprove={() => requestApprove(selectedProject)}
            onReject={() => requestReject(selectedProject)}
            onDownload={handleDownload}
          />
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmState.isOpen && (
          <ConfirmationModal
            type={confirmState.type}
            title={confirmState.projectTitle}
            onConfirm={executeDecision}
            onCancel={closeConfirmation}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Components ---

const StatCard = ({ title, value, icon, color }) => {
  const colorStyles = {
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    cyan: "bg-cyan-50 text-cyan-600 border-cyan-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
  }[color] || "bg-slate-50 text-slate-600";

  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(6,81,237,0.1)] border border-slate-100 hover:shadow-lg transition-all duration-300 group">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
          <h3 className="text-xl md:text-3xl font-extrabold text-slate-800">{value}</h3>
        </div>
        <div className={`p-2 md:p-3 rounded-xl ${colorStyles} transition-colors group-hover:scale-110 duration-300`}>
          {React.cloneElement(icon, { size: 20 })}
        </div>
      </div>
    </div>
  );
};

const ProjectCard = ({ project, onClick }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Rejected': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Completed': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={onClick}
      className="group bg-white rounded-2xl border border-slate-100 shadow-sm p-6 cursor-pointer hover:shadow-xl hover:border-indigo-100/50 transition-all duration-300 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <FaExternalLinkAlt className="text-indigo-400" />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wide border ${getStatusStyle(project.status)}`}>
          {project.status}
        </span>
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <FaCalendarAlt size={10} />
          {new Date(project.createdAt).toLocaleDateString()}
        </span>
      </div>

      <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
        {project.title}
      </h3>

      <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed mb-6 h-10">
        {project.description}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs border border-indigo-100">
            {project.student?.name?.charAt(0) || 'S'}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-700">{project.student?.name}</p>
            <p className="text-[10px] text-slate-400">Student</p>
          </div>
        </div>

        {project.files?.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg">
            <FaFileAlt size={10} />
            {project.files.length}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const Modal = ({ project, onClose, onApprove, onReject, onDownload }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col ring-1 ring-slate-900/5"
    >
      {/* Modal Header */}
      <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-start bg-white sticky top-0 z-10">
        <div className="pr-8">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-slate-800 leading-tight">{project.title}</h2>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase border ${project.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
              project.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                'bg-amber-50 text-amber-600 border-amber-100'
              }`}>
              {project.status}
            </span>
          </div>
          <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
            <FaClock size={12} /> Created {new Date(project.createdAt).toLocaleString()}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-all transform hover:rotate-90"
        >
          <FaTimesCircle size={24} />
        </button>
      </div>

      {/* Modal Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                <FaFileAlt className="text-indigo-500" /> Project Description
              </h3>
              <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 text-slate-700 leading-relaxed text-sm lg:text-base whitespace-pre-wrap">
                {project.description}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                <FaDownload className="text-indigo-500" /> Attachments ({project.files?.length || 0})
              </h3>
              {project.files && project.files.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                          <FaFileAlt size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-700 truncate">{file.originalName}</p>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">{file.category}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => onDownload(project._id, file._id, file.originalName)}
                        className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Download File"
                      >
                        <FaDownload size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-sm text-slate-400">No attachments found.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar (Right) */}
          <div className="space-y-6">
            <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">Involved Parties</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                    <FaUserGraduate />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase mb-0.5">Student</p>
                    <p className="text-sm font-bold text-slate-800">{project.student?.name}</p>
                    <p className="text-xs text-slate-500 break-all">{project.student?.email}</p>
                  </div>
                </div>

                <div className="w-full h-px bg-slate-100"></div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0">
                    <FaChalkboardTeacher />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase mb-0.5">Supervisor</p>
                    <p className="text-sm font-bold text-slate-800">{project.supervisor?.name || 'Not yet assigned'}</p>
                    <p className="text-xs text-slate-500 break-all">{project.supervisor?.email || '-'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            {project.status === 'Pending' && (
              <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-3">
                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wide mb-2">Review Actions</h3>
                <button
                  onClick={onApprove}
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                >
                  <FaCheckCircle /> Approve Proposal
                </button>
                <button
                  onClick={onReject}
                  className="w-full py-3 px-4 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <FaBan /> Reject Proposal
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Modal Footer */}
      <div className="px-8 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
        <button
          onClick={onClose}
          className="px-6 py-2.5 rounded-xl text-slate-600 font-semibold hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all"
        >
          Close Preview
        </button>
      </div>
    </motion.div>
  </div>
);

const ConfirmationModal = ({ type, title, onConfirm, onCancel }) => {
  const isApprove = type === 'approve';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
      >
        <div className={`p-6 flex flex-col items-center text-center border-b-4 ${isApprove ? 'border-emerald-500' : 'border-rose-500'}`}>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isApprove ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
            {isApprove ? <FaCheckCircle size={32} /> : <FaExclamationTriangle size={32} />}
          </div>

          <h3 className="text-xl font-bold text-slate-800 mb-2">
            {isApprove ? 'Approve Project?' : 'Reject Project?'}
          </h3>

          <p className="text-slate-500 text-sm leading-relaxed px-4">
            Are you sure you want to <strong>{isApprove ? 'approve' : 'reject'}</strong> the project <span className="text-slate-800 font-semibold">"{title}"</span>?
          </p>
        </div>

        <div className="p-4 bg-slate-50 grid grid-cols-2 gap-3">
          <button
            onClick={onCancel}
            className="py-2.5 px-4 bg-white border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`py-2.5 px-4 text-white font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 ${isApprove
              ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200'
              : 'bg-rose-500 hover:bg-rose-600 shadow-rose-200'
              }`}
          >
            Confirm {isApprove ? 'Approval' : 'Rejection'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectsPage;
