import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Pages
import Dashboard from './pages/Dashboard';
import StaffPage from './pages/StaffPage';
import AttendancePage from './pages/AttendancePage';
import ReportsPage from './pages/ReportsPage';

// Auth-related components (you might need to implement these)
// import Login from './components/auth/Login';
// import PrivateRoute from './components/auth/PrivateRoute';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          {/* <Route path="/login" element={<Login />} /> */}
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              // <PrivateRoute>
                <Dashboard />
              // </PrivateRoute>
            } 
          />
          
          <Route path="/staff/*" element={
            // <PrivateRoute>
              <StaffPage />
            // </PrivateRoute>
          } />
          
          <Route path="/attendance/*" element={
            // <PrivateRoute>
              <AttendancePage />
            // </PrivateRoute>
          } />
          
          <Route path="/reports/*" element={
            // <PrivateRoute>
              <ReportsPage />
            // </PrivateRoute>
          } />
          
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Catch all - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;