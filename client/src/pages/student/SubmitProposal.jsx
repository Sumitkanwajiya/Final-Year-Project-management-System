import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { submitProposal } from "../../store/slices/studentSlice";
import { Send, FileText, Type, CheckCircle, Sparkles, X } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const SubmitProposal = () => {
  const dispatch = useDispatch();

  // State for form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  // Loading and Success states
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resultAction = await dispatch(submitProposal(formData));
      if (submitProposal.fulfilled.match(resultAction)) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error("Failed to submit proposal:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 transition-all duration-500 ease-in-out">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 md:p-10 text-center border border-slate-100 animate-in fade-in zoom-in duration-300">
          <div className="mx-auto w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 ring-8 ring-green-50/50">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Proposal Received!</h2>
          <p className="text-slate-600 mb-8 text-lg leading-relaxed">
            Your project proposal has been successfully submitted. Your supervisor will review it shortly.
          </p>
          <div className="space-y-3">
            <Link
              to="/student"
              className="block w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Go to Dashboard
            </Link>
            <button
              onClick={() => setShowModal(true)}
              className="block w-full py-3.5 px-6 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-200 transition-all duration-200"
            >
              View Submission Details
            </button>
          </div>
        </div>

        {/* Details Modal */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl flex flex-col ring-1 ring-slate-900/5"
              >
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="text-xl font-bold text-slate-800">Submission Details</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-8 overflow-y-auto space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Project Title</h4>
                    <p className="text-lg font-bold text-slate-900 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      {formData.title}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h4>
                    <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 whitespace-pre-wrap text-sm">
                      {formData.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 mt-4">
                    <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-bold uppercase tracking-wider border border-yellow-100">
                      Status: Pending Review
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Submitted just now
                    </span>
                  </div>
                </div>

                <div className="p-6 border-t border-slate-100 flex justify-end bg-slate-50/50">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors shadow-sm"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-4 md:p-8 font-sans text-slate-800 pb-20 md:pb-8">
      <div className="w-full max-w-5xl grid md:grid-cols-5 bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">

        {/* Left Side - Visual/Context */}
        <div className="hidden md:flex md:col-span-2 bg-slate-900 text-white flex-col justify-between p-10 relative overflow-hidden">
          {/* Abstract Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
            <div className="absolute right-0 top-0 w-[300px] h-[300px] bg-blue-500 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute left-0 bottom-0 w-[200px] h-[200px] bg-indigo-500 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2"></div>
          </div>

          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-6 border border-white/10">
              <Sparkles className="w-6 h-6 text-blue-200" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">Final Year Project</h2>
            <p className="text-slate-300 leading-relaxed text-sm md:text-base">
              Submit your innovative ideas and take the first step towards your academic masterpiece.
            </p>
          </div>

          <div className="relative z-10 text-xs font-medium text-slate-500 uppercase tracking-widest">
            <p>© 2026 FYP Management</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="md:col-span-3 p-5 md:p-8 lg:p-12">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Submit Proposal</h1>
            <p className="text-slate-500 mt-1">Fill in the details below to propose your project.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Title Input */}
            <div className="group">
              <label htmlFor="title" className="block text-sm font-bold text-slate-700 mb-2 transition-colors group-focus-within:text-blue-600">
                Project Title
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Type className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., AI-Powered Traffic Management System"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 outline-none text-slate-800 placeholder-slate-400 font-medium"
                />
              </div>
            </div>

            {/* Description Textarea */}
            <div className="group">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="description" className="block text-sm font-bold text-slate-700 transition-colors group-focus-within:text-blue-600">
                  Project Description
                </label>
                <span className={`text-xs font-bold ${formData.description.length > 1800 ? 'text-orange-500' : 'text-slate-400'}`}>
                  {formData.description.length} / 2000
                </span>
              </div>
              <div className="relative">
                <div className="absolute top-4 left-4 pointer-events-none">
                  <FileText className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <textarea
                  id="description"
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  rows="6"
                  maxLength={2000}
                  placeholder="Describe the problem, your proposed solution, technologies used, and expected outcomes..."
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 outline-none text-slate-800 placeholder-slate-400 resize-none leading-relaxed text-sm"
                ></textarea>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-3 transform hover:-translate-y-0.5 active:translate-y-0 ${loading ? 'opacity-70 cursor-not-allowed hover:translate-y-0 shadow-none' : ''}`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Proposal</span>
                    <Send className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitProposal;
