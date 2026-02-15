import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRequests, acceptRequest, rejectRequest } from "../../store/slices/teacherSlice";
import {
  Clock,
  Mail,
  User,
  CheckCircle,
  XCircle,
  Loader2,
  UserCheck,
  AlertCircle,
  Calendar,
  Search,
  Filter
} from "lucide-react";
import { toast } from "react-toastify";
import ConfirmationModal from "../../components/ConfirmationModal";

const PendingRequests = () => {
  const dispatch = useDispatch();
  const { pendingRequests, loading } = useSelector((state) => state.teacher);
  const [processingId, setProcessingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null, // 'accept' or 'reject'
    requestId: null,
    studentName: null
  });

  useEffect(() => {
    dispatch(getRequests());
  }, [dispatch]);

  const handleAccept = async (requestId, studentName) => {
    setModalState({
      isOpen: true,
      type: 'accept',
      requestId,
      studentName
    });
  };

  const handleReject = async (requestId, studentName) => {
    setModalState({
      isOpen: true,
      type: 'reject',
      requestId,
      studentName
    });
  };

  const confirmAction = async () => {
    const { type, requestId } = modalState;
    setProcessingId(requestId);

    try {
      if (type === 'accept') {
        await dispatch(acceptRequest(requestId)).unwrap();
        toast.success("Request accepted successfully!");
      } else {
        await dispatch(rejectRequest(requestId)).unwrap();
        toast.success("Request rejected successfully!");
      }
    } catch (error) {
      // Show the actual error message from backend
      const errorMessage = error.message || `Failed to ${type} request`;
      toast.error(errorMessage);
    } finally {
      setProcessingId(null);
    }
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      type: null,
      requestId: null,
      studentName: null
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter and search logic
  const filteredRequests = useMemo(() => {
    let filtered = [...pendingRequests];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((request) => {
        const studentName = request.student?.name?.toLowerCase() || "";
        const studentEmail = request.student?.email?.toLowerCase() || "";
        return studentName.includes(query) || studentEmail.includes(query);
      });
    }

    // Apply date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      filtered = filtered.filter((request) => {
        const requestDate = new Date(request.createdAt);

        switch (dateFilter) {
          case "today":
            return requestDate >= today;
          case "week":
            return requestDate >= weekAgo;
          case "month":
            return requestDate >= monthAgo;
          case "older":
            return requestDate < monthAgo;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [pendingRequests, searchQuery, dateFilter]);

  if (loading && !pendingRequests.length) {
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
            <div className="p-2 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl">
              <Clock className="w-8 h-8 text-white" />
            </div>
            Pending Supervisor Requests
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            Review and manage student supervisor requests
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 space-y-6">
        {/* Stats Summary */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm">
              <UserCheck className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-900 uppercase tracking-wider">
                Total Pending Requests
              </p>
              <p className="text-3xl font-extrabold text-amber-600">
                {pendingRequests.length}
              </p>
              {searchQuery || dateFilter !== "all" ? (
                <p className="text-xs text-amber-700 mt-1">
                  ({filteredRequests.length} shown)
                </p>
              ) : null}
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search by student name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Filter className="w-5 h-5 text-slate-400" />
              </div>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="pl-12 pr-10 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all appearance-none bg-white cursor-pointer min-w-[200px]"
              >
                <option value="all">All Requests</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="older">Older than Month</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchQuery || dateFilter !== "all") && (
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span className="text-sm text-slate-600 font-medium">Active filters:</span>
              {searchQuery && (
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold flex items-center gap-1">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery("")} className="hover:text-indigo-900">
                    <XCircle className="w-3 h-3" />
                  </button>
                </span>
              )}
              {dateFilter !== "all" && (
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold flex items-center gap-1">
                  Date: {dateFilter.charAt(0).toUpperCase() + dateFilter.slice(1)}
                  <button onClick={() => setDateFilter("all")} className="hover:text-amber-900">
                    <XCircle className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setSearchQuery("");
                  setDateFilter("all");
                }}
                className="text-xs text-slate-500 hover:text-slate-700 underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Requests Grid */}
        {filteredRequests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map((request) => (
              <RequestCard
                key={request._id}
                request={request}
                onAccept={handleAccept}
                onReject={handleReject}
                isProcessing={processingId === request._id}
                formatDate={formatDate}
              />
            ))}
          </div>
        ) : (
          <EmptyState searchQuery={searchQuery} dateFilter={dateFilter} />
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={confirmAction}
        title={modalState.type === 'accept' ? 'Accept Supervisor Request' : 'Reject Supervisor Request'}
        message={modalState.type === 'accept'
          ? 'Are you sure you want to accept the supervisor request from'
          : 'Are you sure you want to reject the supervisor request from'}
        confirmText={modalState.type === 'accept' ? 'Accept' : 'Reject'}
        cancelText="Cancel"
        type={modalState.type}
        studentName={modalState.studentName}
      />
    </div>
  );
};

// Request Card Component
const RequestCard = ({ request, onAccept, onReject, isProcessing, formatDate }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <User className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-900 truncate">
              {request.student?.name || "Unknown Student"}
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <Mail className="w-3 h-3" />
              <span className="truncate">{request.student?.email || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="px-6 py-4 space-y-3">
        {/* Request Date */}
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="font-medium">Requested:</span>
          <span className="text-slate-500">{formatDate(request.createdAt)}</span>
        </div>

        {/* Status Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending Review
          </div>

          {/* Project Status Badge */}
          {request.projectStatus === "Approved" ? (
            <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Project Approved
            </div>
          ) : request.projectStatus === "Pending" ? (
            <div className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Project Pending
            </div>
          ) : request.projectStatus === "Rejected" ? (
            <div className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold flex items-center gap-1">
              <XCircle className="w-3 h-3" />
              Project Rejected
            </div>
          ) : (
            <div className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              No Project
            </div>
          )}
        </div>
      </div>

      {/* Card Footer - Action Buttons */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex gap-3">
        <button
          onClick={() => onAccept(request._id, request.student?.name)}
          disabled={isProcessing}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold text-sm hover:from-emerald-700 hover:to-green-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CheckCircle className="w-4 h-4" />
          )}
          Accept
        </button>
        <button
          onClick={() => onReject(request._id, request.student?.name)}
          disabled={isProcessing}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-semibold text-sm hover:from-red-700 hover:to-rose-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <XCircle className="w-4 h-4" />
          )}
          Reject
        </button>
      </div>
    </div>
  );
};

// Empty State Component
const EmptyState = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
      <div className="max-w-md mx-auto space-y-4">
        <div className="p-4 bg-slate-100 rounded-full w-fit mx-auto">
          <AlertCircle className="w-12 h-12 text-slate-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">No Pending Requests</h3>
        <p className="text-slate-500">
          You don't have any pending supervisor requests at the moment.
          New requests from students will appear here.
        </p>
      </div>
    </div>
  );
};

export default PendingRequests;
