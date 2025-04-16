// src/components/reports/CustomReport.jsx
import React, { useState, useEffect } from 'react';
import { attendanceService } from '../../services/attendanceService';
import { formatDate, formatDisplayDate } from '../../utils/dateUtils';

const CustomReport = () => {
  const [startDate, setStartDate] = useState(formatDate(new Date()));
  const [endDate, setEndDate] = useState(formatDate(new Date()));
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const filters = {
        startDate,
        endDate
      };
      
      const data = await attendanceService.getAttendance(filters);
      setReportData(data);
    } catch (err) {
      setError('Failed to fetch report data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      await attendanceService.exportReport('custom', { startDate, endDate });
    } catch (err) {
      setError('Failed to export report. Please try again.');
      console.error(err);
    }
  };

  const calculateSummary = () => {
    if (!reportData || reportData.length === 0) return null;
    
    const summary = {
      total: reportData.length,
      present: reportData.filter(record => record.status === 'present').length,
      absent: reportData.filter(record => record.status === 'absent').length,
      leave: reportData.filter(record => record.status === 'leave').length,
      halfday: reportData.filter(record => record.status === 'halfday').length,
    };
    
    summary.attendanceRate = summary.total > 0 
      ? ((summary.present + (summary.halfday * 0.5)) / summary.total * 100).toFixed(2) 
      : 0;
      
    return summary;
  };

  const summary = calculateSummary();

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">Custom Date Range Report</h2>
      
      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-gray-700 mb-1">Start Date</label>
          <input 
            type="date" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-1">End Date</label>
          <input 
            type="date" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div className="flex items-end">
          <button 
            type="submit" 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Generate Report'}
          </button>
        </div>
      </form>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {reportData && reportData.length > 0 && (
        <>
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-2">Report Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-white p-3 rounded shadow">
                <p className="text-gray-600 text-sm">Total Records</p>
                <p className="text-2xl font-bold">{summary.total}</p>
              </div>
              <div className="bg-green-50 p-3 rounded shadow">
                <p className="text-gray-600 text-sm">Present</p>
                <p className="text-2xl font-bold text-green-600">{summary.present}</p>
              </div>
              <div className="bg-red-50 p-3 rounded shadow">
                <p className="text-gray-600 text-sm">Absent</p>
                <p className="text-2xl font-bold text-red-600">{summary.absent}</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded shadow">
                <p className="text-gray-600 text-sm">Half Day</p>
                <p className="text-2xl font-bold text-yellow-600">{summary.halfday}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded shadow">
                <p className="text-gray-600 text-sm">Attendance Rate</p>
                <p className="text-2xl font-bold text-blue-600">{summary.attendanceRate}%</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mb-4">
            <button 
              onClick={handleExport}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export to Excel
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Staff ID</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Department</th>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reportData.map((record) => (
                  <tr key={record._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">{record.staffId}</td>
                    <td className="py-3 px-4">{record.staff?.name}</td>
                    <td className="py-3 px-4">{record.staff?.department}</td>
                    <td className="py-3 px-4">{formatDisplayDate(record.date)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium
                        ${record.status === 'present' ? 'bg-green-100 text-green-800' : ''}
                        ${record.status === 'absent' ? 'bg-red-100 text-red-800' : ''}
                        ${record.status === 'leave' ? 'bg-blue-100 text-blue-800' : ''}
                        ${record.status === 'halfday' ? 'bg-yellow-100 text-yellow-800' : ''}
                      `}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">{record.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      
      {reportData && reportData.length === 0 && (
        <div className="bg-yellow-50 p-4 rounded text-center">
          <p className="text-yellow-700">No attendance records found for the selected date range.</p>
        </div>
      )}
    </div>
  );
};

export default CustomReport;