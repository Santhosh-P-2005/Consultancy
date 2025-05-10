import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Pages
import Dashboard from './pages/Dashboard';
import StaffPage from './pages/StaffPage';
import AttendancePage from './pages/AttendancePage';
import ReportsPage from './pages/ReportsPage';

// Auth-related components (optional for future use)
// import Login from './components/auth/Login';
// import PrivateRoute from './components/auth/PrivateRoute';

const App = () => {
  return (

    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          {/* <Route path="/login" element={<Login />} /> */}

          {/* Protected Routes (you can wrap with PrivateRoute if needed later) */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/staff/*" element={<StaffPage />} />
          <Route path="/attendance/*" element={<AttendancePage />} />
          <Route path="/reports/*" element={<ReportsPage />} />

          {/* Redirect root and unmatched routes to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
