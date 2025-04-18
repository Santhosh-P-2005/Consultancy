import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import StaffList from '../components/staff/StaffList';
import EditStaff from '../components/staff/EditStaff';
import StaffForm from '../components/staff/StaffForm';
import ViewStaff from '../components/staff/ViewStaff';
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
        <h1 className="page-title">
          {isAddPage ? 'Add New Staff' : isDetailsPage ? 'Staff Details' : 'Staff Management'}
        </h1>
        <p className="page-description">
          {isAddPage ? 'Create a new staff profile' : 
           isDetailsPage ? 'View and update staff information' : 
           'Manage your staff members'}
        </p>
      </div>
      
      {/* Error Display */}
      {error && (
        <div className="alert-box" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {/* Page Content */}
      <Routes>
        <Route path="/" element={
          <>
            {/* Filter Controls */}
            
            <StaffList 
              staff={allStaff}
              loading={loading}
              onDelete={handleDeleteStaff}
            />
          </>
        } />
        
        <Route path="add" element={
          <StaffForm 
            loading={loading}
            departments={departments}
            onSubmit={handleAddStaff}
            currentYear={new Date().getFullYear()}
          />
        } />
        
        <Route path="/edit/:id" element={
          <EditStaff 
            staffId={id}
          />
        } />
        <Route path="/:id" element={
          <ViewStaff 
            staffId={id}
          />
        } />
      </Routes>
      
      {/* CSS Styles */}
      <style jsx>{`
        .page-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #4b5563;
        }

        .page-description {
          color: #6b7280;
        }

        .alert-box {
          background-color: #fee2e2;
          border-left: 4px solid #ef4444;
          color: #b91c1c;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }

        .filter-container {
          background-color: #fff;
          padding: 1rem;
          border-radius: 0.5rem;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          margin-bottom: 1.5rem;
        }

        .filter-fields {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .filter-item {
          flex: 1;
          min-width: 250px;
        }

        .filter-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .input-field {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          transition: all 0.3s;
        }

        .input-field:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 1px #3b82f6;
        }
      `}</style>
    </MainLayout>
  );
};

export default StaffPage;
