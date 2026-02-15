import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateTeacher } from "../../store/slices/adminSlice";
import { X } from "lucide-react";

const EditTeacher = ({ setIsOpen, teacher }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        department: "",
        experties: "",
        maxStudents: "",
    });

    useEffect(() => {
        if (teacher) {
            setFormData({
                name: teacher.name || "",
                email: teacher.email || "",
                department: teacher.department || "",
                experties: Array.isArray(teacher.experties) ? teacher.experties.join(", ") : teacher.experties || "",
                maxStudents: teacher.maxStudents || "",
            });
        }
    }, [teacher]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateTeacher({ id: teacher._id, data: formData })).then(() => {
            setIsOpen(false);
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-md p-6 bg-white rounded-xl shadow-2xl transform transition-all scale-100 max-h-[90vh] overflow-y-auto">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Edit Teacher</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="e.g. Jane Doe"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="e.g. jane@university.edu"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                        <input
                            type="text"
                            name="department"
                            placeholder="e.g. Computer Science"
                            value={formData.department}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expertise</label>
                            <input
                                type="text"
                                name="experties"
                                placeholder="e.g. AI, Web Dev"
                                value={formData.experties}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">Comma separated</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Max Students</label>
                            <input
                                type="number"
                                name="maxStudents"
                                placeholder="e.g. 5"
                                value={formData.maxStudents}
                                onChange={handleChange}
                                max="6"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all transform active:scale-95"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditTeacher;
