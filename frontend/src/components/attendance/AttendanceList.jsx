import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { attendanceService } from '../../services/attendanceService';
import { staffService } from '../../services/staffService';
import { formatDisplayDate } from '../../utils/dateUtils';

const AttendanceList = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    staffId: '',
    department: '',
    status: ''
  });
  const [departments, setDepartments] = useState([]);
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch departments for filter
        const departmentsData = await staffService.getDepartments();
        setDepartments(departmentsData);
        
        // Fetch staff for filter
        const staffData = await staffService.getAllStaff();
        setStaff(staffData);
        
        // Fetch attendance with current filters
        const attendanceData = await attendanceService.getAttendance(filters);
        setAttendance(attendanceData);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch attendance data');
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      staffId: '',
      department: '',
      status: ''
    });
  };

  const deleteAttendance = async (id) => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      try {
        await attendanceService.deleteAttendance(id);
        // Refresh attendance list
        const attendanceData = await attendanceService.getAttendance(filters);
        setAttendance(attendanceData);
      } catch (err) {
        setError('Failed to delete attendance record');
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'leave':
        return 'bg-yellow-100 text-yellow-800';
      case 'halfday':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="attendance-container">
      <style>
        {`
          .attendance-container {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            padding: 1.5rem;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
          }
          .header h2 {
            font-size: 1.5rem;
            font-weight: bold;
          }
          .mark-attendance-btn {
            background-color: #3182ce;
            color: white;
            font-weight: bold;
            padding: 0.5rem 1rem;
            border-radius: 0.375rem;
            transition: background-color 0.2s ease-in-out;
          }
          .mark-attendance-btn:hover {
            background-color: #2b6cb0;
          }
          .filters {
            background-color: #f7fafc;
            padding: 1rem;
            border-radius: 0.375rem;
            margin-bottom: 1.5rem;
          }
          .filters h3 {
            font-size: 1.125rem;
            font-weight: 600;
            margin-bottom: 1rem;
          }
          .filters .grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .filters .grid input, .filters .grid select {
            padding: 0.5rem;
            border-radius: 0.375rem;
            border: 1px solid #e2e8f0;
          }
          .filters button {
            background-color: #4a5568;
            color: white;
            font-weight: bold;
            padding: 0.5rem 1rem;
            border-radius: 0.375rem;
          }
          .filters button:hover {
            background-color: #2d3748;
          }
          .error-message {
            background-color: #fed7d7;
            color: #9b2c2c;
            border: 1px solid #fc8181;
            padding: 0.75rem;
            border-radius: 0.375rem;
            margin-bottom: 1.5rem;
          }
          .loading {
            text-align: center;
            padding: 1rem;
          }
          .attendance-table {
            width: 100%;
            border-collapse: collapse;
          }
          .attendance-table th, .attendance-table td {
            padding: 1rem;
            text-align: left;
            font-size: 0.875rem;
            color: #2d3748;
          }
          .attendance-table th {
            background-color: #f7fafc;
            text-transform: uppercase;
            font-weight: 600;
          }
          .status-badge {
            display: inline-flex;
            padding: 0.25rem 0.75rem;
            font-size: 0.75rem;
            font-weight: 600;
            border-radius: 9999px;
            text-transform: capitalize;
          }
          .actions {
            text-align: right;
          }
          .edit-btn, .delete-btn {
            font-weight: 600;
            cursor: pointer;
          }
          .edit-btn {
            color: #5a67d8;
            margin-right: 1rem;
          }
          .edit-btn:hover {
            color: #434190;
          }
          .delete-btn {
            color: #e53e3e;
          }
          .delete-btn:hover {
            color: #c53030;
          }
        `}
      </style>

      <div className="header">
        <h2>Attendance Records</h2>
        <Link to="/attendance/mark" className="mark-attendance-btn">
          Mark Attendance
        </Link>
      </div>

      {/* Filters */}
      <div className="filters">
        <h3>Filters</h3>
        <div className="grid">
          {/* Filter Fields */}
          <div>
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </div>
          <div>
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>
          <div>
            <label>Staff</label>
            <select
              name="staffId"
              value={filters.staffId}
              onChange={handleFilterChange}
            >
              <option value="">All Staff</option>
              {staff.map(member => (
                <option key={member._id} value={member.staffId}>
                  {member.name} ({member.staffId})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Department</label>
            <select
              name="department"
              value={filters.department}
              onChange={handleFilterChange}
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept.charAt(0).toUpperCase() + dept.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="leave">Leave</option>
              <option value="halfday">Half Day</option>
            </select>
          </div>
          <div className="filters-action">
            <button onClick={clearFilters}>Clear Filters</button>
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading attendance records...</div>
      ) : attendance.length === 0 ? (
        <div className="loading">No attendance records found.</div>
      ) : (
        <div className="attendance-table-container">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Staff</th>
                <th>Department</th>
                <th>Date</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record) => (
                <tr key={record._id}>
                  <td>{record.staff?.name || 'Unknown'}</td>
                  <td>{record.staff?.department || 'Unknown'}</td>
                  <td>{formatDisplayDate(record.date)}</td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(record.status)}`}>
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  </td>
                  <td>{record.notes || '-'}</td>
                  <td className="actions">
                    <Link to={`/attendance/${record._id}`} className="edit-btn">
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteAttendance(record._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendanceList;
