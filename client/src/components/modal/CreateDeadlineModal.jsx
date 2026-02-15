import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createDeadline } from "../../store/slices/deadlineSlice";
import { getAllProjects } from "../../store/slices/adminSlice"; // Assuming this exists
import { X, Calendar, Type, Briefcase } from "lucide-react";

const CreateDeadlineModal = ({ isOpen, onClose }) => {
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
        }
    }, [isOpen, dispatch]);

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
            if (result.meta.requestStatus === 'fulfilled') {
                onClose();
                setFormData({ name: "", dueDate: "", projectId: "" });
            }
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-md p-6 bg-white rounded-xl shadow-2xl transform transition-all scale-100">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Set New Deadline</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <Type className="w-4 h-4 text-gray-400" /> Deadline Title
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="e.g. Final Proposal Submission"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-gray-400" /> Project
                        </label>
                        <select
                            name="projectId"
                            value={formData.projectId}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white"
                            required
                        >
                            <option value="">Select a project...</option>
                            {projects && projects.map(project => (
                                <option key={project._id} value={project._id}>
                                    {project.title} ({project.student?.name || 'Unknown'})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" /> Due Date
                        </label>
                        <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2"
                    >
                        Create Deadline
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateDeadlineModal;
