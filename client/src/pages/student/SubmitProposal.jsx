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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center p-6 transform transition-all duration-500 ease-in-out">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-10 text-center border border-gray-100 animate-fade-in-up">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Proposal Received!</h2>
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">
            Your project proposal has been successfully submitted. Your supervisor will review it shortly.
          </p>
          <div className="space-y-4">
            <Link
              to="/student"
              className="block w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-0.5"
            >
              Go to Dashboard
            </Link>
            <button
              onClick={() => setShowModal(true)}
              className="block w-full py-3.5 px-6 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border border-gray-200 transition-all duration-200"
            >
              View Submission Details
            </button>
          </div>
        </div>

        {/* Details Modal */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl flex flex-col"
              >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <h3 className="text-xl font-bold text-gray-800">Submission Details</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-8 overflow-y-auto space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Project Title</h4>
                    <p className="text-lg font-semibold text-gray-900 bg-gray-50 p-4 rounded-lg border border-gray-100">
                      {formData.title}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Description</h4>
                    <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100 whitespace-pre-wrap">
                      {formData.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium border border-yellow-200">
                      Status: Pending Review
                    </span>
                    <span className="text-sm text-gray-400">
                      Submitted just now
                    </span>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2.5 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg transition-colors"
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 lg:p-8">
      <div className="w-full max-w-4xl grid md:grid-cols-5 bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">

        {/* Left Side - Visual/Context */}
        <div className="hidden md:flex md:col-span-2 bg-indigo-600 text-white flex-col justify-between p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
            </svg>
          </div>

          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-6">
              <Sparkles className="w-6 h-6 text-indigo-100" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Final Year Project</h2>
            <p className="text-indigo-200 leading-relaxed">
              Submit your innovative ideas and take the first step towards your academic masterpiece.
            </p>
          </div>

          <div className="relative z-10 text-sm opacity-80">
            <p>© 2026 FYP Management</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="md:col-span-3 p-8 lg:p-12">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Submit Proposal</h1>
            <p className="text-gray-500 mt-1">Fill in the details below to propose your project.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Title Input */}
            <div className="group">
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-indigo-600">
                Project Title
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Type className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., AI-Powered Traffic Management System"
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 outline-none text-gray-800 placeholder-gray-400 font-medium"
                />
              </div>
            </div>

            {/* Description Textarea */}
            <div className="group">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 transition-colors group-focus-within:text-indigo-600">
                  Project Description
                </label>
                <span className={`text-xs font-medium ${formData.description.length > 1800 ? 'text-orange-500' : 'text-gray-400'}`}>
                  {formData.description.length} / 2000
                </span>
              </div>
              <div className="relative">
                <div className="absolute top-4 left-4 pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
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
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 outline-none text-gray-800 placeholder-gray-400 resize-none leading-relaxed"
                ></textarea>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-indigo-500/40 transition-all duration-300 flex items-center justify-center gap-3 transform hover:-translate-y-0.5 active:translate-y-0 ${loading ? 'opacity-70 cursor-not-allowed hover:translate-y-0 shadow-none' : ''}`}
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
