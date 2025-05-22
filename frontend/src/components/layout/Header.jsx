import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext'; // adjust path as needed

const Header = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null); // Clear context user
    navigate('/login'); // Redirect to login
  };

  return (
    <header className="bg-blue-700 text-white shadow-md fixed top-0 left-0 w-full z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
        <Link to="/" className="text-2xl font-bold text-white no-underline">
          Attendance Management System
        </Link>

        <nav className="flex items-center gap-6">
          <Link to="/dashboard" className="text-white hover:text-gray-200 transition-colors">
            Dashboard
          </Link>
          <Link to="/staff" className="text-white hover:text-gray-200 transition-colors">
            Staff
          </Link>
          <Link to="/attendance" className="text-white hover:text-gray-200 transition-colors">
            Attendance
          </Link>
          <Link to="/reports" className="text-white hover:text-gray-200 transition-colors">
            Reports
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
