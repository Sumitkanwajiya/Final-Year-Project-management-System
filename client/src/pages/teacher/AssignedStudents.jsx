import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAssignedStudents,
  markAsComplete,
  addFeedback
} from "../../store/slices/teacherSlice";
import {
  Users,
  BookOpen,
  CheckCircle,
  MessageSquare,
  Search,
  ExternalLink,
  AlertCircle,
  MoreHorizontal,
  GraduationCap,
  Calendar,
  Mail,
  Check
} from "lucide-react";
import { Link } from "react-router-dom";
import ConfirmModal from "../../components/modal/ConfirmModal";

const AssignedStudents = () => {
  const dispatch = useDispatch();
  const { assignedStudents, loading, error } = useSelector((state) => state.teacher);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    title: "",
    message: "",
    type: "Correction",
    priority: "Medium"
  });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, projectId: null });

  useEffect(() => {
    dispatch(getAssignedStudents());
  }, [dispatch]);

  const handleMarkComplete = (projectId) => {
    setConfirmModal({ isOpen: true, projectId });
  };

  const executeMarkComplete = async () => {
    if (confirmModal.projectId) {
      await dispatch(markAsComplete(confirmModal.projectId));
      setConfirmModal({ isOpen: false, projectId: null });
    }
  };

  const handleOpenFeedbackModal = (project) => {
    setSelectedProject(project);
    setFeedbackData({ title: "", message: "", type: "Correction", priority: "Medium" });
    setIsFeedbackModalOpen(true);
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!selectedProject) return;

    try {
      await dispatch(addFeedback({
        projectId: selectedProject._id,
        feedback: feedbackData
      })).unwrap();
      setIsFeedbackModalOpen(false);
      setFeedbackData({ title: "", message: "", type: "Correction", priority: "Medium" });
    } catch (error) {
      // Toast handled in slice
    }
  };

  const filteredStudents = assignedStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.project && typeof student.project === 'object' && student.project.title && student.project.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadge = (status) => {
    const styles = {
      Approved: "bg-green-100 text-green-700 border-green-200",
      Completed: "bg-blue-100 text-blue-700 border-blue-200",
      Pending: "bg-amber-100 text-amber-700 border-amber-200",
      Rejected: "bg-red-100 text-red-700 border-red-200",
    };
    return styles[status] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 space-y-6 md:space-y-8 pb-24 md:pb-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-600 to-violet-600 p-5 md:p-8 rounded-2xl shadow-lg text-white">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <GraduationCap className="w-6 h-6 md:w-8 md:h-8 opacity-90" />
            Assigned Students
          </h1>
          <p className="mt-1 md:mt-2 text-indigo-100 opacity-90 text-sm md:text-base max-w-xl">
            Monitor progress and review projects.
          </p>
        </div>

        <div className="relative group w-full md:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-indigo-300 group-focus-within:text-white transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search student or project..."
            className="pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all w-full md:w-80 backdrop-blur-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Content Section */}
      {loading && assignedStudents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <p className="mt-4 text-gray-500 font-medium">Loading your students...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 rounded-xl p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Failed to load data</h3>
          <p className="text-gray-600 mt-1">{error}</p>
          <button
            onClick={() => dispatch(getAssignedStudents())}
            className="mt-4 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            Try Again
          </button>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">No students found</h3>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">
            {searchTerm ? "No results match your search criteria." : "You haven't been assigned any students yet. Manage pending requests to get started."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredStudents.map((student) => {
            let project = null;
            if (student.project) {
              if (Array.isArray(student.project) && student.project.length > 0) {
                project = student.project[0];
              } else if (typeof student.project === 'object' && student.project._id) {
                project = student.project;
              }
            }

            return (
              <div key={student._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 group">
                <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8">

                  {/* Student Profile */}
                  <div className="lg:w-1/3 flex flex-col gap-4 border-b lg:border-b-0 lg:border-r border-gray-100 pb-6 lg:pb-0 lg:pr-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-200">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{student.name}</h3>
                        <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                          <Mail className="w-3.5 h-3.5" />
                          {student.email}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mt-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 flex items-center gap-2">
                          <Calendar className="w-4 h-4" /> Joined
                        </span>
                        <span className="font-medium text-gray-900">{new Date(student.createdAt).toLocaleDateString()}</span>
                      </div>
                      {/* Can add more stats here */}
                    </div>

                    {!project && (
                      <div className="mt-auto bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
                        <BookOpen className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No project assigned yet</p>
                      </div>
                    )}
                  </div>

                  {/* Project Details */}
                  {project && (
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-lg leading-tight">{project.title}</h4>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border mt-2 ${getStatusBadge(project.status)}`}>
                              {project.status}
                            </span>
                          </div>
                        </div>
                        <Link
                          to={`/project/${project._id}`}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View Full Details"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </Link>
                      </div>

                      <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">
                        {project.description.length > 200 ? `${project.description.slice(0, 200)}...` : project.description}
                      </p>

                      <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100 mt-auto">
                        {project.status !== "Completed" ? (
                          <>
                            <button
                              onClick={() => handleOpenFeedbackModal(project)}
                              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                            >
                              <MessageSquare className="w-4 h-4 text-amber-500" />
                              Provide Feedback
                            </button>
                            <button
                              onClick={() => handleMarkComplete(project._id)}
                              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Mark as Complete
                            </button>
                          </>
                        ) : (
                          <div className="w-full bg-green-50 border border-green-100 rounded-lg p-3 flex items-center gap-3 text-green-700 text-sm font-medium">
                            <CheckCircle className="w-5 h-5" />
                            Project successfully completed
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modern Feedback Modal */}
      {isFeedbackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsFeedbackModalOpen(false)}
          ></div>

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100">
            <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Project Feedback</h3>
                <p className="text-sm text-gray-500">Send notes to {selectedProject?.student?.name || 'student'}</p>
              </div>
              <button
                onClick={() => setIsFeedbackModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitFeedback} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Feedback Title</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-900 placeholder-gray-400"
                  placeholder="e.g., Chapter 1 Review"
                  value={feedbackData.title}
                  onChange={(e) => setFeedbackData({ ...feedbackData, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Feedback Type</label>
                  <div className="relative">
                    <select
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none bg-white"
                      value={feedbackData.type}
                      onChange={(e) => setFeedbackData({ ...feedbackData, type: e.target.value })}
                    >
                      <option value="Correction">❗ Correction</option>
                      <option value="Suggestion">💡 Suggestion</option>
                      <option value="Appreciation">👏 Appreciation</option>
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Priority</label>
                  <div className="relative">
                    <select
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none bg-white"
                      value={feedbackData.priority}
                      onChange={(e) => setFeedbackData({ ...feedbackData, priority: e.target.value })}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">🔥 High</option>
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message</label>
                <textarea
                  required
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none text-gray-900 placeholder-gray-400"
                  placeholder="Enter detailed feedback here..."
                  value={feedbackData.message}
                  onChange={(e) => setFeedbackData({ ...feedbackData, message: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFeedbackModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 focus:outline-none transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg shadow-indigo-200 transition-all hover:scale-105"
                >
                  Send Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, projectId: null })}
        onConfirm={executeMarkComplete}
        title="Complete Project?"
        message="Are you sure you want to mark this project as complete? This will finalize the project and notify the student. This action cannot be undone."
        variant="success"
        confirmText="Yes, Complete Project"
      />
    </div>
  );
};

export default AssignedStudents;
