import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProjectFiles, downloadFile } from "../../store/slices/teacherSlice";
import {
  FileText,
  Image as ImageIcon,
  Code,
  Download,
  Search,
  FolderOpen,
  User,
  File,
  Loader2,
  FileArchive
} from "lucide-react";
import { toast } from "react-toastify";

const TeacherFiles = () => {
  const dispatch = useDispatch();
  const { files, loading, error } = useSelector((state) => state.teacher);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getProjectFiles());
  }, [dispatch]);



  const getFileIcon = (fileName) => {
    const ext = fileName?.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return <ImageIcon className="w-8 h-8 text-purple-600" />;
    if (['pdf'].includes(ext)) return <FileText className="w-8 h-8 text-blue-600" />;
    if (['doc', 'docx'].includes(ext)) return <FileText className="w-8 h-8 text-blue-600" />;
    if (['xls', 'xlsx', 'csv'].includes(ext)) return <FileText className="w-8 h-8 text-green-600" />;
    if (['ppt', 'pptx'].includes(ext)) return <FileText className="w-8 h-8 text-red-600" />;
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return <FileArchive className="w-8 h-8 text-green-600" />;
    if (['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'html', 'css', 'json'].includes(ext)) return <Code className="w-8 h-8 text-yellow-600" />;
    return <File className="w-8 h-8 text-gray-500" />;
  };

  const getFileCategory = (fileName) => {
    const ext = fileName?.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(ext)) return "PDF";
    if (['ppt', 'pptx'].includes(ext)) return "PPT";
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return "ZIP";
    if (['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'html', 'css', 'json'].includes(ext)) return "Code";
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return "Images";
    if (['doc', 'docx', 'xls', 'xlsx', 'txt'].includes(ext)) return "Documents";
    return "Other";
  };

  const groupedFiles = useMemo(() => {
    if (!files) return {};

    const groups = {};

    files.forEach(file => {
      // Filter based on search term
      const matchesSearch =
        !searchTerm ||
        file.originalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.studentName?.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return;

      const studentId = file.studentId;
      if (!groups[studentId]) {
        groups[studentId] = {
          studentName: file.studentName,
          studentEmail: file.studentEmail,
          projectName: file.projectName,
          categories: {
            PPT: [],
            PDF: [],
            ZIP: [],
            Code: [],
            Images: [],
            Documents: [],
            Other: []
          }
        };
      }

      const category = getFileCategory(file.originalName);
      if (groups[studentId].categories[category]) {
        groups[studentId].categories[category].push(file);
      } else {
        groups[studentId].categories["Other"].push(file);
      }
    });

    return groups;
  }, [files, searchTerm]);

  const handleDownload = async (file) => {
    try {
      await dispatch(downloadFile({
        projectId: file.projectId,
        fileId: file._id,
        fileName: file.originalName
      })).unwrap();
      toast.success("Download started");
    } catch (error) {
      // Error handled in slice
    }
  };

  const hasFiles = Object.keys(groupedFiles).length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 space-y-6 md:space-y-8 animate-fade-in bg-gray-50/50 min-h-screen pb-24 md:pb-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl md:rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <FolderOpen className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              Student Files
            </h1>
            <p className="text-blue-100 mt-2 text-sm md:text-base max-w-xl font-light">
              Organized repository of all student submissions.
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-3xl mx-auto -mt-10 md:-mt-12 z-20 shadow-lg px-2">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search files..."
          className="w-full pl-12 pr-6 py-3 md:py-4 bg-white border border-gray-100 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-gray-700 placeholder-gray-400 font-medium text-sm md:text-base"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-500 font-medium text-lg">Loading repository...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center text-red-700 max-w-2xl mx-auto mt-12">
          <p className="font-bold text-lg mb-2">Failed to load files</p>
          <p className="opacity-80">{error}</p>
        </div>
      ) : !hasFiles ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-20 text-center shadow-sm max-w-2xl mx-auto mt-12">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FolderOpen className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No files found</h3>
          <p className="text-gray-500 text-lg">
            {searchTerm ? "Try adjusting your search criteria." : "No files have been submitted yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-10 mt-12">
          {Object.entries(groupedFiles).map(([studentId, data]) => (
            <div key={studentId} className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
              {/* Student Header */}
              <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-md">
                    {data.studentName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{data.studentName}</h2>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1.5">
                      <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full font-medium">
                        <FolderOpen className="w-3.5 h-3.5" />
                        {data.projectName}
                      </span>
                      {data.studentEmail && (
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" />
                          {data.studentEmail}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Categorized Files */}
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Object.entries(data.categories)
                  .filter(([_, categoryFiles]) => categoryFiles.length > 0)
                  .map(([category, categoryFiles]) => {
                    let headerColor = "bg-gray-100 text-gray-700 border-gray-200";

                    if (category === "PPT") headerColor = "bg-red-50 text-red-800 border-red-100";
                    if (category === "PDF") headerColor = "bg-blue-50 text-blue-800 border-blue-100";
                    if (category === "ZIP") headerColor = "bg-green-50 text-green-800 border-green-100";
                    if (category === "Code") headerColor = "bg-yellow-50 text-yellow-800 border-yellow-100";
                    if (category === "Images") headerColor = "bg-purple-50 text-purple-800 border-purple-100";

                    return (
                      <div key={category} className="rounded-2xl border border-gray-200 overflow-hidden flex flex-col h-full bg-white shadow-sm hover:shadow-md transition-shadow">
                        <div className={`px-5 py-3 font-bold text-sm flex items-center justify-between border-b ${headerColor}`}>
                          <span className="flex items-center gap-2 uppercase tracking-wide">
                            {category === "PPT" && <FileText className="w-4 h-4" />}
                            {category === "PDF" && <FileText className="w-4 h-4" />}
                            {category === "ZIP" && <FileArchive className="w-4 h-4" />}
                            {category === "Code" && <Code className="w-4 h-4" />}
                            {category === "Images" && <ImageIcon className="w-4 h-4" />}
                            {category === "Documents" && <FileText className="w-4 h-4" />}
                            {category}
                          </span>
                          <span className="bg-white/80 px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm">{categoryFiles.length}</span>
                        </div>
                        <div className="p-4 space-y-3 flex-1 bg-white">
                          {categoryFiles.map((file, index) => {
                            const ext = file.originalName?.split('.').pop()?.toLowerCase() || '';
                            let fileColor = "gray";
                            let fileBg = "bg-gray-50";
                            let fileText = "text-gray-600";
                            let fileBorder = "border-gray-200";
                            let accentBorder = "border-l-gray-400"; // Default accent
                            let typeLabel = "FILE";

                            if (['pdf'].includes(ext)) {
                              fileColor = "blue";
                              fileBg = "bg-blue-50";
                              fileText = "text-blue-700";
                              fileBorder = "border-blue-100";
                              accentBorder = "border-l-blue-500";
                              typeLabel = "PDF DOCUMENT";
                            } else if (['ppt', 'pptx'].includes(ext)) {
                              fileColor = "red";
                              fileBg = "bg-red-50";
                              fileText = "text-red-700";
                              fileBorder = "border-red-100";
                              accentBorder = "border-l-red-500";
                              typeLabel = "PRESENTATION";
                            } else if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
                              fileColor = "green";
                              fileBg = "bg-green-50";
                              fileText = "text-green-800";
                              fileBorder = "border-green-100";
                              accentBorder = "border-l-green-500";
                              typeLabel = "ARCHIVE / ZIP";
                            } else if (['js', 'jsx', 'ts', 'tsx', 'py'].includes(ext)) {
                              fileColor = "yellow";
                              fileBg = "bg-yellow-50";
                              fileText = "text-yellow-700";
                              fileBorder = "border-yellow-100";
                              accentBorder = "border-l-yellow-500";
                              typeLabel = "SOURCE CODE";
                            } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
                              fileColor = "purple";
                              fileBg = "bg-purple-50";
                              fileText = "text-purple-700";
                              fileBorder = "border-purple-100";
                              accentBorder = "border-l-purple-500";
                              typeLabel = "IMAGE FILE";
                            }

                            return (
                              <div key={file._id || index} className={`group relative flex items-center justify-between p-3 pl-4 rounded-xl border ${fileBorder} border-l-[4px] ${accentBorder} transition-all hover:shadow-md hover:translate-x-1 bg-white`}>
                                <div className="flex items-center gap-3.5 min-w-0">
                                  <div className={`shrink-0 p-2.5 rounded-lg ${fileBg}`}>
                                    {getFileIcon(file.originalName)}
                                  </div>
                                  <div className="truncate">
                                    <div className="flex items-center gap-2 mb-0.5">
                                      <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${fileBg} ${fileText} tracking-wider`}>
                                        {typeLabel}
                                      </span>
                                    </div>
                                    <p className="text-sm font-bold text-gray-800 truncate" title={file.originalName}>
                                      {file.originalName}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5 font-medium">
                                      Uploaded on {new Date(file.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleDownload(file)}
                                  className={`p-2.5 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 ${fileBg} ${fileText} hover:bg-opacity-80 shadow-sm`}
                                  title="Download"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherFiles;
