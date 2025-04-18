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
        const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
        const lastDay = new Date(year, month, 0).getDate();
        const endDate = `${year}-${month.toString().padStart(2, '0')}-${lastDay}`;

        const attendance = await attendanceService.getAttendance({ staffId, startDate, endDate });
        
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

  const generateCalendarDays = () => {
    const days = [];
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDay = new Date(year, month - 1, 1).getDay();
    
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getStatusClass = (day) => {
    if (!day) return '';
    
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const record = attendanceData[dateStr];
    
    if (!record) return 'bg-gray-100';
    
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

  const isWeekend = (day) => {
    if (!day) return false;
    const date = new Date(year, month - 1, day);
    return date.getDay() === 0 || date.getDay() === 6;
  };

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
    <div className="attendance-calendar">
      <h2 className="title">Attendance Calendar</h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="filters">
        <div className="filter">
          <label>Staff Member</label>
          <select value={staffId} onChange={handleStaffChange}>
            <option value="">Select Staff</option>
            {staff.map(s => (
              <option key={s._id} value={s.staffId}>
                {s.name} ({s.staffId})
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter">
          <label>Month</label>
          <select value={month} onChange={handleMonthChange}>
            {months.map(m => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter">
          <label>Year</label>
          <select value={year} onChange={handleYearChange}>
            {years.map(y => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="navigation">
        <button onClick={handlePreviousMonth}>Previous Month</button>
        <h3>{months.find(m => m.value === month)?.label} {year}</h3>
        <button onClick={handleNextMonth}>Next Month</button>
      </div>
      
      {loading ? (
        <div className="loading-spinner"></div>
      ) : (
        <div className="calendar-table">
          <table>
            <thead>
              <tr>
                <th>Sun</th>
                <th>Mon</th>
                <th>Tue</th>
                <th>Wed</th>
                <th>Thu</th>
                <th>Fri</th>
                <th>Sat</th>
              </tr>
            </thead>
            <tbody>
              {Array(Math.ceil(calendarDays.length / 7)).fill().map((_, weekIndex) => (
                <tr key={weekIndex}>
                  {calendarDays.slice(weekIndex * 7, weekIndex * 7 + 7).map((day, dayIndex) => (
                    <td key={dayIndex} className={`${getStatusClass(day)} ${isWeekend(day) ? 'weekend' : ''}`}>
                      {day && (
                        <>
                          <div className="day-number">{day}</div>
                          {attendanceData[`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`] && (
                            <div className="status">
                              <div>Status: {attendanceData[`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`].status}</div>
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
      
      <div className="legend">
        <h4>Legend:</h4>
        <div className="legend-item">
          <div className="color-box green"></div>
          <span>Present</span>
        </div>
        <div className="legend-item">
          <div className="color-box red"></div>
          <span>Absent</span>
        </div>
        <div className="legend-item">
          <div className="color-box yellow"></div>
          <span>Leave</span>
        </div>
        <div className="legend-item">
          <div className="color-box orange"></div>
          <span>Half Day</span>
        </div>
      </div>
      
      <style jsx>{`
        .attendance-calendar {
          font-family: Arial, sans-serif;
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .title {
          text-align: center;
          font-size: 2em;
          margin-bottom: 20px;
        }
        
        .filters {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        
        .filter {
          width: 30%;
        }
        
        .filter select {
          width: 100%;
          padding: 10px;
          border-radius: 5px;
          border: 1px solid #ccc;
        }
        
        .navigation {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .calendar-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .calendar-table th,
        .calendar-table td {
          width: 14.28%;
          height: 60px;
          text-align: center;
          vertical-align: middle;
          border: 1px solid #ccc;
        }
        
        .calendar-table td {
          position: relative;
        }
        
        .day-number {
          font-size: 1.2em;
        }
        
        .status {
          font-size: 0.8em;
        }
        
        .loading-spinner {
          width: 30px;
          height: 30px;
          border: 5px solid #ccc;
          border-top: 5px solid #000;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .legend {
          margin-top: 20px;
        }
        
        .legend-item {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
        }
        
        .color-box {
          width: 20px;
          height: 20px;
          border-radius: 5px;
          margin-right: 10px;
        }
        
        .green { background-color: #c9f7c9; }
        .red { background-color: #f7c9c9; }
        .yellow { background-color: #f7f1c9; }
        .orange { background-color: #f7e1c9; }
        
        .weekend {
          background-color: #f0f0f0;
        }
        
        .error-message {
          color: red;
          text-align: center;
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
};

export default AttendanceCalendar;
