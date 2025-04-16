// src/components/reports/MonthlyReport.jsx
import React, { useState, useEffect } from 'react';
import { attendanceService } from '../../services/attendanceService';
import { getCurrentMonth, getCurrentYear } from '../../utils/dateUtils';

const MonthlyReport = () => {
  const [month, setMonth] = useState(getCurrentMonth());
  const [year, setYear] = useState(getCurrentYear());
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await attendanceService.getMonthlyReport(month, year);
      setReport(data);
    } catch (err) {
      console.error('Error fetching monthly report:', err);
      setError('Failed to load monthly report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleMonthChange = (e) => {
    setMonth(parseInt(e.target.value));
  };

  const handleYearChange = (e) => {
    setYear(parseInt(e.target.value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchReport();
  };

  const handleExport = async () => {
    try {
      await attendanceService.exportReport('monthly', { month, year });
    } catch (err) {
      console.error('Error exporting report:', err);
      setError('Failed to export report. Please try again.');
    }
  };

  // Generate years for dropdown (current year and 5 years back)
  const years = Array.from({ length: 6 }, (_, i) => getCurrentYear() - i);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Monthly Attendance Report</h2>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="w-full md:w-1/4">
            <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">
              Month
            </label>
            <select
              id="month"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={month}
              onChange={handleMonthChange}
            >
              <option value={1}>January</option>
              <option value={2}>February</option>
              <option value={3}>March</option>
              <option value={4}>April</option>
              <option value={5}>May</option>
              <option value={6}>June</option>
              <option value={7}>July</option>
              <option value={8}>August</option>
              <option value={9}>September</option>
              <option value={10}>October</option>
              <option value={11}>November</option>
              <option value={12}>December</option>
            </select>
          </div>
          <div className="w-full md:w-1/4">
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <select
              id="year"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={year}
              onChange={handleYearChange}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
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
            <h3 className="text-lg font-semibold mb-2">
              Monthly Summary for {report.summary.month} {report.summary.year}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-3 rounded shadow-sm">
                <div className="text-sm text-gray-500">Working Days</div>
                <div className="text-2xl font-bold">{report.summary.workingDays}</div>
              </div>
              <div className="bg-white p-3 rounded shadow-sm">
                <div className="text-sm text-gray-500">Total Staff</div>
                <div className="text-2xl font-bold">{report.summary.totalStaff}</div>
              </div>
              <div className="bg-white p-3 rounded shadow-sm">
                <div className="text-sm text-gray-500">Avg. Attendance</div>
                <div className="text-2xl font-bold">{report.summary.averageAttendance}%</div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Staff Attendance Statistics</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border-b text-left">Staff ID</th>
                    <th className="py-2 px-4 border-b text-left">Name</th>
                    <th className="py-2 px-4 border-b text-left">Department</th>
                    <th className="py-2 px-4 border-b text-center">Present Days</th>
                    <th className="py-2 px-4 border-b text-center">Absent Days</th>
                    <th className="py-2 px-4 border-b text-center">Unmarked</th>
                    <th className="py-2 px-4 border-b text-center">Attendance %</th>
                  </tr>
                </thead>
                <tbody>
                  {report.staffReports.map((staff) => (
                    <tr key={staff._id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{staff.staffId}</td>
                      <td className="py-2 px-4 border-b">{staff.name}</td>
                      <td className="py-2 px-4 border-b capitalize">{staff.department}</td>
                      <td className="py-2 px-4 border-b text-center text-green-600">
                        {staff.totalPresent}
                      </td>
                      <td className="py-2 px-4 border-b text-center text-red-600">
                        {staff.totalAbsent}
                      </td>
                      <td className="py-2 px-4 border-b text-center text-yellow-600">
                        {staff.totalUnmarked}
                      </td>
                      <td className="py-2 px-4 border-b">
                        <div className="flex items-center justify-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2.5 mr-2">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full" 
                              style={{ width: `${staff.attendancePercentage}%` }}
                            ></div>
                          </div>
                          <span>{staff.attendancePercentage}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Day-wise Attendance Details</h3>
            <p className="text-sm text-gray-500 mb-4">
              Click on a staff member to view their detailed day-wise attendance for the month.
            </p>
            
            {/* This could be expanded with a detailed calendar view or a collapsible section */}
            <div className="bg-gray-50 p-4 rounded text-center">
              <p>Select a staff member from the table above to view their detailed attendance record.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyReport;