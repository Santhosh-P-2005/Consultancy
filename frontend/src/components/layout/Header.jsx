import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <>
      <style>
        {`
          .header {
            background-color: #1D4ED8; /* Tailwind's bg-primary or blue-700 */
            color: white;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .header-container {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px;
          }
          .header-title {
            font-size: 1.5rem;
            font-weight: bold;
            text-decoration: none;
            color: white;
          }
          .nav-links {
            display: flex;
            align-items: center;
            gap: 1rem;
          }
          .nav-links a {
            color: white;
            text-decoration: none;
            transition: color 0.2s;
          }
          .nav-links a:hover {
            color: #E5E7EB; /* hover:text-gray-200 */
          }
          .logout-button {
            background-color: #DC2626; /* red-600 */
            color: white;
            padding: 8px 16px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: background-color 0.2s;
          }
          .logout-button:hover {
            background-color: #B91C1C; /* red-700 */
          }
        `}
      </style>

      <header className="header">
        <div className="header-container">
          <Link to="/" className="header-title">Attendance Management System</Link>

          <nav className="nav-links">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/staff">Staff</Link>
            <Link to="/attendance">Attendance</Link>
            <Link to="/reports">Reports</Link>
            <button className="logout-button">Logout</button>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
