import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <>
      <style>
        {`
          .sidebar {
            width: 16rem;
            background-color: #1f2937;
            color: white;
            position: fixed;
            left: 0;
            top: 4rem;
            bottom: 0;
            overflow-y: auto;
            max-height: calc(100vh - 4rem);
            scrollbar-width: thin;
            scrollbar-color: #6b7280 #1f2937;
          }

          .sidebar::-webkit-scrollbar {
            width: 8px;
          }

          .sidebar::-webkit-scrollbar-thumb {
            background-color: #6b7280;
            border-radius: 4px;
          }

          .sidebar::-webkit-scrollbar-track {
            background-color: #1f2937;
          }

          .sidebar-container {
            padding: 1rem;
          }

          .sidebar h2 {
            font-size: 1.125rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
          }

          .quick-actions {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            margin-bottom: 1.5rem;
          }

          .quick-actions a {
            padding: 0.5rem 0;
            border-radius: 0.375rem;
            text-align: center;
            text-decoration: none;
            color: white;
          }

          .quick-actions a:nth-child(1) {
            background-color: #2563eb;
          }

          .quick-actions a:nth-child(1):hover {
            background-color: #1d4ed8;
          }

          .quick-actions a:nth-child(2) {
            background-color: #16a34a;
          }

          .quick-actions a:nth-child(2):hover {
            background-color: #15803d;
          }

          .menu-section {
            margin-bottom: 1rem;
          }

          .menu-section h3 {
            color: #9ca3af;
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            margin-bottom: 0.5rem;
          }

          .menu-list {
            list-style: none;
            padding-left: 0;
            margin: 0;
          }

          .menu-list li {
            margin-bottom: 0.5rem;
          }

          .menu-list a {
            display: block;
            padding: 0.5rem;
            border-radius: 0.375rem;
            text-decoration: none;
            color: white;
          }

          .menu-list a:hover {
            background-color: #374151;
          }

          .active-link {
            background-color: #374151;
          }
        `}
      </style>

      <aside className="sidebar">
        <div className="sidebar-container">
          <div className="mb-6">
            <h2>Quick Actions</h2>
            <div className="quick-actions">
              <NavLink to="/attendance/mark">Mark Attendance</NavLink>
              <NavLink to="/staff/add">Add New Staff</NavLink>
            </div>
          </div>

          <nav>
            <div className="menu-section">
              <h3>Main Menu</h3>
              <ul className="menu-list">
                <li>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) => isActive ? 'active-link' : ''}
                  >
                    Dashboard
                  </NavLink>
                </li>
              </ul>
            </div>

            <div className="menu-section">
              <h3>Staff Management</h3>
              <ul className="menu-list">
                <li>
                  <NavLink to="/staff" className={({ isActive }) => isActive ? 'active-link' : ''}>
                    All Staff
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/staff/add" className={({ isActive }) => isActive ? 'active-link' : ''}>
                    Add Staff
                  </NavLink>
                </li>
                {/* <li>
                  <NavLink to="/staff/departments" className={({ isActive }) => isActive ? 'active-link' : ''}>
                    Departments
                  </NavLink>
                </li> */}
              </ul>
            </div>

            <div className="menu-section">
              <h3>Attendance</h3>
              <ul className="menu-list">
                <li>
                  <NavLink to="/attendance" className={({ isActive }) => isActive ? 'active-link' : ''}>
                    View Attendance
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/attendance/mark" className={({ isActive }) => isActive ? 'active-link' : ''}>
                    Mark Attendance
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/attendance/bulk" className={({ isActive }) => isActive ? 'active-link' : ''}>
                    Bulk Attendance
                  </NavLink>
                </li>
              </ul>
            </div>

            <div className="menu-section">
              <h3>Reports</h3>
              <ul className="menu-list">
                <li>
                  <NavLink to="/reports?tab=daily" className={({ isActive }) => isActive ? 'active-link' : ''}>
                    Daily Report
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/reports?tab=weekly" className={({ isActive }) => isActive ? 'active-link' : ''}>
                    Weekly Report
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/reports?tab=monthly" className={({ isActive }) => isActive ? 'active-link' : ''}>
                    Monthly Report
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/reports?tab=custom" className={({ isActive }) => isActive ? 'active-link' : ''}>
                    Custom Report
                  </NavLink>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
