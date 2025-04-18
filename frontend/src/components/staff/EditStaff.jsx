import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { staffService } from '../../services/staffService';

const EditStaff = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    staffId: '',
    department: '',
    cabinNo: '',
    yearOfJoining: new Date().getFullYear(),
    phoneNumber: '',
    email: '',
    designation: '',
    active: true
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  const departments = [
    'stateboard',
    'matric',
    'aone',
    'administration',
    'management',
    'other'
  ];

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const data = await staffService.getStaffById(id);
        setFormData(data);
      } catch (err) {
        console.error('Error fetching staff:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await staffService.updateStaff(id, formData);
      setSuccessMessage('✅ Staff updated successfully!');
      setTimeout(() => {
        navigate('/staff');
      }, 2000);
    } catch (err) {
      console.error('Error updating staff:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="staff-form">
      <style>
        {`
          .success-message {
            background: #d4edda;
            color: #155724;
            padding: 1rem;
            border-radius: 5px;
            margin-bottom: 1rem;
            text-align: center;
            border: 1px solid #c3e6cb;
            font-family: 'Segoe UI', sans-serif;
            font-size: 1rem;
          }

          .staff-form {
            max-width: 700px;
            margin: 2rem auto;
            padding: 2rem;
            background: #fff;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            font-family: 'Segoe UI', sans-serif;
          }

          .staff-form__title {
            text-align: center;
            font-size: 1.8rem;
            font-weight: bold;
            margin-bottom: 1.5rem;
            color: #333;
          }

          .form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.2rem;
          }

          .form-group {
            display: flex;
            flex-direction: column;
          }

          .form-label {
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: #555;
          }

          .form-input {
            padding: 0.6rem;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 1rem;
            background-color: #f9f9f9;
          }

          .form-checkbox {
            flex-direction: row;
            align-items: center;
            gap: 0.5rem;
            margin-top: 1.5rem;
          }

          .form-actions {
            margin-top: 2rem;
            display: flex;
            justify-content: space-between;
          }

          .btn-submit {
            background: #2d6cdf;
            color: white;
            padding: 0.7rem 1.5rem;
            font-weight: bold;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: background 0.3s ease;
          }

          .btn-submit:hover {
            background: #174ea6;
          }
        `}
      </style>

      <h1 className="staff-form__title">Edit Staff</h1>

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" />
          </div>

          <div className="form-group">
            <label className="form-label">Staff ID *</label>
            <input type="text" name="staffId" value={formData.staffId} onChange={handleChange} className="form-input" />
          </div>

          <div className="form-group">
            <label className="form-label">Department *</label>
            <select name="department" value={formData.department} onChange={handleChange} className="form-input">
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Designation</label>
            <input type="text" name="designation" value={formData.designation} onChange={handleChange} className="form-input" />
          </div>

          <div className="form-group">
            <label className="form-label">Cabin Number</label>
            <input type="text" name="cabinNo" value={formData.cabinNo} onChange={handleChange} className="form-input" />
          </div>

          <div className="form-group">
            <label className="form-label">Year of Joining *</label>
            <input type="number" name="yearOfJoining" value={formData.yearOfJoining} onChange={handleChange} min="1980" max={new Date().getFullYear()} className="form-input" />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="form-input" />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" />
          </div>

          <div className="form-group form-checkbox">
            <input type="checkbox" id="active" name="active" checked={formData.active} onChange={handleChange} className="checkbox-input" />
            <label htmlFor="active" className="form-label">Active</label>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Saving...' : 'Update Staff'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditStaff;
