// src/components/reports/WeeklyReport.jsx
import React, { useState, useEffect } from 'react';
import { attendanceService } from '../../services/attendanceService';
import { formatDisplayDate, formatDate, getWeekDates } from '../../utils/dateUtils';

const WeeklyReport = () => {
  const [reportDate, setReportDate] = useState(formatDate(new Date()));
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [weekDays, setWeekDays] = useState([]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await attendanceService.getWeeklyReport(reportDate);
      setReport(data);
      
      // Get array of weekdays for the selected date
      const dates = getWeekDates(new Date(reportDate));
      setWeekDays(dates.map(date => formatDate(date)));
    } catch (err) {
      console.error('Error fetching weekly report:', err);
      setError('Failed to load weekly report. Please try again.');
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
      await attendanceService.exportReport('weekly', { date: reportDate });
    } catch (err) {
      console.error('Error exporting report:', err);
      setError('Failed to export report. Please try again.');
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'leave':
        return 'bg-blue-100 text-blue-800';
      case 'halfday':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Weekly Attendance Report</h2>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label htmlFor="reportDate" className="block text-sm font-medium text-gray-700 mb-1">
              Select Any Date in the Week
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
            <h3 className="text-lg font-semibold mb-2">
              Weekly Summary ({formatDisplayDate(report.summary.startDate)} - {formatDisplayDate(report.summary.endDate)})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white p-3 rounded shadow-sm">
                <div className="text-sm text-gray-500">Total Staff</div>
                <div className="text-2xl font-bold">{report.summary.totalStaff}</div>
              </div>
              <div className="bg-white p-3 rounded shadow-sm">
                <div className="text-sm text-gray-500">Working Days</div>
                <div className="text-2xl font-bold">{report.summary.totalDays}</div>
              </div>
            </div>
            
            <h4 className="font-medium mb-2">Daily Attendance</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border-b text-left">Date</th>
                    <th className="py-2 px-4 border-b text-left">Present</th>
                    <th className="py-2 px-4 border-b text-left">Absent</th>
                    <th className="py-2 px-4 border-b text-left">Attendance %</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(report.summary.dailyPresent).map((day) => {
                    const presentCount = report.summary.dailyPresent[day] || 0;
                    const absentCount = report.summary.dailyAbsent[day] || 0;
                    const total = presentCount + absentCount;
                    const percentage = total ? ((presentCount / total) * 100).toFixed(1) : 0;
                    
                    return (
                      <tr key={day} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border-b">{formatDisplayDate(new Date(day))}</td>
                        <td className="py-2 px-4 border-b text-green-600">{presentCount}</td>
                        <td className="py-2 px-4 border-b text-red-600">{absentCount}</td>
                        <td className="py-2 px-4 border-b">
                          <div className="flex items-center">
                            <div className="w-24 bg-gray-200 rounded-full h-2.5 mr-2">
                              <div 
                                className="bg-blue-600 h-2.5 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span>{percentage}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Staff Attendance Details</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border-b text-left">Staff ID</th>
                    <th className="py-2 px-4 border-b text-left">Name</th>
                    <th className="py-2 px-4 border-b text-left">Department</th>
                    {weekDays.slice(0, 5).map((day) => (
                      <th key={day} className="py-2 px-4 border-b text-center">
                        {new Date(day).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(report.staffAttendance).map(([staffId, data]) => (
                    <tr key={staffId} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{staffId}</td>
                      <td className="py-2 px-4 border-b">{data.staff?.name}</td>
                      <td className="py-2 px-4 border-b capitalize">{data.staff?.department}</td>
                      {weekDays.slice(0, 5).map((day) => {
                        const status = data.days[day] || 'unmarked';
                        return (
                          <td key={day} className="py-2 px-4 border-b text-center">
                            {status !== 'unmarked' ? (
                              <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(status)}`}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyReport;