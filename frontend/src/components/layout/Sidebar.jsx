import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white fixed left-0 top-16 bottom-0 overflow-y-auto max-h-[calc(100vh-4rem)] scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-800">
      <div className="p-4">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Quick Actions</h2>
          <div className="flex flex-col gap-2 mb-6">
            <NavLink 
              to="/attendance/mark" 
              className="py-2 rounded-md text-center text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Mark Attendance
            </NavLink>
            <NavLink 
              to="/staff/add" 
              className="py-2 rounded-md text-center text-white bg-green-600 hover:bg-green-700 transition-colors"
            >
              Add New Staff
            </NavLink>
          </div>
        </div>

        <nav>
          <div className="mb-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Main Menu</h3>
            <ul className="list-none p-0 m-0">
              <li className="mb-2">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => 
                    isActive 
                      ? "block p-2 rounded-md bg-gray-700 text-white no-underline" 
                      : "block p-2 rounded-md text-white no-underline hover:bg-gray-700 transition-colors"
                  }
                >
                  Dashboard
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Staff Management</h3>
            <ul className="list-none p-0 m-0">
              <li className="mb-2">
                <NavLink
                  to="/staff"
                  className={({ isActive }) => 
                    isActive 
                      ? "block p-2 rounded-md bg-gray-700 text-white no-underline" 
                      : "block p-2 rounded-md text-white no-underline hover:bg-gray-700 transition-colors"
                  }
                >
                  All Staff
                </NavLink>
              </li>
              <li className="mb-2">
                <NavLink
                  to="/staff/add"
                  className={({ isActive }) => 
                    isActive 
                      ? "block p-2 rounded-md bg-gray-700 text-white no-underline" 
                      : "block p-2 rounded-md text-white no-underline hover:bg-gray-700 transition-colors"
                  }
                >
                  Add Staff
                </NavLink>
              </li>
              {/* <li className="mb-2">
                <NavLink
                  to="/staff/departments"
                  className={({ isActive }) => 
                    isActive 
                      ? "block p-2 rounded-md bg-gray-700 text-white no-underline" 
                      : "block p-2 rounded-md text-white no-underline hover:bg-gray-700 transition-colors"
                  }
                >
                  Departments
                </NavLink>
              </li> */}
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Attendance</h3>
            <ul className="list-none p-0 m-0">
              <li className="mb-2">
                <NavLink
                  to="/attendance"
                  className={({ isActive }) => 
                    isActive 
                      ? "block p-2 rounded-md bg-gray-700 text-white no-underline" 
                      : "block p-2 rounded-md text-white no-underline hover:bg-gray-700 transition-colors"
                  }
                >
                  View Attendance
                </NavLink>
              </li>
              <li className="mb-2">
                <NavLink
                  to="/attendance/mark"
                  className={({ isActive }) => 
                    isActive 
                      ? "block p-2 rounded-md bg-gray-700 text-white no-underline" 
                      : "block p-2 rounded-md text-white no-underline hover:bg-gray-700 transition-colors"
                  }
                >
                  Mark Attendance
                </NavLink>
              </li>
              <li className="mb-2">
                <NavLink
                  to="/attendance/bulk"
                  className={({ isActive }) => 
                    isActive 
                      ? "block p-2 rounded-md bg-gray-700 text-white no-underline" 
                      : "block p-2 rounded-md text-white no-underline hover:bg-gray-700 transition-colors"
                  }
                >
                  Bulk Attendance
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Reports</h3>
            <ul className="list-none p-0 m-0">
              <li className="mb-2">
                <NavLink
                  to="/reports?tab=daily"
                  className={({ isActive }) => 
                    isActive 
                      ? "block p-2 rounded-md bg-gray-700 text-white no-underline" 
                      : "block p-2 rounded-md text-white no-underline hover:bg-gray-700 transition-colors"
                  }
                >
                  Daily Report
                </NavLink>
              </li>
              <li className="mb-2">
                <NavLink
                  to="/reports?tab=weekly"
                  className={({ isActive }) => 
                    isActive 
                      ? "block p-2 rounded-md bg-gray-700 text-white no-underline" 
                      : "block p-2 rounded-md text-white no-underline hover:bg-gray-700 transition-colors"
                  }
                >
                  Weekly Report
                </NavLink>
              </li>
              <li className="mb-2">
                <NavLink
                  to="/reports?tab=monthly"
                  className={({ isActive }) => 
                    isActive 
                      ? "block p-2 rounded-md bg-gray-700 text-white no-underline" 
                      : "block p-2 rounded-md text-white no-underline hover:bg-gray-700 transition-colors"
                  }
                >
                  Monthly Report
                </NavLink>
              </li>
              <li className="mb-2">
                <NavLink
                  to="/reports?tab=custom"
                  className={({ isActive }) => 
                    isActive 
                      ? "block p-2 rounded-md bg-gray-700 text-white no-underline" 
                      : "block p-2 rounded-md text-white no-underline hover:bg-gray-700 transition-colors"
                  }
                >
                  Custom Report
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;