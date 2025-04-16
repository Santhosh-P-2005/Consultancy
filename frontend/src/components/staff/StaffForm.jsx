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
  const [departments, setDepartments] = useState([]);
  
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await staffService.getDepartments();
        setDepartments(data);
      } catch (err) {
        console.error('Failed to fetch departments:', err);
      }
    };
    
    fetchDepartments();
    
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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit Staff' : 'Add New Staff'}</h1>
      
      {errors.form && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {errors.form}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-medium">Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <label className="block mb-1 font-medium">Staff ID *</label>
            <input
              type="text"
              name="staffId"
              value={formData.staffId}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.staffId ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.staffId && <p className="text-red-500 text-sm mt-1">{errors.staffId}</p>}
          </div>
          
          <div>
            <label className="block mb-1 font-medium">Department *</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.department ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
          </div>
          
          <div>
            <label className="block mb-1 font-medium">Designation</label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          
          <div>
            <label className="block mb-1 font-medium">Cabin Number</label>
            <input
              type="text"
              name="cabinNo"
              value={formData.cabinNo}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          
          <div>
            <label className="block mb-1 font-medium">Year of Joining *</label>
            <input
              type="number"
              name="yearOfJoining"
              value={formData.yearOfJoining}
              onChange={handleChange}
              min="1980"
              max={new Date().getFullYear()}
              className={`w-full p-2 border rounded ${errors.yearOfJoining ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.yearOfJoining && <p className="text-red-500 text-sm mt-1">{errors.yearOfJoining}</p>}
          </div>
          
          <div>
            <label className="block mb-1 font-medium">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="active" className="font-medium">Active</label>
          </div>
        </div>
        
        <div className="mt-8 flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? 'Saving...' : isEditMode ? 'Update Staff' : 'Add Staff'}
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/staff')}
            className="bg-gray-200 px-6 py-2 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default StaffForm;