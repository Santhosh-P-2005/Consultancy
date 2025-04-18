import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import AttendanceList from '../components/attendance/AttendanceList';
import AttendanceForm from '../components/attendance/AttendanceForm';
import BulkAttendance from '../components/attendance/BulkAttendance';
import EditAttendance from '../components/attendance/EditAttendance';
import AttendanceCalendar from '../components/attendance/AttendanceCalendar';
import { attendanceService } from '../services/attendanceService';
import { staffService } from '../services/staffService';
import { formatDate } from '../utils/dateUtils';

const AttendancePage = () => {
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

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [staffData, departmentData] = await Promise.all([
          staffService.getAllStaff({ active: true }),
          staffService.getDepartments()
        ]);
        setStaff(staffData);
        setDepartments(departmentData);
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
        setError('Failed to load staff or departments');
      }
    };

    fetchInitialData();
  }, []);

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

  useEffect(() => {
    fetchAttendance();
  }, [filters]);

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
      setError(err.response?.data?.error || 'Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAttendance = async (attendanceDataList) => {
    try {
      setLoading(true);
      const promises = attendanceDataList.map(data => attendanceService.markAttendance(data));
      await Promise.all(promises);
      navigate('/attendance');
    } catch (err) {
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
        setError(err.response?.data?.error || 'Failed to delete attendance record');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <MainLayout>
      <div className="page-header">
        <h1>Attendance</h1>
        <p>Manage all attendance related operations</p>
      </div>

      {error && (
        <div className="error-box" role="alert">
          <p>{error}</p>
        </div>
      )}

      <Routes>
        <Route
          path="/"
          element={
            <AttendanceList
              attendanceRecords={attendanceRecords}
              loading={loading}
              onUpdate={handleUpdateAttendance}
              onDelete={handleDeleteAttendance}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          }
        />
        <Route
          path="/mark"
          element={
            <AttendanceForm
              staff={staff}
              loading={loading}
              onSubmit={handleMarkAttendance}
            />
          }
        />
        <Route
          path="/bulk"
          element={
            <BulkAttendance
              staff={staff}
              departments={departments}
              loading={loading}
              onSubmit={handleBulkAttendance}
            />
          }
        />
        <Route
          path="/calendar"
          element={
            <AttendanceCalendar
              attendanceRecords={attendanceRecords}
              staff={staff}
              loading={loading}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          }
        />
        <Route
          path="/:id"
          element={
            <EditAttendance/>
          }
        />
      </Routes>

      {/* Embedded CSS */}
      <style>{`
        .page-header {
          margin-bottom: 1.5rem;
        }
        .page-header h1 {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }
        .page-header p {
          color: #4B5563;
        }
        .error-box {
          background-color: #FEE2E2;
          border-left: 4px solid #EF4444;
          color: #B91C1C;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }
      `}</style>
    </MainLayout>
  );
};

export default AttendancePage;
