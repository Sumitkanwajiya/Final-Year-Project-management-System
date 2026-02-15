import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProject, uploadFile } from "../../store/slices/studentSlice";
import {
  UploadCloud,
  File,
  X,
  CheckCircle,
  AlertCircle,
  FileText,
  Trash2,
  Download,
  Code,
  Presentation,
  FileType,
  Eye
} from "lucide-react";

const UploadFiles = () => {
  const dispatch = useDispatch();
  const { project, loading } = useSelector((state) => state.student);

  // State for different file categories
  const [reportFile, setReportFile] = useState(null);
  const [presentationFile, setPresentationFile] = useState(null);
  const [codeFiles, setCodeFiles] = useState([]);

  // Dragging states
  const [dragActive, setDragActive] = useState({
    report: false,
    presentation: false,
    code: false
  });

  useEffect(() => {
    if (!project) {
      dispatch(fetchProject());
    }
  }, [dispatch, project]);

  // File Handlers
  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    if (type === 'report') setReportFile(files[0]);
    if (type === 'presentation') setPresentationFile(files[0]);
    if (type === 'code') setCodeFiles(prev => [...prev, ...files]);
  };

  const handleDrag = (e, type, active) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [type]: active }));
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [type]: false }));

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      if (type === 'report') setReportFile(files[0]);
      if (type === 'presentation') setPresentationFile(files[0]);
      if (type === 'code') setCodeFiles(prev => [...prev, ...files]);
    }
  };

  const removeCodeFile = (index) => {
    setCodeFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!project) return;
    if (!reportFile && !presentationFile && codeFiles.length === 0) return;

    try {
      const payload = {
        projectId: project._id,
        files: {
          reportFile,
          presentationFile,
          codeFiles
        }
      };

      const resultAction = await dispatch(uploadFile(payload));

      if (resultAction && uploadFile.fulfilled.match(resultAction)) {
        setReportFile(null);
        setPresentationFile(null);
        setCodeFiles([]);
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + ['Bytes', 'KB', 'MB', 'GB'][i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  if (!project) return null; // Loading state handled by skeleton or parent usually

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-slate-800 pb-12">
      <div className="bg-slate-900 pt-10 pb-24 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white tracking-tight">Project Deliverables</h1>
          <p className="text-slate-400 mt-2 text-lg">Upload your project reports, presentations, and source code.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 -mt-16 space-y-8">

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Report File Upload */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-800">Report File</h3>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              {!reportFile ? (
                <div
                  className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center transition-all ${dragActive.report ? "border-indigo-500 bg-indigo-50" : "border-slate-200 hover:border-indigo-400"
                    }`}
                  onDragOver={(e) => handleDrag(e, 'report', true)}
                  onDragLeave={(e) => handleDrag(e, 'report', false)}
                  onDrop={(e) => handleDrop(e, 'report')}
                >
                  <input type="file" id="report-upload" className="hidden" accept=".pdf,.doc,.docx" onChange={(e) => handleFileChange(e, 'report')} />
                  <label htmlFor="report-upload" className="cursor-pointer flex flex-col items-center w-full h-full justify-center">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-3">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <p className="font-semibold text-slate-700">Upload Report</p>
                    <p className="text-xs text-slate-400 mt-1">PDF or DOCX</p>
                  </label>
                </div>
              ) : (
                <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText className="w-8 h-8 text-indigo-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 truncate text-sm">{reportFile.name}</p>
                      <p className="text-xs text-slate-500">{formatSize(reportFile.size)}</p>
                    </div>
                  </div>
                  <button onClick={() => setReportFile(null)} className="text-slate-400 hover:text-red-500 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Presentation File Upload */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
              <Presentation className="w-5 h-5 text-pink-600" />
              <h3 className="font-bold text-slate-800">Presentation</h3>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              {!presentationFile ? (
                <div
                  className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center transition-all ${dragActive.presentation ? "border-pink-500 bg-pink-50" : "border-slate-200 hover:border-pink-400"
                    }`}
                  onDragOver={(e) => handleDrag(e, 'presentation', true)}
                  onDragLeave={(e) => handleDrag(e, 'presentation', false)}
                  onDrop={(e) => handleDrop(e, 'presentation')}
                >
                  <input type="file" id="ppt-upload" className="hidden" accept=".ppt,.pptx,.pdf" onChange={(e) => handleFileChange(e, 'presentation')} />
                  <label htmlFor="ppt-upload" className="cursor-pointer flex flex-col items-center w-full h-full justify-center">
                    <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-full flex items-center justify-center mb-3">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <p className="font-semibold text-slate-700">Upload Slide</p>
                    <p className="text-xs text-slate-400 mt-1">PPTX or PDF</p>
                  </label>
                </div>
              ) : (
                <div className="bg-pink-50 rounded-xl p-4 border border-pink-100 flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Presentation className="w-8 h-8 text-pink-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 truncate text-sm">{presentationFile.name}</p>
                      <p className="text-xs text-slate-500">{formatSize(presentationFile.size)}</p>
                    </div>
                  </div>
                  <button onClick={() => setPresentationFile(null)} className="text-slate-400 hover:text-red-500 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Code Files Upload */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
              <Code className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-800">Source Code</h3>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div
                className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center transition-all cursor-pointer mb-4 ${dragActive.code ? "border-emerald-500 bg-emerald-50" : "border-slate-200 hover:border-emerald-400"
                  }`}
                onDragOver={(e) => handleDrag(e, 'code', true)}
                onDragLeave={(e) => handleDrag(e, 'code', false)}
                onDrop={(e) => handleDrop(e, 'code')}
              >
                <input type="file" id="code-upload" className="hidden" multiple onChange={(e) => handleFileChange(e, 'code')} />
                <label htmlFor="code-upload" className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="font-semibold text-slate-700">Add Code Files</p>
                  <p className="text-xs text-slate-400 mt-1">ZIP or Source Files</p>
                </label>
              </div>

              {/* File List for Code */}
              <div className="flex-1 overflow-y-auto max-h-40 space-y-2 pr-1">
                {codeFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-emerald-50/50 rounded-lg border border-emerald-100 text-sm">
                    <span className="truncate flex-1 font-medium text-emerald-900">{file.name}</span>
                    <button onClick={() => removeCodeFile(idx)} className="text-emerald-400 hover:text-red-500 ml-2">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Upload Action */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleUpload}
            disabled={loading || (!reportFile && !presentationFile && codeFiles.length === 0)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-10 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex items-center gap-3"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Uploading...
              </>
            ) : (
              <>
                <UploadCloud className="w-5 h-5" /> Upload All Files
              </>
            )}
          </button>
        </div>

        {/* Previously Uploaded Files Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <FileType className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Uploaded Documents</h2>
          </div>
          {project.files && project.files.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {project.files.map((file, index) => (
                <div key={index} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold border transition-colors ${file.category === 'Report' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                      file.category === 'Presentation' ? 'bg-pink-50 text-pink-600 border-pink-100' :
                        file.category === 'Code' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          'bg-slate-50 text-slate-500 border-slate-200'
                      }`}>
                      {file.category === 'Report' ? <FileText className="w-6 h-6" /> :
                        file.category === 'Presentation' ? <Presentation className="w-6 h-6" /> :
                          file.category === 'Code' ? <Code className="w-6 h-6" /> :
                            <File className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 group-hover:text-indigo-700 transition-colors px-1">
                        {file.originalName || "Untitled File"}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 px-1">
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${file.category === 'Report' ? 'bg-indigo-100 text-indigo-700' :
                          file.category === 'Presentation' ? 'bg-pink-100 text-pink-700' :
                            file.category === 'Code' ? 'bg-emerald-100 text-emerald-700' :
                              'bg-slate-100 text-slate-600'
                          }`}>
                          {file.category || 'OTHER'}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500">{formatDate(file.uploadedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`http://localhost:5000/api/v1/student/view-file/${project._id}/${file._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
                      title="View File"
                    >
                      <Eye className="w-5 h-5" />
                    </a>
                    <a
                      href={`http://localhost:5000/api/v1/student/download-file/${project._id}/${file._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all"
                      title="Download File"
                    >
                      <Download className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400">
              <p className="font-medium">No documents uploaded yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadFiles;
