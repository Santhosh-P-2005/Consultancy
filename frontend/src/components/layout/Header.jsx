import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-2xl font-bold">Attendance Management System</Link>
        
        <nav className="flex items-center gap-4">
          <Link to="/dashboard" className="hover:text-gray-200">Dashboard</Link>
          <Link to="/staff" className="hover:text-gray-200">Staff</Link>
          <Link to="/attendance" className="hover:text-gray-200">Attendance</Link>
          <Link to="/reports" className="hover:text-gray-200">Reports</Link>
          <button className="bg-red-600 px-4 py-2 rounded-md hover:bg-red-700">Logout</button>
        </nav>
      </div>
    </header>
  );
};

export default Header;