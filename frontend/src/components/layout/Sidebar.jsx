import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white h-full fixed left-0 top-16">
      <div className="p-4">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Quick Actions</h2>
          <div className="flex flex-col gap-2">
            <NavLink to="/attendance/mark" className="bg-blue-600 text-center py-2 rounded hover:bg-blue-700">
              Mark Attendance
            </NavLink>
            <NavLink to="/staff/add" className="bg-green-600 text-center py-2 rounded hover:bg-green-700">
              Add New Staff
            </NavLink>
          </div>
        </div>
        
        <nav>
          <div className="mb-4">
            <h3 className="text-gray-400 uppercase text-xs font-bold mb-2">Main Menu</h3>
            <ul className="space-y-2">
              <li>
                <NavLink to="/dashboard" className={({isActive}) => 
                  `block p-2 rounded ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
                }>
                  Dashboard
                </NavLink>
              </li>
            </ul>
          </div>
          
          <div className="mb-4">
            <h3 className="text-gray-400 uppercase text-xs font-bold mb-2">Staff Management</h3>
            <ul className="space-y-2">
              <li>
                <NavLink to="/staff" className={({isActive}) => 
                  `block p-2 rounded ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
                }>
                  All Staff
                </NavLink>
              </li>
              <li>
                <NavLink to="/staff/add" className={({isActive}) => 
                  `block p-2 rounded ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
                }>
                  Add Staff
                </NavLink>
              </li>
              <li>
                <NavLink to="/staff/departments" className={({isActive}) => 
                  `block p-2 rounded ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
                }>
                  Departments
                </NavLink>
              </li>
            </ul>
          </div>
          
          <div className="mb-4">
            <h3 className="text-gray-400 uppercase text-xs font-bold mb-2">Attendance</h3>
            <ul className="space-y-2">
              <li>
                <NavLink to="/attendance" className={({isActive}) => 
                  `block p-2 rounded ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
                }>
                  View Attendance
                </NavLink>
              </li>
              <li>
                <NavLink to="/attendance/mark" className={({isActive}) => 
                  `block p-2 rounded ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
                }>
                  Mark Attendance
                </NavLink>
              </li>
              <li>
                <NavLink to="/attendance/bulk" className={({isActive}) => 
                  `block p-2 rounded ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
                }>
                  Bulk Attendance
                </NavLink>
              </li>
            </ul>
          </div>
          
          <div className="mb-4">
            <h3 className="text-gray-400 uppercase text-xs font-bold mb-2">Reports</h3>
            <ul className="space-y-2">
              <li>
                <NavLink to="/reports/daily" className={({isActive}) => 
                  `block p-2 rounded ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
                }>
                  Daily Report
                </NavLink>
              </li>
              <li>
                <NavLink to="/reports/weekly" className={({isActive}) => 
                  `block p-2 rounded ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
                }>
                  Weekly Report
                </NavLink>
              </li>
              <li>
                <NavLink to="/reports/monthly" className={({isActive}) => 
                  `block p-2 rounded ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
                }>
                  Monthly Report
                </NavLink>
              </li>
              <li>
                <NavLink to="/reports/custom" className={({isActive}) => 
                  `block p-2 rounded ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
                }>
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