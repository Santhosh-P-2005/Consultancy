import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { staffService } from '../../services/staffService';
import { attendanceService } from '../../services/attendanceService';
import { formatDate } from '../../utils/dateUtils';

const AttendanceForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    staffId: '',
    date: formatDate(new Date()),
    status: 'present',
    notes: ''
  });
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);
        const staffData = await staffService.getAllStaff({ active: true });
        setStaff(staffData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch staff data');
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      await attendanceService.markAttendance(formData);
      
      setSuccess(true);
      // Reset form
      setFormData({
        staffId: '',
        date: formatDate(new Date()),
        status: 'present',
        notes: ''
      });
      
      setLoading(false);
      
      // Show success message for 3 seconds then redirect
      setTimeout(() => {
        navigate('/attendance');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to mark attendance');
      setLoading(false);
    }
  };

  return (
    <div className="attendance-form">
      <h2 className="title">Mark Attendance</h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {success && (
        <div className="success-message">
          Attendance marked successfully! Redirecting...
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="staffId" className="label">
            Staff Member
          </label>
          <select
            id="staffId"
            name="staffId"
            value={formData.staffId}
            onChange={handleChange}
            className="input"
            required
          >
            <option value="">Select Staff Member</option>
            {staff.map(member => (
              <option key={member._id} value={member.staffId}>
                {member.name} ({member.staffId}) - {member.department}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="date" className="label">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="input"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="status" className="label">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="input"
            required
          >
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="leave">Leave</option>
            <option value="halfday">Half Day</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="notes" className="label">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="input"
            rows="3"
          />
        </div>
        
        <div className="form-actions">
          <button
            type="submit"
            className="btn submit"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Mark Attendance'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/attendance')}
            className="btn cancel"
          >
            Cancel
          </button>
        </div>
      </form>
      
      <style jsx>{`
        .attendance-form {
          background-color: white;
          padding: 24px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          max-width: 600px;
          margin: 0 auto;
        }

        .title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 24px;
          text-align: center;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .label {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
          display: block;
        }

        .input {
          width: 100%;
          padding: 10px;
          border-radius: 4px;
          border: 1px solid #ccc;
          font-size: 14px;
          box-sizing: border-box;
        }

        .form-actions {
          display: flex;
          justify-content: space-between;
        }

        .btn {
          padding: 10px 16px;
          font-size: 14px;
          font-weight: bold;
          border-radius: 4px;
          cursor: pointer;
          border: none;
        }

        .submit {
          background-color: #3b82f6;
          color: white;
        }

        .submit:hover {
          background-color: #2563eb;
        }

        .cancel {
          background-color: #6b7280;
          color: white;
        }

        .cancel:hover {
          background-color: #4b5563;
        }

        .error-message {
          background-color: #f87171;
          color: white;
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 16px;
          text-align: center;
        }

        .success-message {
          background-color: #34d399;
          color: white;
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 16px;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default AttendanceForm;
