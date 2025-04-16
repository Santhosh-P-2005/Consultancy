import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import StaffList from '../components/staff/StaffList';
import StaffForm from '../components/staff/StaffForm';
import StaffDetails from '../components/staff/StaffDetails';
import { staffService } from '../services/staffService';

const StaffPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allStaff, setAllStaff] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    active: true
  });

  const isAddPage = location.pathname === '/staff/add';
  const isDetailsPage = !!id;
  const isListPage = !isAddPage && !isDetailsPage;

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const departmentsData = await staffService.getDepartments();
        setDepartments(departmentsData);
      } catch (error) {
        console.error('Failed to fetch departments:', error);
        setError('Failed to load departments');
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    if (isListPage) {
      fetchStaff();
    }
  }, [isListPage, filters]);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const data = await staffService.getAllStaff(filters);
      setAllStaff(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching staff:', err);
      setError('Failed to load staff data');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddStaff = async (staffData) => {
    try {
      setLoading(true);
      await staffService.createStaff(staffData);
      navigate('/staff');
    } catch (err) {
      console.error('Error adding staff:', err);
      setError(err.response?.data?.error || 'Failed to add staff');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStaff = async (id, staffData) => {
    try {
      setLoading(true);
      await staffService.updateStaff(id, staffData);
      navigate('/staff');
    } catch (err) {
      console.error('Error updating staff:', err);
      setError(err.response?.data?.error || 'Failed to update staff');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStaff = async (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        setLoading(true);
        await staffService.deleteStaff(id);
        navigate('/staff');
      } catch (err) {
        console.error('Error deleting staff:', err);
        setError(err.response?.data?.error || 'Failed to delete staff');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <MainLayout>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          {isAddPage ? 'Add New Staff' : isDetailsPage ? 'Staff Details' : 'Staff Management'}
        </h1>
        <p className="text-gray-600">
          {isAddPage ? 'Create a new staff profile' : 
           isDetailsPage ? 'View and update staff information' : 
           'Manage your staff members'}
        </p>
      </div>
      
      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {/* Page Content */}
      {isListPage && (
        <>
          {/* Filter Controls */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <input
                  type="text"
                  id="search"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search by name, ID or department..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="md:w-1/4">
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  id="department"
                  name="department"
                  value={filters.department}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Departments</option>
                  {departments.map((dept, index) => (
                    <option key={index} value={dept}>
                      {dept.charAt(0).toUpperCase() + dept.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="md:w-1/4">
                <label htmlFor="active" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  id="active"
                  name="active"
                  value={filters.active}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                  <option value="">All</option>
                </select>
              </div>
            </div>
          </div>
          
          <StaffList 
            staff={allStaff}
            loading={loading}
            onDelete={handleDeleteStaff}
          />
        </>
      )}
      
      {isAddPage && (
        <StaffForm 
          loading={loading}
          departments={departments}
          onSubmit={handleAddStaff}
          currentYear={new Date().getFullYear()}
        />
      )}
      
      {isDetailsPage && (
        <StaffDetails 
          staffId={id}
          departments={departments}
          onUpdate={handleUpdateStaff}
          onDelete={handleDeleteStaff}
          loading={loading}
        />
      )}
    </MainLayout>
  );
};

export default StaffPage;