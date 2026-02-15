import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFeedback, fetchProject } from "../../store/slices/studentSlice";
import { Link } from "react-router-dom";
import {
  MessageSquare,
  ArrowLeft,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  Info,
  Loader2,
  Calendar
} from "lucide-react";

const FeedbackPage = () => {
  const dispatch = useDispatch();
  const { feedback, project, loading } = useSelector((state) => state.student);

  // Fetch project first, then feedback
  useEffect(() => {
    if (!project) {
      dispatch(fetchProject());
    }
  }, [dispatch, project]);

  useEffect(() => {
    if (project?._id) {
      dispatch(getFeedback(project._id));
    }
  }, [dispatch, project]);

  const formatDate = (dateString) => {
    if (!dateString) return "No Date";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFeedbackStyle = (type) => {
    switch (type) {
      case "Positive":
        return {
          bg: "bg-emerald-50",
          border: "border-emerald-200",
          icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
          titleColor: "text-emerald-800",
          badge: "bg-emerald-100 text-emerald-700"
        };
      case "Negative":
        return {
          bg: "bg-rose-50",
          border: "border-rose-200",
          icon: <AlertCircle className="w-5 h-5 text-rose-600" />,
          titleColor: "text-rose-800",
          badge: "bg-rose-100 text-rose-700"
        };
      default: // Neutral
        return {
          bg: "bg-indigo-50",
          border: "border-indigo-200",
          icon: <Info className="w-5 h-5 text-indigo-600" />,
          titleColor: "text-indigo-800",
          badge: "bg-indigo-100 text-indigo-700"
        };
    }
  };

  if (loading && !feedback) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="text-slate-500 font-medium">Loading feedback...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-800 pb-12">
      {/* Hero Header */}
      <div className="relative bg-slate-900 pb-24 pt-12 px-6 lg:px-8 overflow-hidden shadow-xl">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute right-0 top-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        </div>

        <div className="relative max-w-5xl mx-auto z-10">
          <Link to="/student-dashboard" className="inline-flex items-center gap-2 text-indigo-300 hover:text-white mb-6 transition-colors group">
            <div className="p-1.5 rounded-full bg-white/5 group-hover:bg-white/10 border border-white/10 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">Back to Dashboard</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-teal-500/20 rounded-xl border border-teal-500/30">
                  <MessageSquare className="w-6 h-6 text-teal-300" />
                </div>
                <span className="text-teal-300 font-bold uppercase tracking-wider text-xs">Project Feedback</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Supervisor Feedback
              </h1>
              <p className="text-slate-400 mt-2 text-lg max-w-2xl font-light">
                Review comments, suggestions, and guidance from your supervisor regarding your Final Year Project.
              </p>
            </div>

            {project && (
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 min-w-[200px]">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Project</p>
                <p className="text-white font-bold truncate max-w-[250px]">{project.title}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-8 -mt-16 relative z-20">
        {!project ? (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Active Project</h3>
            <p className="text-slate-500">You need to have an approved project to receive feedback.</p>
            <Link to="/student/submit-proposal" className="inline-block mt-4 text-indigo-600 font-bold hover:underline">
              Submit a Proposal
            </Link>
          </div>
        ) : feedback && feedback.length > 0 ? (
          <div className="space-y-6">
            {feedback.map((item, index) => {
              const styles = getFeedbackStyle(item.type);
              return (
                <div
                  key={index}
                  className={`bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-300`}
                >
                  <div className={`px-6 py-4 border-b border-slate-100 flex justify-between items-center ${styles.bg}`}>
                    <div className="flex items-center gap-3">
                      {styles.icon}
                      <h3 className={`font-bold text-lg ${styles.titleColor}`}>{item.title}</h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${styles.badge} border border-white/50`}>
                      {item.type}
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {item.message}
                    </div>

                    <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-50 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-700">
                          {item.supervisorId?.name || "Supervisor"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>{formatDate(item.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-16 text-center">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-10 h-10 text-indigo-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Feedback Yet</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Your supervisor hasn't provided any feedback on your project yet. Check back later or request a review.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;
