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
      <style>
        {`
          .container {
            background-color: #fff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            padding: 24px;
          }
          .header {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 24px;
          }
          .form-group {
            display: grid;
            grid-template-columns: 1fr;
            gap: 16px;
            margin-bottom: 24px;
          }
          .form-group label {
            font-weight: 500;
            color: #4a5568;
          }
          .form-group input {
            width: 100%;
            padding: 8px;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
          }
          .submit-btn {
            background-color: #2563eb;
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
          }
          .submit-btn:hover {
            background-color: #1d4ed8;
          }
          .error {
            background-color: #fed7d7;
            color: #c53030;
            padding: 12px;
            border-radius: 4px;
            margin-bottom: 16px;
          }
          .report-summary {
            background-color: #f7fafc;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 24px;
          }
          .summary-item {
            background-color: white;
            padding: 12px;
            border-radius: 4px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          .summary-item p {
            font-size: 0.875rem;
            color: #4a5568;
          }
          .summary-item .value {
            font-size: 1.5rem;
            font-weight: bold;
          }
          .summary-item.present {
            background-color: #f0fff4;
            color: #48bb78;
          }
          .summary-item.absent {
            background-color: #fff5f5;
            color: #f56565;
          }
          .summary-item.leave {
            background-color: #ebf8ff;
            color: #3182ce;
          }
          .summary-item.halfday {
            background-color: #fefcbf;
            color: #ecc94b;
          }
          .export-btn {
            background-color: #16a34a;
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
          }
          .export-btn:hover {
            background-color: #15803d;
          }
          .table {
            width: 100%;
            background-color: white;
            border-collapse: collapse;
            margin-top: 24px;
            border: 1px solid #e2e8f0;
          }
          .table th, .table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #edf2f7;
          }
          .table th {
            background-color: #2d3748;
            color: white;
          }
          .table tbody tr:hover {
            background-color: #f7fafc;
          }
        `}
      </style>

      <h2 className="header">Custom Date Range Report</h2>
      
      <form onSubmit={handleSubmit} className="form-group">
        <div>
          <label className="block">Start Date</label>
          <input 
            type="date" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label className="block">End Date</label>
          <input 
            type="date" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate}
            required
          />
        </div>
        
        <div className="flex items-end">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Generate Report'}
          </button>
        </div>
      </form>
      
      {error && (
        <div className="error">
          {error}
        </div>
      )}
      
      {reportData && reportData.length > 0 && (
        <>
          <div className="report-summary">
            <h3 className="text-lg font-semibold mb-2">Report Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className={`summary-item ${summary.present > 0 ? 'present' : ''}`}>
                <p>Total Records</p>
                <p className="value">{summary.total}</p>
              </div>
              <div className={`summary-item ${summary.present > 0 ? 'present' : ''}`}>
                <p>Present</p>
                <p className="value">{summary.present}</p>
              </div>
              <div className={`summary-item ${summary.absent > 0 ? 'absent' : ''}`}>
                <p>Absent</p>
                <p className="value">{summary.absent}</p>
              </div>
              <div className={`summary-item ${summary.halfday > 0 ? 'halfday' : ''}`}>
                <p>Half Day</p>
                <p className="value">{summary.halfday}</p>
              </div>
              <div className="summary-item">
                <p>Attendance Rate</p>
                <p className="value">{summary.attendanceRate}%</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mb-4">
            <button 
              onClick={handleExport}
              className="export-btn"
            >
              Export to Excel
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Staff ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((record) => (
                  <tr key={record._id}>
                    <td>{record.staffId}</td>
                    <td>{record.staff?.name}</td>
                    <td>{record.staff?.department}</td>
                    <td>{formatDisplayDate(record.date)}</td>
                    <td>
                      <span className={`px-2 py-1 rounded text-xs font-medium
                        ${record.status === 'present' ? 'bg-green-100 text-green-800' : ''}
                        ${record.status === 'absent' ? 'bg-red-100 text-red-800' : ''}
                        ${record.status === 'leave' ? 'bg-blue-100 text-blue-800' : ''}
                        ${record.status === 'halfday' ? 'bg-yellow-100 text-yellow-800' : ''}
                      `}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </td>
                    <td>{record.notes}</td>
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
