import React, { useState, useEffect } from 'react';
import { attendanceService } from '../../services/attendanceService';
import { staffService } from '../../services/staffService';
import { formatDate, getCurrentMonth, getCurrentYear } from '../../utils/dateUtils';

const AttendanceCalendar = () => {
  const [month, setMonth] = useState(getCurrentMonth());
  const [year, setYear] = useState(getCurrentYear());
  const [staffId, setStaffId] = useState('');
  const [staff, setStaff] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const staffData = await staffService.getAllStaff({ active: true });
        setStaff(staffData);
        // Set default staff if available
        if (staffData.length > 0 && !staffId) {
          setStaffId(staffData[0].staffId);
        }
      } catch (err) {
        setError('Failed to fetch staff data');
      }
    };
    fetchStaff();
  }, [staffId]);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      if (!staffId) return;
      try {
        setLoading(true);
        // Calculate start and end date for the month
        const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
        const lastDay = new Date(year, month, 0).getDate();
        const endDate = `${year}-${month.toString().padStart(2, '0')}-${lastDay}`;

        const attendance = await attendanceService.getAttendance({ staffId, startDate, endDate });
        
        // Transform into object with date as key for easy lookup
        const attendanceMap = {};
        attendance.forEach(record => {
          const dateStr = formatDate(record.date);
          attendanceMap[dateStr] = record;
        });
        
        setAttendanceData(attendanceMap);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch attendance data');
        setLoading(false);
      }
    };
    
    fetchAttendanceData();
  }, [staffId, month, year]);

  const handleStaffChange = (e) => {
    setStaffId(e.target.value);
  };

  const handleMonthChange = (e) => {
    setMonth(parseInt(e.target.value));
  };

  const handleYearChange = (e) => {
    setYear(parseInt(e.target.value));
  };

  const handlePreviousMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  // Generate calendar days for the selected month
  const generateCalendarDays = () => {
    const days = [];
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDay = new Date(year, month - 1, 1).getDay();
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  // Get status class based on attendance status
  const getStatusClass = (day) => {
    if (!day) return '';
    
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const record = attendanceData[dateStr];
    
    if (!record) return 'bg-gray-100'; // No record
    
    switch (record.status) {
      case 'present':
        return 'bg-green-200';
      case 'absent':
        return 'bg-red-200';
      case 'leave':
        return 'bg-yellow-200';
      case 'halfday':
        return 'bg-orange-200';
      default:
        return 'bg-gray-100';
    }
  };

  // Check if a date is a weekend
  const isWeekend = (day) => {
    if (!day) return false;
    const date = new Date(year, month - 1, day);
    return date.getDay() === 0 || date.getDay() === 6; // 0 is Sunday, 6 is Saturday
  };

  // Get all months for select dropdown
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  // Generate years for select dropdown (past 5 years and next 2 years)
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 2; i++) {
      years.push(i);
    }
    return years;
  };

  const years = generateYearOptions();
  const calendarDays = generateCalendarDays();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Attendance Calendar</h2>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="w-full md:w-1/3">
          <label className="block text-gray-700 mb-2">Staff Member</label>
          <select
            className="w-full p-2 border rounded"
            value={staffId}
            onChange={handleStaffChange}
          >
            <option value="">Select Staff</option>
            {staff.map(s => (
              <option key={s._id} value={s.staffId}>
                {s.name} ({s.staffId})
              </option>
            ))}
          </select>
        </div>
        
        <div className="w-full md:w-1/4">
          <label className="block text-gray-700 mb-2">Month</label>
          <select
            className="w-full p-2 border rounded"
            value={month}
            onChange={handleMonthChange}
          >
            {months.map(m => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="w-full md:w-1/4">
          <label className="block text-gray-700 mb-2">Year</label>
          <select
            className="w-full p-2 border rounded"
            value={year}
            onChange={handleYearChange}
          >
            {years.map(y => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="flex justify-between mb-4">
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handlePreviousMonth}
        >
          Previous Month
        </button>
        <h3 className="text-xl font-semibold">
          {months.find(m => m.value === month)?.label} {year}
        </h3>
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleNextMonth}
        >
          Next Month
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2 text-center">Sun</th>
                <th className="border p-2 text-center">Mon</th>
                <th className="border p-2 text-center">Tue</th>
                <th className="border p-2 text-center">Wed</th>
                <th className="border p-2 text-center">Thu</th>
                <th className="border p-2 text-center">Fri</th>
                <th className="border p-2 text-center">Sat</th>
              </tr>
            </thead>
            <tbody>
              {Array(Math.ceil(calendarDays.length / 7)).fill().map((_, weekIndex) => (
                <tr key={`week-${weekIndex}`}>
                  {calendarDays.slice(weekIndex * 7, weekIndex * 7 + 7).map((day, dayIndex) => (
                    <td 
                      key={`day-${weekIndex}-${dayIndex}`}
                      className={`border p-2 h-24 align-top ${day ? getStatusClass(day) : ''} ${isWeekend(day) ? 'bg-gray-50' : ''}`}
                    >
                      {day && (
                        <>
                          <div className="font-semibold">{day}</div>
                          {attendanceData[`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`] && (
                            <div className="mt-1 text-xs">
                              <div className="font-medium">
                                Status: {attendanceData[`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`].status.charAt(0).toUpperCase() + 
                                  attendanceData[`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`].status.slice(1)}
                              </div>
                              {attendanceData[`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`].notes && (
                                <div className="text-gray-600 truncate">
                                  {attendanceData[`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`].notes}
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-6">
        <h4 className="font-semibold mb-2">Legend:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-200 mr-2"></div>
            <span>Present</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-200 mr-2"></div>
            <span>Absent</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-200 mr-2"></div>
            <span>Leave</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-orange-200 mr-2"></div>
            <span>Half Day</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-100 mr-2"></div>
            <span>No Record</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCalendar;