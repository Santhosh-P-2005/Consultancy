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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Staff List</h1>
        <Link to="/staff/add" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add New Staff
        </Link>
      </div>
      
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
          <div className="flex-1">
            <input
              type="text"
              name="search"
              placeholder="Search by name, ID or department..."
              className="w-full p-2 border rounded"
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>
          
          <div className="w-48">
            <select
              name="department"
              className="w-full p-2 border rounded"
              value={filters.department}
              onChange={handleFilterChange}
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div className="w-48">
            <select
              name="active"
              className="w-full p-2 border rounded"
              value={filters.active}
              onChange={handleFilterChange}
            >
              <option value="true">Active Staff</option>
              <option value="false">Inactive Staff</option>
              <option value="">All Staff</option>
            </select>
          </div>
          
          <button type="submit" className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
            Filter
          </button>
        </form>
      </div>
      
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : error ? (
        <div className="text-red-600 py-4">{error}</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-3 border">Staff ID</th>
                  <th className="text-left p-3 border">Name</th>
                  <th className="text-left p-3 border">Department</th>
                  <th className="text-left p-3 border">Designation</th>
                  <th className="text-left p-3 border">Cabin</th>
                  <th className="text-left p-3 border">Status</th>
                  <th className="text-left p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map(member => (
                  <tr key={member._id} className="hover:bg-gray-50">
                    <td className="p-3 border">{member.staffId}</td>
                    <td className="p-3 border">{member.name}</td>
                    <td className="p-3 border capitalize">{member.department}</td>
                    <td className="p-3 border">{member.designation || '-'}</td>
                    <td className="p-3 border">{member.cabinNo || '-'}</td>
                    <td className="p-3 border">
                      <span className={`px-2 py-1 rounded text-xs ${member.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {member.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-3 border">
                      <div className="flex gap-2">
                        <Link to={`/staff/${member._id}`} className="bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200">
                          View
                        </Link>
                        <Link to={`/staff/edit/${member._id}`} className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded hover:bg-yellow-200">
                          Edit
                        </Link>
                        <button 
                          onClick={() => handleDelete(member._id)}
                          className="bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {staff.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-4 text-center">No staff members found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default StaffList;