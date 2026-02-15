import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, deleteTeacher } from "../../store/slices/adminSlice";
import AddTeacher from "../../components/modal/AddTeacher";
import ConfirmModal from "../../components/modal/ConfirmModal";
import EditTeacher from "../../components/modal/EditTeacher";
import { Search, Plus, Trash2, Edit, User, Mail, BookOpen, GraduationCap, Users, Loader, Calendar, Briefcase, CheckCircle } from "lucide-react";

const ManageTeachers = () => {
  const dispatch = useDispatch();
  const { teachers, students, loading } = useSelector((state) => state.admin);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, teacherId: null });
  const [editModal, setEditModal] = useState({ isOpen: false, teacher: null });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleDeleteClick = (id) => {
    setDeleteModal({ isOpen: true, teacherId: id });
  };

  const handleEditClick = (teacher) => {
    setEditModal({ isOpen: true, teacher: teacher });
  };

  const confirmDelete = () => {
    if (deleteModal.teacherId) {
      dispatch(deleteTeacher(deleteModal.teacherId));
      setDeleteModal({ isOpen: false, teacherId: null });
    }
  };

  const filteredTeachers = teachers?.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (Array.isArray(teacher.experties) && teacher.experties.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  // Stats Logic
  const totalAssignedStudents = students?.filter(s => s.supervisor).length || 0;
  const uniqueDepartments = new Set(teachers?.map(t => t.department).filter(Boolean)).size || 0;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manage Teachers</h1>
          <p className="text-slate-500 mt-1">View, add, and manage teacher accounts</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg active:scale-95"
        >
          <Plus size={20} />
          <span>Add New Teacher</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
            <GraduationCap size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Teachers</p>
            <h3 className="text-2xl font-bold text-slate-800">{teachers?.length || 0}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Assigned Students</p>
            <h3 className="text-2xl font-bold text-slate-800">{totalAssignedStudents}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
            <Briefcase size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Departments</p>
            <h3 className="text-2xl font-bold text-slate-800">{uniqueDepartments}</h3>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Search Bar */}
        <div className="p-6 border-b border-slate-100">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, department, or expertise..."
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Department
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Expertise
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Assigned Students
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Joining Date
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-slate-500">
                    <div className="flex justify-center items-center gap-2">
                      <Loader className="animate-spin size-5 text-blue-500" />
                      <span>Loading teachers...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredTeachers?.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-slate-500">
                    No teachers found.
                  </td>
                </tr>
              ) : (
                filteredTeachers?.map((teacher) => (
                  <tr key={teacher._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-lg">
                          {teacher.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">{teacher.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-slate-500">
                        <Mail className="flex-shrink-0 mr-1.5 h-4 w-4 text-slate-400" />
                        {teacher.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-slate-500">
                        <BookOpen className="flex-shrink-0 mr-1.5 h-4 w-4 text-slate-400" />
                        {teacher.department || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-500 max-w-xs truncate" title={Array.isArray(teacher.experties) ? teacher.experties.join(", ") : teacher.experties}>
                        {Array.isArray(teacher.experties) ? teacher.experties.join(", ") : teacher.experties || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-slate-500">
                        <Users className="flex-shrink-0 mr-1.5 h-4 w-4 text-slate-400" />
                        {/* Calculate assigned students for this specific teacher */}
                        {students?.filter(s => s.supervisor?._id === teacher._id).length || 0} / {teacher.maxStudents || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-slate-500">
                        <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-slate-400" />
                        {new Date(teacher.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleEditClick(teacher)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(teacher._id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination (Static for now) */}
        {!loading && filteredTeachers?.length > 0 && (
          <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
            <div className="text-sm text-slate-500">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredTeachers.length}</span> of <span className="font-medium">{teachers?.length}</span> results
            </div>
          </div>
        )}
      </div>

      {/* Add Teacher Modal */}
      <AddTeacher
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Edit Teacher Modal */}
      {editModal.isOpen && (
        <EditTeacher
          setIsOpen={(open) => setEditModal(prev => ({ ...prev, isOpen: open }))}
          teacher={editModal.teacher}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, teacherId: null })}
        onConfirm={confirmDelete}
        title="Delete Teacher"
        message="Are you sure you want to delete this teacher? This action cannot be undone."
      />
    </div>
  );
};

export default ManageTeachers;
