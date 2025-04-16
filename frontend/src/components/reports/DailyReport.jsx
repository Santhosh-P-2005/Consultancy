// src/components/reports/DailyReport.jsx
import React, { useState, useEffect } from 'react';
import { attendanceService } from '../../services/attendanceService';
import { formatDisplayDate, formatDate } from '../../utils/dateUtils';

const DailyReport = () => {
  const [reportDate, setReportDate] = useState(formatDate(new Date()));
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await attendanceService.getDailyReport(reportDate);
      setReport(data);
    } catch (err) {
      console.error('Error fetching daily report:', err);
      setError('Failed to load daily report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleDateChange = (e) => {
    setReportDate(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchReport();
  };

  const handleExport = async () => {
    try {
      await attendanceService.exportReport('daily', { date: reportDate });
    } catch (err) {
      console.error('Error exporting report:', err);
      setError('Failed to export report. Please try again.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Daily Attendance Report</h2>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label htmlFor="reportDate" className="block text-sm font-medium text-gray-700 mb-1">
              Select Date
            </label>
            <input
              type="date"
              id="reportDate"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={reportDate}
              onChange={handleDateChange}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Generate Report
          </button>
          <button
            type="button"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            onClick={handleExport}
          >
            Export to Excel
          </button>
        </div>
      </form>

      {loading && <div className="text-center py-4">Loading report...</div>}
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {report && !loading && (
        <div>
          <div className="bg-gray-100 p-4 rounded-md mb-6">
            <h3 className="text-lg font-semibold mb-2">Summary for {formatDisplayDate(report.date)}</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white p-3 rounded shadow-sm">
                <div className="text-sm text-gray-500">Total Staff</div>
                <div className="text-2xl font-bold">{report.totalStaff}</div>
              </div>
              <div className="bg-green-50 p-3 rounded shadow-sm">
                <div className="text-sm text-gray-500">Present</div>
                <div className="text-2xl font-bold text-green-600">{report.present}</div>
              </div>
              <div className="bg-red-50 p-3 rounded shadow-sm">
                <div className="text-sm text-gray-500">Absent</div>
                <div className="text-2xl font-bold text-red-600">{report.absent}</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded shadow-sm">
                <div className="text-sm text-gray-500">Unmarked</div>
                <div className="text-2xl font-bold text-yellow-600">{report.unmarked}</div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Attendance Records</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border-b text-left">Staff ID</th>
                    <th className="py-2 px-4 border-b text-left">Name</th>
                    <th className="py-2 px-4 border-b text-left">Department</th>
                    <th className="py-2 px-4 border-b text-left">Cabin</th>
                    <th className="py-2 px-4 border-b text-left">Status</th>
                    <th className="py-2 px-4 border-b text-left">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {report.records.map((record) => (
                    <tr key={record._id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{record.staffId}</td>
                      <td className="py-2 px-4 border-b">{record.staff?.name}</td>
                      <td className="py-2 px-4 border-b capitalize">{record.staff?.department}</td>
                      <td className="py-2 px-4 border-b">{record.staff?.cabinNo || '-'}</td>
                      <td className="py-2 px-4 border-b">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            record.status === 'present'
                              ? 'bg-green-100 text-green-800'
                              : record.status === 'absent'
                              ? 'bg-red-100 text-red-800'
                              : record.status === 'leave'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-2 px-4 border-b">{record.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {report.missingStaff.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Unmarked Staff ({report.missingStaff.length})</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border-b text-left">Staff ID</th>
                      <th className="py-2 px-4 border-b text-left">Name</th>
                      <th className="py-2 px-4 border-b text-left">Department</th>
                      <th className="py-2 px-4 border-b text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.missingStaff.map((staff) => (
                      <tr key={staff._id} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border-b">{staff.staffId}</td>
                        <td className="py-2 px-4 border-b">{staff.name}</td>
                        <td className="py-2 px-4 border-b capitalize">{staff.department}</td>
                        <td className="py-2 px-4 border-b">
                          <button className="text-blue-600 hover:text-blue-800">
                            Mark Attendance
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DailyReport;