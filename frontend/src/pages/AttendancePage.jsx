import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import AttendanceList from '../components/attendance/AttendanceList';
import AttendanceForm from '../components/attendance/AttendanceForm';
import BulkAttendance from '../components/attendance/BulkAttendance';
import AttendanceCalendar from '../components/attendance/AttendanceCalendar';
import { attendanceService } from '../services/attendanceService';
import { staffService } from '../services/staffService';
import { formatDate } from '../utils/dateUtils';

const AttendancePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [staff, setStaff] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filters, setFilters] = useState({
    startDate: formatDate(new Date()),
    endDate: formatDate(new Date()),
    staffId: '',
    department: '',
    status: ''
  });

  const isBulkPage = location.pathname === '/attendance/bulk';
  const isMarkPage = location.pathname === '/attendance/mark';
  const isCalendarPage = location.pathname === '/attendance/calendar';
  const isListPage = location.pathname === '/attendance';

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

    const fetchStaff = async () => {
      try {
        const staffData = await staffService.getAllStaff({ active: true });
        setStaff(staffData);
      } catch (error) {
        console.error('Failed to fetch staff:', error);
        setError('Failed to load staff data');
      }
    };

    fetchDepartments();
    fetchStaff();
  }, []);

  useEffect(() => {
    if (isListPage || isCalendarPage) {
      fetchAttendance();
    }
  }, [isListPage, isCalendarPage, filters]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const data = await attendanceService.getAttendance(filters);
      setAttendanceRecords(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setError('Failed to load attendance data');
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

  const handleMarkAttendance = async (attendanceData) => {
    try {
      setLoading(true);
      await attendanceService.markAttendance(attendanceData);
      navigate('/attendance');
    } catch (err) {
      console.error('Error marking attendance:', err);
      setError(err.response?.data?.error || 'Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAttendance = async (attendanceDataList) => {
    try {
      setLoading(true);
      
      // Process each attendance record
      const promises = attendanceDataList.map(data => 
        attendanceService.markAttendance(data)
      );
      
      await Promise.all(promises);
      navigate('/attendance');
    } catch (err) {
      console.error('Error marking bulk attendance:', err);
      setError(err.response?.data?.error || 'Failed to mark bulk attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAttendance = async (id, attendanceData) => {
    try {
      setLoading(true);
      await attendanceService.updateAttendance(id, attendanceData);
      fetchAttendance();
    } catch (err) {
      console.error('Error updating attendance:', err);
      setError(err.response?.data?.error || 'Failed to update attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAttendance = async (id) => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      try {
        setLoading(true);
        await attendanceService.deleteAttendance(id);
        fetchAttendance();
      } catch (err) {
        console.error('Error deleting attendance:', err);
        setError(err.response?.data?.error || 'Failed to delete attendance record');
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
          {isMarkPage ? 'Mark Attendance' : 
           isBulkPage ? 'Bulk Attendance Entry' : 
           isCalendarPage ? 'Attendance Calendar' : 
           'Attendance Records'}
        </h1>
        <p className="text-gray-600">
          {isMarkPage ? 'Record attendance for individual staff' : 
           isBulkPage ? 'Record attendance for multiple staff at once' : 
           isCalendarPage ? 'View attendance patterns in calendar format' : 
           'View and manage attendance records'}
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
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="staffId" className="block text-sm font-medium text-gray-700 mb-1">Staff</label>
                <select
                  id="staffId"
                  name="staffId"
                  value={filters.staffId}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Staff</option>
                  {staff.map((member) => (
                    <option key={member._id} value={member.staffId}>
                      {member.name} ({member.staffId})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
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
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  id="status"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="leave">Leave</option>
                  <option value="halfday">Half Day</option>
                </select>
              </div>
            </div>
          </div>
          
          <AttendanceList 
            attendanceRecords={attendanceRecords}
            loading={loading}
            onUpdate={handleUpdateAttendance}
            onDelete={handleDeleteAttendance}
          />
        </>
      )}
      
      {isMarkPage && (
        <AttendanceForm 
          staff={staff}
          loading={loading}
          onSubmit={handleMarkAttendance}
        />
      )}
      
      {isBulkPage && (
        <BulkAttendance 
          staff={staff}
          departments={departments}
          loading={loading}
          onSubmit={handleBulkAttendance}
        />
      )}
      
      {isCalendarPage && (
        <AttendanceCalendar 
          attendanceRecords={attendanceRecords}
          staff={staff}
          loading={loading}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      )}
    </MainLayout>
  );
};

export default AttendancePage;