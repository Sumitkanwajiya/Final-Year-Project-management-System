import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createDeadline } from "../../store/slices/deadlineSlice";
import { getAllProjects } from "../../store/slices/adminSlice"; // Assuming this exists
import { X, Calendar, Type, Briefcase, Plus } from "lucide-react";

const CreateDeadlineModal = ({ isOpen, onClose, preSelectedProjectId }) => {
    const dispatch = useDispatch();
    const { projects } = useSelector((state) => state.admin);

    const [formData, setFormData] = useState({
        name: "",
        dueDate: "",
        projectId: "",
    });

    useEffect(() => {
        if (isOpen) {
            dispatch(getAllProjects());
            // Fully reset form when opening
            setFormData({
                name: "",
                dueDate: "",
                projectId: preSelectedProjectId || ""
            });
        }
    }, [isOpen, dispatch, preSelectedProjectId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.projectId) {
            // Should be handled by required attribute, but good safety
            return;
        }

        dispatch(createDeadline({
            id: formData.projectId,
            name: formData.name,
            dueDate: formData.dueDate
        })).then((result) => {
            if (result?.meta?.requestStatus === 'fulfilled') {
                onClose();
                setFormData({ name: "", dueDate: "", projectId: "" });
            }
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in p-4">
            <div className="relative w-full md:w-auto md:max-w-md bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 ring-1 ring-slate-900/5">
                {/* Header */}
                <div className="flex items-center justify-between p-5 md:p-6 border-b border-slate-100 shrink-0">
                    <div>
                        <h2 className="text-lg md:text-xl font-bold text-slate-900">Set New Deadline</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Assign a due date to a project</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100 active:bg-slate-200"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 md:p-6 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                <Type className="w-4 h-4 text-indigo-500" /> Deadline Title
                            </label>
                            <input
                                type="text"
                                name="name"
                                placeholder="e.g. Final Proposal Submission"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm bg-slate-50/50 focus:bg-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-indigo-500" /> Linked Project
                            </label>
                            <div className="relative">
                                <select
                                    name="projectId"
                                    value={formData.projectId}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-slate-50/50 focus:bg-white appearance-none text-sm truncate pr-10"
                                    required
                                >
                                    <option value="">Select a project...</option>
                                    {projects && projects.map(project => (
                                        <option key={project._id} value={project._id}>
                                            {project.title} • {project.student?.name || 'Unknown'}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-indigo-500" /> Due Date
                            </label>
                            <input
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm bg-slate-50/50 focus:bg-white"
                                required
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                Create Deadline
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateDeadlineModal;
