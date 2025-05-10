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
      await attendanceService.exportReport('weekly', { startDate: reportDate });
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
    <div className="weekly-report">
      <style>
        {`
          .weekly-report {
            background-color: #fff;
            padding: 1.5rem;
            border-radius: 0.375rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .weekly-report h2 {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 1.5rem;
          }
          .weekly-report form {
            margin-bottom: 1.5rem;
          }
          .weekly-report .form-group {
            display: flex;
            gap: 1rem;
            align-items: flex-end;
          }
          .weekly-report .form-group .input {
            flex: 1;
            padding: 0.5rem;
            border: 1px solid #d1d5db;
            border-radius: 0.375rem;
          }
          .weekly-report .form-group .btn {
            padding: 0.5rem 1rem;
            border-radius: 0.375rem;
            font-weight: 500;
            cursor: pointer;
          }
          .weekly-report .btn-submit {
            background-color: #2563eb;
            color: white;
            border: none;
          }
          .weekly-report .btn-submit:hover {
            background-color: #1d4ed8;
          }
          .weekly-report .btn-export {
            background-color: #16a34a;
            color: white;
            border: none;
          }
          .weekly-report .btn-export:hover {
            background-color: #15803d;
          }
          .weekly-report .loading {
            text-align: center;
            padding: 1rem;
          }
          .weekly-report .error {
            background-color: #fecaca;
            color: #b91c1c;
            padding: 0.75rem;
            border-radius: 0.375rem;
            margin-bottom: 1rem;
          }
          .weekly-report .summary-section {
            background-color: #f3f4f6;
            padding: 1rem;
            border-radius: 0.375rem;
            margin-bottom: 1.5rem;
          }
          .weekly-report .summary-section h3 {
            font-size: 1.125rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
          }
          .weekly-report .summary-section .summary-item {
            background-color: #fff;
            padding: 1rem;
            border-radius: 0.375rem;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
            text-align: center;
            margin-bottom: 1rem;
          }
          .weekly-report .summary-section .summary-item .label {
            font-size: 0.875rem;
            color: #6b7280;
          }
          .weekly-report .summary-section .summary-item .value {
            font-size: 1.25rem;
            font-weight: 700;
          }
          .weekly-report .attendance-table {
            min-width: 100%;
            background-color: #fff;
            border: 1px solid #e5e7eb;
            border-radius: 0.375rem;
          }
          .weekly-report .attendance-table th, .weekly-report .attendance-table td {
            padding: 0.75rem;
            border: 1px solid #e5e7eb;
            text-align: left;
          }
          .weekly-report .attendance-table th {
            background-color: #f3f4f6;
          }
          .weekly-report .attendance-table tr:hover {
            background-color: #f9fafb;
          }
          .weekly-report .status-pill {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            font-size: 0.875rem;
            border-radius: 0.375rem;
            text-transform: capitalize;
          }
          .weekly-report .status-pill.present {
            background-color: #d1fae5;
            color: #15803d;
          }
          .weekly-report .status-pill.absent {
            background-color: #fee2e2;
            color: #b91c1c;
          }
          .weekly-report .status-pill.leave {
            background-color: #bfdbfe;
            color: #1e3a8a;
          }
          .weekly-report .status-pill.halfday {
            background-color: #fef08a;
            color: #9c5e1f;
          }
        `}
      </style>

      <h2>Weekly Attendance Report</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <div className="input">
            <label htmlFor="reportDate" className="text-sm font-medium text-gray-700 mb-1">
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
          <button type="submit" className="btn btn-submit">
            Generate Report
          </button>
          <button
            type="button"
            className="btn btn-export"
            onClick={handleExport}
          >
            Export to Excel
          </button>
        </div>
      </form>

      {loading && <div className="loading">Loading report...</div>}

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {report && !loading && (
        <div>
          <div className="summary-section">
            <h3>Weekly Summary ({formatDisplayDate(report.summary.startDate)} - {formatDisplayDate(report.summary.endDate)})</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <div className="summary-item">
                <div className="label">Total Staff</div>
                <div className="value">{report.summary.totalStaff}</div>
              </div>
              <div className="summary-item">
                <div className="label">Working Days</div>
                <div className="value">{report.summary.totalDays}</div>
              </div>
            </div>

            <h4 className="font-medium mb-2">Daily Attendance</h4>
            <div className="overflow-x-auto">
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Present</th>
                    <th>Absent</th>
                    <th>Attendance %</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(report.summary.dailyPresent).map((day) => {
                    const presentCount = report.summary.dailyPresent[day] || 0;
                    const absentCount = report.summary.dailyAbsent[day] || 0;
                    const total = presentCount + absentCount;
                    const percentage = total ? ((presentCount / total) * 100).toFixed(1) : 0;

                    return (
                      <tr key={day}>
                        <td>{formatDisplayDate(new Date(day))}</td>
                        <td>{presentCount}</td>
                        <td>{absentCount}</td>
                        <td>
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

          <div>
            <h3>Staff Attendance Details</h3>
            <div className="overflow-x-auto">
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Staff ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    {weekDays.slice(0, 5).map((day) => (
                      <th key={day}>{new Date(day).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(report.staffAttendance).map(([staffId, data]) => (
                    <tr key={staffId}>
                      <td>{staffId}</td>
                      <td>{data.staff?.name}</td>
                      <td>{data.staff?.department}</td>
                      {weekDays.slice(0, 5).map((day) => {
                        const status = data.days[day] || 'unmarked';
                        return (
                          <td key={day} className="text-center">
                            {status !== 'unmarked' ? (
                              <span className={`status-pill ${status}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                            ) : (
                              <span>-</span>
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
