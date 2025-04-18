import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { attendanceService } from '../../services/attendanceService';
import { staffService } from '../../services/staffService';

const EditAttendance = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [attendance, setAttendance] = useState(null);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // ✅ new

  const [formData, setFormData] = useState({
    status: '',
    notes: '',
    date: '',
  });

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const data = await attendanceService.getAttendanceById(id);
        setAttendance(data);
        setFormData({
          status: data.status,
          notes: data.notes || '',
          date: data.date || '',
        });
        const staffList = await staffService.getAllStaff();
        setStaff(staffList);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch attendance record');
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await attendanceService.updateAttendance(id, formData);
      setSuccessMessage('✅ Attendance updated successfully!'); // ✅ show message
      setTimeout(() => {
        navigate('/attendance'); // ✅ delay before redirect
      }, 2000);
    } catch (err) {
      setError('❌ Failed to update attendance');
    }
  };

  if (loading) return <div>Loading attendance record...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="edit-attendance-container">
      <style>
        {`
          .edit-attendance-container {
            background: #fefefe;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            max-width: 600px;
            margin: 2rem auto;
            font-family: 'Segoe UI', sans-serif;
          }
          h2 {
            font-size: 1.8rem;
            font-weight: bold;
            color: #333;
            margin-bottom: 1rem;
            text-align: center;
          }
          form label {
            display: block;
            font-weight: 600;
            margin-top: 1rem;
            color: #555;
          }
          form select, form textarea, form input[type="date"] {
            width: 100%;
            padding: 0.6rem;
            margin-top: 0.5rem;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 1rem;
            background-color: #f9f9f9;
          }
          .submit-btn {
            margin-top: 1.5rem;
            background: #2d6cdf;
            color: white;
            padding: 0.7rem 1.5rem;
            font-weight: bold;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: background 0.3s ease;
            width: 100%;
          }
          .submit-btn:hover {
            background: #174ea6;
          }
          .success-message {
            background: #d4edda;
            color: #155724;
            padding: 1rem;
            border-radius: 5px;
            margin-bottom: 1rem;
            text-align: center;
            border: 1px solid #c3e6cb;
          }
          .error-message {
            background: #f8d7da;
            color: #721c24;
            padding: 1rem;
            border-radius: 5px;
            margin-bottom: 1rem;
            text-align: center;
            border: 1px solid #f5c6cb;
          }
        `}
      </style>

      <h2>Edit Attendance</h2>

      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      <form onSubmit={handleSubmit}>
        <label>Staff</label>
        <div>
          {attendance.staff?.name} ({attendance.staff?.staffId})
        </div>

        <label>Date</label>
        {attendance.date ? (
          <div>{new Date(attendance.date).toLocaleDateString()}</div>
        ) : (
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        )}

        <label>Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
        >
          <option value="">Select Status</option>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="leave">Leave</option>
          <option value="halfday">Half Day</option>
        </select>

        <label>Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
        />

        <button type="submit" className="submit-btn">Update Attendance</button>
      </form>
    </div>
  );
};

export default EditAttendance;
