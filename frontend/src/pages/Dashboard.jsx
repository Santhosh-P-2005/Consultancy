import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { attendanceService } from '../services/attendanceService';
import { staffService } from '../services/staffService';
import { getCurrentMonth, getCurrentYear } from '../utils/dateUtils';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({
    totalStaff: 0,
    presentToday: 0,
    absentToday: 0,
    unmarkedToday: 0,
    monthlyAvgAttendance: 0
  });
  const [recentAttendance, setRecentAttendance] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const today = new Date().toISOString().split('T')[0];

        const [staffResponse, todayReport, monthlyReport, recentAttendanceData] = await Promise.all([
          staffService.getAllStaff(),
          attendanceService.getDailyReport(today),
          attendanceService.getMonthlyReport(getCurrentMonth(), getCurrentYear()),
          attendanceService.getAttendance({ limit: 5, sort: '-date' })
        ]);

        console.log('Staff Response:', staffResponse);
        console.log('Today Report:', todayReport);
        console.log('Monthly Report:', monthlyReport);
        console.log('Recent Attendance:', recentAttendanceData);

        setSummary({
          totalStaff: staffResponse?.length || 0,
          presentToday: todayReport?.present || 0,
          absentToday: todayReport?.absent || 0,
          unmarkedToday: todayReport?.unmarked || 0,
          monthlyAvgAttendance: monthlyReport?.summary?.averageAttendance || 0
        });

        setRecentAttendance(recentAttendanceData || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <MainLayout>
      <div className="header">
        <h1>Dashboard</h1>
        <p>Overview of your attendance management system</p>
      </div>

      {loading ? (
        <div className="loader">
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div style={{ color: 'red', padding: '16px' }}>{error}</div>
      ) : (
        <>
          <div className="summary-grid">
            <div className="card">
              <h3>Total Staff</h3>
              <p className="number">{summary.totalStaff}</p>
            </div>
            <div className="card">
              <h3>Present Today</h3>
              <p className="number green">{summary.presentToday}</p>
            </div>
            <div className="card">
              <h3>Absent Today</h3>
              <p className="number red">{summary.absentToday}</p>
            </div>
            <div className="card">
              <h3>Monthly Attendance</h3>
              <p className="number blue">{summary.monthlyAvgAttendance}%</p>
            </div>
          </div>

          <div className="table-container">
            <div className="table-header">
              <h2>Recent Attendance</h2>
            </div>
            <div className="table-wrapper">
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Staff</th>
                    <th>Department</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAttendance.length > 0 ? (
                    recentAttendance.map((record) => (
                      <tr key={record._id}>
                        <td>
                          <div className="staff-name">{record.staff?.name || 'N/A'}</div>
                          <div className="staff-id">{record.staffId}</div>
                        </td>
                        <td>{record.staff?.department || 'N/A'}</td>
                        <td>{new Date(record.date).toLocaleDateString()}</td>
                        <td>
                          <span className={`status ${record.status}`}>
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="no-data">No recent attendance records found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              <button
                className="btn blue"
                onClick={() => window.location.href = '/attendance/mark'}
              >
                Mark Today's Attendance
              </button>
              <button
                className="btn green"
                onClick={() => window.location.href = '/staff/add'}
              >
                Add New Staff
              </button>
              <button
                className="btn purple"
                onClick={() => window.location.href = '/reports/daily'}
              >
                Generate Today's Report
              </button>
            </div>
          </div>
        </>
      )}


      {/* Embedded CSS */}
      <style>{`
        .header {
          margin-bottom: 24px;
        }

        .header h1 {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 8px;
        }

        .header p {
          color: #6b7280;
        }

        .loader {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 256px;
        }

        .spinner {
          border: 4px solid #ccc;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          width: 48px;
          height: 48px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
          padding: 24px;
        }

        .card h3 {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 4px;
        }

        .number {
          font-size: 28px;
          font-weight: bold;
        }

        .green { color: #16a34a; }
        .red { color: #dc2626; }
        .blue { color: #2563eb; }

        .table-container {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
          margin-bottom: 32px;
        }

        .table-header {
          padding: 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .table-header h2 {
          font-size: 18px;
          font-weight: 600;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .attendance-table {
          width: 100%;
          border-collapse: collapse;
        }

        .attendance-table thead {
          background: #f9fafb;
        }

        .attendance-table th, .attendance-table td {
          padding: 16px 24px;
          text-align: left;
          font-size: 14px;
        }

        .attendance-table tbody tr:not(:last-child) {
          border-bottom: 1px solid #e5e7eb;
        }

        .staff-name {
          font-weight: 500;
          color: #111827;
        }

        .staff-id {
          font-size: 13px;
          color: #6b7280;
        }

        .status {
          display: inline-block;
          padding: 4px 8px;
          font-size: 12px;
          font-weight: 600;
          border-radius: 999px;
        }

        .status.present {
          background: #d1fae5;
          color: #065f46;
        }

        .status.absent {
          background: #fee2e2;
          color: #991b1b;
        }

        .status.leave {
          background: #fef9c3;
          color: #92400e;
        }

        .status.unmarked {
          background: #f3f4f6;
          color: #374151;
        }

        .no-data {
          text-align: center;
          color: #6b7280;
          padding: 16px;
        }

        .quick-actions {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
          padding: 24px;
        }

        .quick-actions h2 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .btn {
          padding: 16px;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn.blue {
          background: #2563eb;
        }

        .btn.blue:hover {
          background: #1d4ed8;
        }

        .btn.green {
          background: #16a34a;
        }

        .btn.green:hover {
          background: #15803d;
        }

        .btn.purple {
          background: #7c3aed;
        }

        .btn.purple:hover {
          background: #6d28d9;
        }
      `}</style>
    </MainLayout>
  );
};

export default Dashboard;
