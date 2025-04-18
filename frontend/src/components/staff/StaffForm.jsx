import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { staffService } from '../../services/staffService';

const StaffForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const initialState = {
    name: '',
    staffId: '',
    department: '',
    cabinNo: '',
    yearOfJoining: new Date().getFullYear(),
    phoneNumber: '',
    email: '',
    designation: '',
    active: true
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [departments] = useState([
    'stateboard',
    'matric',
    'aone',
    'administration',
    'management',
    'other'
  ]);

  useEffect(() => {
    if (isEditMode) {
      const fetchStaff = async () => {
        try {
          setLoading(true);
          const data = await staffService.getStaffById(id);
          setFormData(data);
        } catch (err) {
          console.error('Failed to fetch staff details:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchStaff();
    }
  }, [id, isEditMode]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.staffId.trim()) {
      newErrors.staffId = 'Staff ID is required';
    }

    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    if (!formData.yearOfJoining) {
      newErrors.yearOfJoining = 'Year of joining is required';
    } else if (formData.yearOfJoining < 1980 || formData.yearOfJoining > new Date().getFullYear()) {
      newErrors.yearOfJoining = `Year must be between 1980 and ${new Date().getFullYear()}`;
    }

    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      if (isEditMode) {
        await staffService.updateStaff(id, formData);
      } else {
        await staffService.createStaff(formData);
      }

      navigate('/staff');
    } catch (err) {
      console.error('Failed to save staff:', err);
      setErrors(prev => ({ ...prev, form: err.response?.data?.error || err.message }));
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="staff-form">
      <h1 className="staff-form__title">{isEditMode ? 'Edit Staff' : 'Add New Staff'}</h1>

      {errors.form && (
        <div className="error-message">
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-input ${errors.name ? 'input-error' : ''}`}
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Staff ID *</label>
            <input
              type="text"
              name="staffId"
              value={formData.staffId}
              onChange={handleChange}
              className={`form-input ${errors.staffId ? 'input-error' : ''}`}
            />
            {errors.staffId && <p className="error-text">{errors.staffId}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Department *</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`form-input ${errors.department ? 'input-error' : ''}`}
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {errors.department && <p className="error-text">{errors.department}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Designation</label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Cabin Number</label>
            <input
              type="text"
              name="cabinNo"
              value={formData.cabinNo}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Year of Joining *</label>
            <input
              type="number"
              name="yearOfJoining"
              value={formData.yearOfJoining}
              onChange={handleChange}
              min="1980"
              max={new Date().getFullYear()}
              className={`form-input ${errors.yearOfJoining ? 'input-error' : ''}`}
            />
            {errors.yearOfJoining && <p className="error-text">{errors.yearOfJoining}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'input-error' : ''}`}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div className="form-group form-checkbox">
            <input
              type="checkbox"
              id="active"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className="checkbox-input"
            />
            <label htmlFor="active" className="form-label">Active</label>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Saving...' : isEditMode ? 'Update Staff' : 'Add Staff'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/staff')}
            className="btn-cancel"
          >
            Cancel
          </button>
        </div>
      </form>

      <style>
        {`
          .staff-form {
            background-color: white;
            padding: 24px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .staff-form__title {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 24px;
          }

          .form-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 24px;
          }

          @media (min-width: 768px) {
            .form-grid {
              grid-template-columns: 1fr 1fr;
            }
          }

          .form-group {
            margin-bottom: 16px;
          }

          .form-label {
            display: block;
            margin-bottom: 8px;
            font-weight: medium;
          }

          .form-input {
            width: 100%;
            padding: 12px;
            border-radius: 4px;
            border: 1px solid #ccc;
          }

          .form-input.input-error {
            border-color: #f44336;
          }

          .error-text {
            color: #f44336;
            font-size: 0.875rem;
            margin-top: 4px;
          }

          .form-checkbox {
            display: flex;
            align-items: center;
          }

          .checkbox-input {
            margin-right: 8px;
          }

          .form-actions {
            margin-top: 32px;
            display: flex;
            gap: 16px;
          }

          .btn-submit {
            background-color: #3b82f6;
            color: white;
            padding: 12px 24px;
            border-radius: 4px;
            border: none;
            cursor: pointer;
          }

          .btn-submit:disabled {
            background-color: #93c5fd;
          }

          .btn-submit:hover {
            background-color: #2563eb;
          }

          .btn-cancel {
            background-color: #f3f4f6;
            padding: 12px 24px;
            border-radius: 4px;
            border: none;
            cursor: pointer;
          }

          .btn-cancel:hover {
            background-color: #e5e7eb;
          }

          .error-message {
            background-color: #fef2f2;
            color: #b91c1c;
            padding: 12px;
            border-radius: 4px;
            margin-bottom: 16px;
          }
        `}
      </style>
    </div>
  );
};

export default StaffForm;
