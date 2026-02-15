import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, Search, FileText, Download, Loader2 } from "lucide-react";
import { getAllProjects } from "../../store/slices/adminSlice";
import { downloadProjectFile } from "../../store/slices/projectSlice";

const ProjectFileModal = ({ isOpen, onClose, title, filterType }) => {
    const dispatch = useDispatch();
    const { projects, loading } = useSelector((state) => state.admin);
    const [searchQuery, setSearchQuery] = useState("");
    const [downloadingId, setDownloadingId] = useState(null);

    useEffect(() => {
        if (isOpen) {
            dispatch(getAllProjects());
        }
    }, [isOpen, dispatch]);

    const files = useMemo(() => {
        if (!projects) return [];

        let allFiles = projects.flatMap(project =>
            (project.files || []).map(file => ({
                ...file,
                projectName: project.title,
                studentName: project.student?.name || "Unknown",
                projectId: project._id,
                // If file doesn't have a category, assume 'Other'
                category: file.category || "Other"
            }))
        );

        // Filter by type if provided (e.g., 'Report')
        if (filterType) {
            allFiles = allFiles.filter(file => file.category === filterType);
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            allFiles = allFiles.filter(file =>
                (file.originalName && file.originalName.toLowerCase().includes(query)) ||
                (file.projectName && file.projectName.toLowerCase().includes(query)) ||
                (file.studentName && file.studentName.toLowerCase().includes(query))
            );
        }

        return allFiles;
    }, [projects, filterType, searchQuery]);

    const handleDownload = async (projectId, file) => {
        setDownloadingId(file._id || file.originalName);

        try {
            await dispatch(downloadProjectFile({
                projectId,
                fileId: file._id,
                fileName: file.originalName
            })).unwrap(); // Use unwrap to handle errors if needed
        } catch (error) {
            console.error("Download failed:", error);
        } finally {
            setDownloadingId(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-indigo-600" />
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition p-1 hover:bg-gray-100 rounded-full"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Search */}
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by file name, project, or student..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white shadow-sm transition-all"
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                            <Loader2 className="w-8 h-8 animate-spin mb-2 text-indigo-600" />
                            <p>Loading files...</p>
                        </div>
                    ) : files.length > 0 ? (
                        <div className="space-y-3">
                            {files.map((file, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md hover:border-indigo-100 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-lg ${file.category === 'Report' ? 'bg-amber-50 text-amber-600' :
                                            file.category === 'Presentation' ? 'bg-rose-50 text-rose-600' :
                                                file.category === 'Code' ? 'bg-blue-50 text-blue-600' :
                                                    'bg-indigo-50 text-indigo-600'
                                            }`}>
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                {file.originalName || "Untitled File"}
                                            </h3>
                                            <p className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                                                <span className="font-medium">{file.projectName}</span>
                                                <span>•</span>
                                                <span>{file.studentName}</span>
                                                <span>•</span>
                                                <span className="capitalize">{file.category}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleDownload(file.projectId, file)}
                                        disabled={downloadingId === (file._id || file.originalName)}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {downloadingId === (file._id || file.originalName) ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Download className="w-4 h-4" />
                                        )}
                                        Download
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-lg font-medium text-gray-900">No files found</p>
                            <p className="text-sm mt-1">Try adjusting your search filters</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-between items-center text-sm text-gray-500">
                    <span>Showing {files.length} {filterType ? filterType.toLowerCase() + 's' : 'files'}</span>
                    <button onClick={onClose} className="hover:text-gray-800 font-medium">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectFileModal;
