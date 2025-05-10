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
    <div className="container">
      <h2 className="header">Monthly Attendance Report</h2>
      
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <div className="input-group">
            <label htmlFor="month" className="label">Month</label>
            <select
              id="month"
              className="select"
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
          <div className="input-group">
            <label htmlFor="year" className="label">Year</label>
            <select
              id="year"
              className="select"
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
          <button type="submit" className="btn-primary">Generate Report</button>
          <button type="button" className="btn-secondary" onClick={handleExport}>Export to Excel</button>
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
          <div className="summary">
            <h3 className="summary-title">
              Monthly Summary for {report.summary.month} {report.summary.year}
            </h3>
            <div className="summary-stats">
              <div className="stat">
                <div className="stat-label">Working Days</div>
                <div className="stat-value">{report.summary.workingDays}</div>
              </div>
              <div className="stat">
                <div className="stat-label">Total Staff</div>
                <div className="stat-value">{report.summary.totalStaff}</div>
              </div>
              <div className="stat">
                <div className="stat-label">Avg. Attendance</div>
                <div className="stat-value">{report.summary.averageAttendance}%</div>
              </div>
            </div>
          </div>

          <div className="attendance-stats">
            <h3 className="table-title">Staff Attendance Statistics</h3>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Staff ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Present Days</th>
                    <th>Absent Days</th>
                    <th>Unmarked</th>
                    <th>Attendance %</th>
                  </tr>
                </thead>
                <tbody>
                  {report.staffReports.map((staff) => (
                    <tr key={staff._id}>
                      <td>{staff.staffId}</td>
                      <td>{staff.name}</td>
                      <td>{staff.department}</td>
                      <td className="green">{staff.totalPresent}</td>
                      <td className="red">{staff.totalAbsent}</td>
                      <td className="yellow">{staff.totalUnmarked}</td>
                      <td>
                        <div className="progress-bar">
                          <div className="progress" style={{ width: `${staff.attendancePercentage}%` }}></div>
                        </div>
                        <span>{staff.attendancePercentage}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="day-wise">
            <h3 className="table-title">Day-wise Attendance Details</h3>
            <p>Select a staff member from the table above to view their detailed attendance record.</p>
          </div>
        </div>
      )}

      <style jsx>{`
        .container {
          background-color: white;
          padding: 2rem;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .header {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 1.5rem;
        }

        .form {
          margin-bottom: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .input-group {
          flex: 1;
          min-width: 200px;
        }

        .label {
          display: block;
          font-size: 0.875rem;
          font-weight: medium;
          margin-bottom: 0.5rem;
        }

        .select {
          width: 100%;
          padding: 0.5rem;
          border-radius: 0.375rem;
          border: 1px solid #e2e8f0;
        }

        .btn-primary {
          background-color: #2563eb;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          margin-left: 1rem;
          cursor: pointer;
          margin-top: 30px;
        }

        .btn-primary:hover {
          background-color: #1d4ed8;
        }

        .btn-secondary {
          background-color: #16a34a;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          cursor: pointer;
          margin-top: 30px;
        }

        .btn-secondary:hover {
          background-color: #15803d;
        }

        .loading {
          text-align: center;
          padding: 1rem;
        }

        .error {
          background-color: #fed7d7;
          color: #e53e3e;
          padding: 1rem;
          border-radius: 0.375rem;
          margin-bottom: 1rem;
        }

        .summary {
          background-color: #f7fafc;
          padding: 1rem;
          border-radius: 0.375rem;
          margin-bottom: 1.5rem;
        }

        .summary-title {
          font-size: 1.25rem;
          font-weight: semibold;
          margin-bottom: 0.75rem;
        }

        .summary-stats {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }

        .stat {
          background-color: white;
          padding: 1rem;
          border-radius: 0.375rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .stat-label {
          font-size: 0.875rem;
          color: #4a5568;
        }

        .stat-value {
          font-size: 1.25rem;
          font-weight: bold;
          margin-top: 0.5rem;
        }

        .attendance-stats {
          margin-bottom: 1.5rem;
        }

        .table-title {
          font-size: 1.25rem;
          font-weight: semibold;
          margin-bottom: 1rem;
        }

        .table-responsive {
          overflow-x: auto;
        }

        .table {
          width: 100%;
          background-color: white;
          border-collapse: collapse;
          border: 1px solid #edf2f7;
        }

        .table th,
        .table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #edf2f7;
        }

        .green {
          color: #38a169;
        }

        .red {
          color: #e53e3e;
        }

        .yellow {
          color: #ecc94b;
        }

        .progress-bar {
          background-color: #edf2f7;
          border-radius: 9999px;
          height: 0.5rem;
          margin-right: 0.5rem;
          width: 100%;
        }

        .progress {
          background-color: #3182ce;
          height: 100%;
          border-radius: 9999px;
        }

        .day-wise {
          background-color: #f7fafc;
          padding: 1rem;
          border-radius: 0.375rem;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default MonthlyReport;
