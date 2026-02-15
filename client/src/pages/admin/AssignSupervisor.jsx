import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, getAllProjects, assignSupervisor, getSupervisorRequests, approveSupervisorRequest, rejectSupervisorRequest } from "../../store/slices/adminSlice";
import {
  Users,
  GraduationCap,
  UserCheck,
  Search,
  Loader2,
  CheckCircle,
  AlertCircle,
  Briefcase,
  Mail,
  Clock,
  X,
  Check
} from "lucide-react";
import { toast } from "react-toastify";

const AssignSupervisor = () => {
  const dispatch = useDispatch();
  const { students, teachers, projects, supervisorRequests, loading } = useSelector((state) => state.admin);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [assigning, setAssigning] = useState(false);
  const [processedRequests, setProcessedRequests] = useState([]); // Track processed requests temporarily

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getAllProjects());
    dispatch(getSupervisorRequests());
  }, [dispatch]);

  // Get students with approved projects but no supervisor
  const eligibleStudents = useMemo(() => {
    if (!students || !projects) return [];

    // DEBUG: Show all students with their project status
    const allStudentsWithProjects = students.map(student => {
      const studentProject = projects.find(p => {
        const projectStudentId = typeof p.student === 'object' ? p.student?._id : p.student;
        return projectStudentId === student._id;
      });
      return {
        ...student,
        project: studentProject,
        debugInfo: {
          hasProject: !!studentProject,
          projectStatus: studentProject?.status || 'No Project',
          hasSupervisor: !!studentProject?.supervisor
        }
      };
    });

    // Filter for students without supervisors (regardless of project status for now)
    return allStudentsWithProjects.filter(student => {
      return student.project && !student.project.supervisor;
    });
  }, [students, projects]);

  // Get available teachers with capacity
  const availableTeachers = useMemo(() => {
    if (!teachers) return [];

    return teachers.map(teacher => {
      const assignedCount = teacher.assignedStudents?.length || 0;
      const maxStudents = teacher.maxStudents || 0;
      const hasCapacity = assignedCount < maxStudents;

      return {
        ...teacher,
        assignedCount,
        hasCapacity,
        capacityText: `${assignedCount}/${maxStudents}`
      };
    }).sort((a, b) => a.assignedCount - b.assignedCount); // Sort by least assigned first
  }, [teachers]);

  const filteredStudents = useMemo(() => {
    if (!searchQuery) return eligibleStudents;

    const query = searchQuery.toLowerCase();
    return eligibleStudents.filter(student =>
      student.name?.toLowerCase().includes(query) ||
      student.email?.toLowerCase().includes(query) ||
      student.project?.title?.toLowerCase().includes(query)
    );
  }, [eligibleStudents, searchQuery]);

  const handleAssign = async () => {
    if (!selectedStudent || !selectedSupervisor) {
      toast.error("Please select both student and supervisor");
      return;
    }

    const teacher = availableTeachers.find(t => t._id === selectedSupervisor);
    if (!teacher?.hasCapacity) {
      toast.error("Selected supervisor has reached maximum capacity");
      return;
    }

    setAssigning(true);
    try {
      await dispatch(assignSupervisor({
        studentId: selectedStudent,
        supervisorId: selectedSupervisor
      })).unwrap();

      // Reset selections
      setSelectedStudent(null);
      setSelectedSupervisor(null);

      // Refresh data
      dispatch(getAllUsers());
      dispatch(getAllProjects());
    } catch (error) {
      console.error("Assignment failed:", error);
    } finally {
      setAssigning(false);
    }
  };

  const handleApproveRequest = async (requestId) => {
    try {
      // Find the request before approving
      const request = supervisorRequests.find(r => r._id === requestId);

      await dispatch(approveSupervisorRequest(requestId)).unwrap();

      // Add to processed requests with approved status
      if (request) {
        setProcessedRequests(prev => [...prev, { ...request, processedStatus: 'approved' }]);

        // Remove from processed list after 5 seconds
        setTimeout(() => {
          setProcessedRequests(prev => prev.filter(r => r._id !== requestId));
        }, 5000);
      }

      // Refresh data
      dispatch(getAllUsers());
      dispatch(getAllProjects());
      dispatch(getSupervisorRequests());
    } catch (error) {
      console.error("Failed to approve request:", error);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      // Find the request before rejecting
      const request = supervisorRequests.find(r => r._id === requestId);

      await dispatch(rejectSupervisorRequest({ requestId, reason: "" })).unwrap();

      // Add to processed requests with rejected status
      if (request) {
        setProcessedRequests(prev => [...prev, { ...request, processedStatus: 'rejected' }]);

        // Remove from processed list after 5 seconds
        setTimeout(() => {
          setProcessedRequests(prev => prev.filter(r => r._id !== requestId));
        }, 5000);
      }

      dispatch(getSupervisorRequests());
    } catch (error) {
      console.error("Failed to reject request:", error);
    }
  };

  if (loading && (!students || !teachers || !projects)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-800 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-7 h-7 text-indigo-600" />
            Assign Supervisors
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Match students with available supervisors for their approved projects
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Students Awaiting Supervisor"
            value={eligibleStudents.length}
            icon={<GraduationCap className="w-6 h-6 text-amber-600" />}
            bg="bg-amber-50"
            border="border-amber-100"
          />
          <StatCard
            title="Available Teachers"
            value={availableTeachers.filter(t => t.hasCapacity).length}
            icon={<Users className="w-6 h-6 text-emerald-600" />}
            bg="bg-emerald-50"
            border="border-emerald-100"
          />
          <StatCard
            title="Total Assignments"
            value={availableTeachers.reduce((sum, t) => sum + t.assignedCount, 0)}
            icon={<CheckCircle className="w-6 h-6 text-blue-600" />}
            bg="bg-blue-50"
            border="border-blue-100"
          />
        </div>

        {/* Pending & Processed Supervisor Requests */}
        {((supervisorRequests && supervisorRequests.length > 0) || processedRequests.length > 0) && (
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-indigo-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 rounded-lg">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Supervisor Requests</h2>
                  <p className="text-sm text-slate-600">Review and approve student requests</p>
                </div>
              </div>
              {supervisorRequests && supervisorRequests.length > 0 && (
                <div className="px-3 py-1 bg-indigo-600 text-white text-sm font-bold rounded-full">
                  {supervisorRequests.length} Pending
                </div>
              )}
            </div>

            <div className="space-y-4">
              {/* Show processed requests first (approved/rejected) */}
              {processedRequests.map((request) => (
                <div
                  key={request._id}
                  className={`bg-white rounded-xl border-2 p-5 shadow-lg transition-all ${request.processedStatus === 'approved'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-rose-500 bg-rose-50'
                    }`}
                >
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-white ${request.processedStatus === 'approved' ? 'bg-emerald-600' : 'bg-rose-600'
                      }`}>
                      {request.processedStatus === 'approved' ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          <span>REQUEST APPROVED</span>
                        </>
                      ) : (
                        <>
                          <X className="w-5 h-5" />
                          <span>REQUEST REJECTED</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">Disappearing in 5s...</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Student Info */}
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Student</p>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <GraduationCap className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{request.student?.name}</p>
                          <p className="text-sm text-slate-500">{request.student?.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Supervisor Info */}
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Supervisor</p>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 rounded-lg">
                          <Users className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{request.supervisor?.name}</p>
                          <p className="text-sm text-slate-500">{request.supervisor?.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Show pending requests */}
              {supervisorRequests && supervisorRequests.map((request) => (
                <div
                  key={request._id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Student Info */}
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Student</p>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <GraduationCap className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{request.student?.name}</p>
                          <p className="text-sm text-slate-500">{request.student?.email}</p>
                          <p className="text-xs text-slate-400 mt-1">{request.student?.department}</p>
                        </div>
                      </div>
                    </div>

                    {/* Supervisor Info */}
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Requested Supervisor</p>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 rounded-lg">
                          <Users className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{request.supervisor?.name}</p>
                          <p className="text-sm text-slate-500">{request.supervisor?.email}</p>
                          <p className="text-xs text-slate-400 mt-1">{request.supervisor?.department}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Message</p>
                    <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
                      {request.message}
                    </p>
                  </div>

                  {/* Request Date */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                    <Clock className="w-4 h-4" />
                    <span>Requested {new Date(request.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApproveRequest(request._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors shadow-sm"
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg transition-colors shadow-sm"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Students List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-slate-50">
              <h2 className="font-bold text-slate-900 flex items-center gap-2 mb-3">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                Students Without Supervisors
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search students or projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
            </div>

            <div className="max-h-[600px] overflow-y-auto">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <div
                    key={student._id}
                    onClick={() => setSelectedStudent(student._id)}
                    className={`p-4 border-b border-slate-100 cursor-pointer transition-all ${selectedStudent === student._id
                      ? 'bg-indigo-50 border-l-4 border-l-indigo-600'
                      : 'hover:bg-slate-50'
                      }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                          {student.name}
                          {selectedStudent === student._id && (
                            <CheckCircle className="w-4 h-4 text-indigo-600" />
                          )}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <Mail className="w-3 h-3" />
                          {student.email}
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-sm">
                          <Briefcase className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-700 font-medium truncate">
                            {student.project?.title || "No Project"}
                          </span>
                        </div>
                        {/* DEBUG: Show project status */}
                        {student.debugInfo && (
                          <div className="mt-2 text-xs">
                            <span className={`px-2 py-0.5 rounded-full ${student.debugInfo.projectStatus === 'Approved'
                              ? 'bg-green-100 text-green-700'
                              : student.debugInfo.projectStatus === 'Pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-slate-100 text-slate-600'
                              }`}>
                              Status: {student.debugInfo.projectStatus}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-slate-400">
                  <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No students awaiting supervisor assignment</p>
                </div>
              )}
            </div>
          </div>

          {/* Teachers List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-slate-50">
              <h2 className="font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                Available Supervisors
              </h2>
            </div>

            <div className="max-h-[600px] overflow-y-auto">
              {availableTeachers.length > 0 ? (
                availableTeachers.map((teacher) => (
                  <div
                    key={teacher._id}
                    onClick={() => teacher.hasCapacity && setSelectedSupervisor(teacher._id)}
                    className={`p-4 border-b border-slate-100 transition-all ${!teacher.hasCapacity
                      ? 'opacity-50 cursor-not-allowed bg-slate-50'
                      : selectedSupervisor === teacher._id
                        ? 'bg-emerald-50 border-l-4 border-l-emerald-600 cursor-pointer'
                        : 'hover:bg-slate-50 cursor-pointer'
                      }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                          {teacher.name}
                          {selectedSupervisor === teacher._id && (
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                          )}
                          {!teacher.hasCapacity && (
                            <AlertCircle className="w-4 h-4 text-rose-500" />
                          )}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <Mail className="w-3 h-3" />
                          {teacher.email}
                        </p>
                        <div className="mt-2 flex items-center gap-3">
                          <span className="text-xs text-slate-600">
                            <span className="font-semibold">{teacher.department || "N/A"}</span>
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${teacher.hasCapacity
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-rose-100 text-rose-700'
                            }`}>
                            {teacher.capacityText} Students
                          </span>
                        </div>
                        {teacher.experties && teacher.experties.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {teacher.experties.slice(0, 3).map((exp, idx) => (
                              <span key={idx} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                                {exp}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-slate-400">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No teachers available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Assign Button */}
        <div className="flex justify-center">
          <button
            onClick={handleAssign}
            disabled={!selectedStudent || !selectedSupervisor || assigning}
            className={`px-8 py-3 rounded-xl font-semibold text-white shadow-lg transition-all transform ${!selectedStudent || !selectedSupervisor || assigning
              ? 'bg-slate-300 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-indigo-200'
              }`}
          >
            {assigning ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Assigning...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                Assign Supervisor
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, bg, border }) => (
  <div className={`p-6 rounded-2xl ${bg} border ${border} flex items-center gap-4`}>
    <div className="p-3 bg-white rounded-xl shadow-sm">{icon}</div>
    <div>
      <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{title}</p>
      <h3 className="text-2xl font-extrabold text-slate-900">{value}</h3>
    </div>
  </div>
);

export default AssignSupervisor;
