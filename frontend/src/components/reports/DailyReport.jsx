// src/components/reports/DailyReport.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
      await attendanceService.exportReport('daily', { startDate: reportDate });
    } catch (err) {
      console.error('Error exporting report:', err);
      setError('Failed to export report. Please try again.');
    }
  };

  return (
    <div className="container">
      <h2 className="title">Daily Attendance Report</h2>
      
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <div className="input-group">
            <label htmlFor="reportDate" className="label">Select Date</label>
            <input
              type="date"
              id="reportDate"
              className="input"
              value={reportDate}
              onChange={handleDateChange}
            />
          </div>
          <button
            type="submit"
            className="btn btn-blue"
          >
            Generate Report
          </button>
          <button
            type="button"
            className="btn btn-green"
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
          <div className="summary">
            <h3 className="summary-title">Summary for {formatDisplayDate(report.date)}</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <div className="summary-label">Total Staff</div>
                <div className="summary-value">{report.totalStaff}</div>
              </div>
              <div className="summary-item green">
                <div className="summary-label">Present</div>
                <div className="summary-value green">{report.present}</div>
              </div>
              <div className="summary-item red">
                <div className="summary-label">Absent</div>
                <div className="summary-value red">{report.absent}</div>
              </div>
              <div className="summary-item yellow">
                <div className="summary-label">Unmarked</div>
                <div className="summary-value yellow">{report.unmarked}</div>
              </div>
            </div>
          </div>

          <div className="attendance-records">
            <h3 className="section-title">Attendance Records</h3>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr className="table-header">
                    <th>Staff ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Cabin</th>
                    <th>Status</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {report.records.map((record) => (
                    <tr key={record._id} className="table-row">
                      <td>{record.staffId}</td>
                      <td>{record.staff?.name}</td>
                      <td>{record.staff?.department}</td>
                      <td>{record.staff?.cabinNo || '-'}</td>
                      <td className={`status ${record.status}`}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </td>
                      <td>{record.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {report.missingStaff.length > 0 && (
            <div className="unmarked-staff">
              <h3 className="section-title">Unmarked Staff ({report.missingStaff.length})</h3>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr className="table-header">
                      <th>Staff ID</th>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.missingStaff.map((staff) => (
                      <tr key={staff._id} className="table-row">
                        <td>{staff.staffId}</td>
                        <td>{staff.name}</td>
                        <td>{staff.department}</td>
                        <td>
                          <Link to={`/attendance/mark`} className="edit-btn">
                            Mark Attendance
                          </Link>
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
      <style jsx>{`
        .container {
          background: white;
          padding: 2rem;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .title {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 1.5rem;
        }
        .form {
          margin-bottom: 1.5rem;
        }
        .form-group {
          display: flex;
          align-items: flex-end;
          gap: 1rem;
        }
        .input-group {
          flex-grow: 1;
        }
        .label {
          display: block;
          font-size: 0.875rem;
          color: #4b5563;
          margin-bottom: 0.25rem;
        }
        .input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
        }
        .btn {
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          color: white;
        }
        .edit-btn
        {
          color: #eab308;
          background-color:rgba(241, 244, 80, 0.71);
          padding :5px;
          border-radius: 0.375rem;
        }
        .btn-blue {
          background-color: #2563eb;
        }
        .btn-blue:hover {
          background-color: #1d4ed8;
        }
        .btn-green {
          background-color: #16a34a;
        }
        .btn-green:hover {
          background-color: #15803d;
        }
        .loading {
          text-align: center;
          padding: 1rem;
        }
        .error {
          background-color: #fee2e2;
          color: #f87171;
          padding: 0.75rem;
          border-radius: 0.375rem;
          margin-bottom: 1.5rem;
        }
        .summary {
          background-color: #f3f4f6;
          padding: 1rem;
          border-radius: 0.375rem;
          margin-bottom: 1.5rem;
        }
        .summary-title {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }
        .summary-item {
          background-color: white;
          padding: 1rem;
          border-radius: 0.375rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        .summary-item .summary-label {
          font-size: 0.875rem;
          color: #6b7280;
        }
        .summary-item .summary-value {
          font-size: 1.5rem;
          font-weight: 700;
        }
        .summary-item.green .summary-value {
          color: #16a34a;
        }
        .summary-item.red .summary-value {
          color: #ef4444;
        }
        .summary-item.yellow .summary-value {
          color: #eab308;
        }
        .attendance-records,
        .unmarked-staff {
          margin-bottom: 1.5rem;
        }
        .section-title {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        .table-container {
          overflow-x: auto;
        }
        .table {
          min-width: 100%;
          background-color: white;
          border-collapse: collapse;
          border: 1px solid #e5e7eb;
        }
        .table-header {
          background-color: #f3f4f6;
        }
        .table-header th {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }
        .table-row {
          transition: background-color 0.2s;
        }
        .table-row:hover {
          background-color: #f9fafb;
        }
        .table-row td {
          padding: 0.75rem;
          border-bottom: 1px solid #e5e7eb;
        }
        .status {
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
        }
        .status.present {
          background-color: #d1fae5;
          color: #10b981;
        }
        .status.absent {
          background-color: #fee2e2;
          color: #f87171;
        }
        .status.leave {
          background-color: #bfdbfe;
          color: #3b82f6;
        }
        .status.unmarked {
          background-color: #fef9c3;
          color: #f59e0b;
        }
        .btn-action {
          color: #2563eb;
          background: none;
          border: none;
          cursor: pointer;
        }
        .btn-action:hover {
          color: #1d4ed8;
        }
      `}</style>
    </div>
  );
};

export default DailyReport;
