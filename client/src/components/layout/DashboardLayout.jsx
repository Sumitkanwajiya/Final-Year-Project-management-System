import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { authUser } = useSelector((state) => state.auth);
  const userRole = authUser?.role;

  return (
    <div className="min-h-screen bg-slate-50 pt-[66px]">
      {/* Navbar */}
      <Navbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userRole={userRole}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          open={sidebarOpen}
          setOpen={setSidebarOpen}
          userRole={userRole}
        />

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 w-full max-w-full overflow-x-hidden ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"
            }`}
        >
          <div className="p-4 lg:p-6 w-full max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
