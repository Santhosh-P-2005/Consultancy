import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { staffService } from '../../services/staffService';
import { attendanceService } from '../../services/attendanceService';
import { formatDate } from '../../utils/dateUtils';

const BulkAttendance = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(formatDate(new Date()));
  const [department, setDepartment] = useState('');
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch departments
        const departmentsData = await staffService.getDepartments();
        setDepartments(departmentsData);
        
        // Fetch all active staff
        const staffData = await staffService.getAllStaff({ active: true });
        setStaff(staffData);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch staff data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filter staff by department if selected
    if (department) {
      setFilteredStaff(staff.filter(member => member.department === department));
    } else {
      setFilteredStaff(staff);
    }
    
    // Initialize attendance data array with default values
    const initialAttendanceData = (department ? 
      staff.filter(member => member.department === department) : 
      staff).map(member => ({
        staffId: member.staffId,
        name: member.name,
        status: 'present',
        notes: ''
      }));
    
    setAttendanceData(initialAttendanceData);
  }, [department, staff]);

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleDepartmentChange = (e) => {
    setDepartment(e.target.value);
  };

  const handleStatusChange = (staffId, status) => {
    setAttendanceData(prevData => prevData.map(item => 
      item.staffId === staffId ? { ...item, status } : item
    ));
  };

  const handleNotesChange = (staffId, notes) => {
    setAttendanceData(prevData => prevData.map(item => 
      item.staffId === staffId ? { ...item, notes } : item
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Submit attendance for each staff
      const promises = attendanceData.map(item => 
        attendanceService.markAttendance({
          staffId: item.staffId,
          date,
          status: item.status,
          notes: item.notes
        })
      );
      
      await Promise.all(promises);
      
      setSuccess(true);
      setLoading(false);
      
      // Show success message for 3 seconds then redirect
      setTimeout(() => {
        navigate('/attendance');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to mark bulk attendance');
      setLoading(false);
    }
  };

  return (
    <div className="bulk-attendance-container">
      <h2 className="heading">Bulk Attendance Entry</h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {success && (
        <div className="success-message">
          Attendance marked successfully for all staff! Redirecting...
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <div>
            <label htmlFor="date" className="label">Date</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={handleDateChange}
              className="input-field"
              required
            />
          </div>
          
          <div>
            <label htmlFor="department" className="label">Department (Optional)</label>
            <select
              id="department"
              value={department}
              onChange={handleDepartmentChange}
              className="input-field"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept.charAt(0).toUpperCase() + dept.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="loading-message">Loading staff data...</div>
        ) : filteredStaff.length === 0 ? (
          <div className="loading-message">No staff found for the selected department.</div>
        ) : (
          <div className="table-container">
            <table className="staff-table">
              <thead>
                <tr>
                  <th>Staff ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((member) => {
                  const attendanceEntry = attendanceData.find(item => item.staffId === member.staffId) || {
                    status: 'present',
                    notes: ''
                  };
                  
                  return (
                    <tr key={member._id}>
                      <td>{member.staffId}</td>
                      <td>{member.name}</td>
                      <td>{member.department.charAt(0).toUpperCase() + member.department.slice(1)}</td>
                      <td>
                        <select
                          value={attendanceEntry.status}
                          onChange={(e) => handleStatusChange(member.staffId, e.target.value)}
                          className="status-select"
                        >
                          <option value="present">Present</option>
                          <option value="absent">Absent</option>
                          <option value="leave">Leave</option>
                          <option value="halfday">Half Day</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          value={attendanceEntry.notes}
                          onChange={(e) => handleNotesChange(member.staffId, e.target.value)}
                          placeholder="Optional notes"
                          className="notes-input"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="action-buttons">
          <button
            type="submit"
            className="submit-button"
            disabled={loading || filteredStaff.length === 0}
          >
            {loading ? 'Processing...' : 'Submit Bulk Attendance'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/attendance')}
            className="cancel-button"
          >
            Cancel
          </button>
        </div>
      </form>

      <style jsx>{`
        .bulk-attendance-container {
          background-color: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .heading {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 1.5rem;
        }

        .error-message, .success-message {
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .error-message {
          background-color: #fce4e4;
          border: 1px solid #f3b2b2;
          color: #f44336;
        }

        .success-message {
          background-color: #e8f5e9;
          border: 1px solid #81c784;
          color: #388e3c;
        }

        .form-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .label {
          display: block;
          font-weight: bold;
          color: #4a4a4a;
          margin-bottom: 0.5rem;
        }

        .input-field {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
          color: #4a4a4a;
        }

        .loading-message {
          text-align: center;
          padding: 1rem;
          font-size: 1rem;
          color: #4a4a4a;
        }

        .table-container {
          overflow-x: auto;
        }

        .staff-table {
          width: 100%;
          border-collapse: collapse;
        }

        .staff-table th, .staff-table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        .status-select, .notes-input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
        }

        .action-buttons {
          display: flex;
          justify-content: space-between;
        }

        .submit-button, .cancel-button {
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }

        .submit-button {
          background-color: #007bff;
          color: white;
          border: none;
        }

        .submit-button:hover {
          background-color: #0056b3;
        }

        .cancel-button {
          background-color: #6c757d;
          color: white;
          border: none;
        }

        .cancel-button:hover {
          background-color: #5a6268;
        }
      `}</style>
    </div>
  );
};

export default BulkAttendance;
