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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Bulk Attendance Entry</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Attendance marked successfully for all staff! Redirecting...
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="date" className="block text-gray-700 font-bold mb-2">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={handleDateChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          <div>
            <label htmlFor="department" className="block text-gray-700 font-bold mb-2">
              Department (Optional)
            </label>
            <select
              id="department"
              value={department}
              onChange={handleDepartmentChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
          <div className="text-center py-4">Loading staff data...</div>
        ) : filteredStaff.length === 0 ? (
          <div className="text-center py-4">No staff found for the selected department.</div>
        ) : (
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Staff ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStaff.map((member) => {
                  const attendanceEntry = attendanceData.find(item => item.staffId === member.staffId) || {
                    status: 'present',
                    notes: ''
                  };
                  
                  return (
                    <tr key={member._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{member.staffId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {member.department.charAt(0).toUpperCase() + member.department.slice(1)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={attendanceEntry.status}
                          onChange={(e) => handleStatusChange(member.staffId, e.target.value)}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="present">Present</option>
                          <option value="absent">Absent</option>
                          <option value="leave">Leave</option>
                          <option value="halfday">Half Day</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={attendanceEntry.notes}
                          onChange={(e) => handleNotesChange(member.staffId, e.target.value)}
                          placeholder="Optional notes"
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading || filteredStaff.length === 0}
          >
            {loading ? 'Processing...' : 'Submit Bulk Attendance'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/attendance')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BulkAttendance;