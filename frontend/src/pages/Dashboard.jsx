import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { attendanceService } from '../services/attendanceService';
import { staffService } from '../services/staffService';
import { getCurrentMonth, getCurrentYear } from '../utils/dateUtils';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
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
        
        // Get all staff count
        const staffResponse = await staffService.getAllStaff();
        
        // Get today's attendance report
        const today = new Date();
        const todayReport = await attendanceService.getDailyReport(today.toISOString().split('T')[0]);
        
        // Get monthly report for attendance percentage
        const monthlyReport = await attendanceService.getMonthlyReport(
          getCurrentMonth(), 
          getCurrentYear()
        );
        
        // Get recent attendance entries
        const recentAttendanceData = await attendanceService.getAttendance({
          limit: 5,
          sort: '-date'
        });
        
        setSummary({
          totalStaff: staffResponse.length,
          presentToday: todayReport.present,
          absentToday: todayReport.absent,
          unmarkedToday: todayReport.unmarked,
          monthlyAvgAttendance: monthlyReport.summary.averageAttendance
        });
        
        setRecentAttendance(recentAttendanceData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of your attendance management system</p>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-500 text-sm font-semibold mb-1">Total Staff</h3>
              <p className="text-3xl font-bold">{summary.totalStaff}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-500 text-sm font-semibold mb-1">Present Today</h3>
              <p className="text-3xl font-bold text-green-600">{summary.presentToday}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-500 text-sm font-semibold mb-1">Absent Today</h3>
              <p className="text-3xl font-bold text-red-600">{summary.absentToday}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-500 text-sm font-semibold mb-1">Monthly Attendance</h3>
              <p className="text-3xl font-bold text-blue-600">{summary.monthlyAvgAttendance}%</p>
            </div>
          </div>
          
          {/* Recent Attendance */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Recent Attendance</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentAttendance.map((record) => (
                    <tr key={record._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{record.staff.name}</div>
                        <div className="text-sm text-gray-500">{record.staffId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.staff.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${record.status === 'present' ? 'bg-green-100 text-green-800' : 
                          record.status === 'absent' ? 'bg-red-100 text-red-800' : 
                          record.status === 'leave' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'}`}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {recentAttendance.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                        No recent attendance records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button 
                className="flex items-center justify-center p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => window.location.href = '/attendance/mark'}
              >
                Mark Today's Attendance
              </button>
              <button 
                className="flex items-center justify-center p-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
                onClick={() => window.location.href = '/staff/add'}
              >
                Add New Staff
              </button>
              <button 
                className="flex items-center justify-center p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                onClick={() => window.location.href = '/reports/daily'}
              >
                Generate Today's Report
              </button>
            </div>
          </div>
        </>
      )}
    </MainLayout>
  );
};

export default Dashboard;