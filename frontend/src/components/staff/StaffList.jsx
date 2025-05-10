import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { staffService } from '../../services/staffService';

const StaffList = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    active: 'true'
  });
  const [departments, setDepartments] = useState([]);
  
  const fetchStaff = async () => {
    try {
      setLoading(true);
      const data = await staffService.getAllStaff(filters);
      setStaff(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch staff: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchDepartments = async () => {
    try {
      const data = await staffService.getDepartments();
      setDepartments(data);
    } catch (err) {
      console.error('Failed to fetch departments:', err);
    }
  };
  
  useEffect(() => {
    fetchStaff();
    fetchDepartments();
  }, []);
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    fetchStaff();
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await staffService.deleteStaff(id);
        fetchStaff();
      } catch (err) {
        setError('Failed to delete staff: ' + err.message);
      }
    }
  };
  
  return (
    <div className="staff-list-container">
      <style>
        {`
          .staff-list-container {
            background-color: white;
            padding: 24px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
          }

          .header h1 {
            font-size: 24px;
            font-weight: bold;
          }

          .add-button {
            background-color: #3182ce;
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            text-decoration: none;
            transition: background-color 0.2s ease;
          }

          .add-button:hover {
            background-color: #2b6cb0;
          }

          .filter-form {
            margin-bottom: 24px;
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
          }

          .filter-form input,
          .filter-form select {
            padding: 8px;
            border-radius: 4px;
            border: 1px solid #e2e8f0;
            width: 100%;
          }

          .filter-form button {
            background-color: #edf2f7;
            padding: 8px 16px;
            border-radius: 4px;
            transition: background-color 0.2s ease;
          }

          .filter-form button:hover {
            background-color: #e2e8f0;
          }

          .table-container {
            overflow-x: auto;
          }

          .table {
            width: 100%;
            border-collapse: collapse;
          }

          .table th,
          .table td {
            padding: 12px;
            border: 1px solid #e2e8f0;
            text-align: left;
          }

          .table th {
            background-color: #f7fafc;
          }

          .table tr:hover {
            background-color: #f7fafc;
          }

          .status {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            display: inline-block;
          }

          .status.active {
            background-color: #c6f6d5;
            color: #2f855a;
          }

          .status.inactive {
            background-color: #fed7d7;
            color: #e53e3e;
          }

          .action-buttons a,
          .action-buttons button {
            padding: 8px 16px;
            border-radius: 4px;
            margin-right: 8px;
            text-decoration: none;
            transition: background-color 0.2s ease;
          }

          .action-buttons a:hover,
          .action-buttons button:hover {
            background-color: #edf2f7;
          }

          .view-button {
            background-color: #bee3f8;
            color: #3182ce;
          }

          .edit-button {
            background-color: #faf089;
            color: #d69e2e;
          }

          .delete-button {
            background-color: #fed7d7;
            color: #e53e3e;
          }
        `}
      </style>

      <div className="header">
        <h1>Staff List</h1>
        <Link to="/staff/add" className="add-button">
          Add New Staff
        </Link>
      </div>
      
      <div className="filter-form">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
          <input
            type="text"
            name="search"
            placeholder="Search by name, ID or department..."
            value={filters.search}
            onChange={handleFilterChange}
          />
          <select
            name="department"
            value={filters.department}
            onChange={handleFilterChange}
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <select
            name="active"
            value={filters.active}
            onChange={handleFilterChange}
          >
            <option value="true">Active Staff</option>
            <option value="false">Inactive Staff</option>
            {/* <option value="">All Staff</option> */}
          </select>
          <button type="submit">
            Filter
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : error ? (
        <div className="text-red-600 py-4">{error}</div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Staff ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Cabin</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map(member => (
                <tr key={member._id}>
                  <td>{member.staffId}</td>
                  <td>{member.name}</td>
                  <td>{member.department}</td>
                  <td>{member.designation || '-'}</td>
                  <td>{member.cabinNo || '-'}</td>
                  <td>
                    <span className={`status ${member.active ? 'active' : 'inactive'}`}>
                      {member.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="action-buttons">
                    <Link to={`/staff/${member._id}`} className="view-button">
                      View
                    </Link>
                    <Link to={`/staff/edit/${member._id}`} className="edit-button">
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(member._id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              
              {staff.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4">No staff members found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StaffList;
