const Attendance = require('../models/Attendance');
const Staff = require('../models/Staff');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const { generateExcelReport } = require('../utils/generateExcel');
const { getStartOfDay, getEndOfDay, getStartOfWeek, getEndOfWeek, getStartOfMonth, getEndOfMonth } = require('../utils/dateHelpers');

// @desc Mark attendance for a staff
// @route POST /api/attendance
// @access Private
exports.markAttendance = asyncHandler(async (req, res, next) => {
  const { staffId, date, status, notes } = req.body;

  // Validate staff exists
  const staff = await Staff.findOne({ staffId });
  if (!staff) {
    return next(new ErrorResponse(`Staff with ID ${staffId} not found`, 404));
  }

  // Check if attendance already marked for this date
  const attendanceDate = new Date(date);
  const startOfDay = getStartOfDay(attendanceDate);
  const endOfDay = getEndOfDay(attendanceDate);

  const existingAttendance = await Attendance.findOne({
    staffId,
    date: { $gte: startOfDay, $lte: endOfDay }
  });

  if (existingAttendance) {
    // Update existing attendance
    existingAttendance.status = status;
    if (notes) existingAttendance.notes = notes;
    await existingAttendance.save();
    
    return res.status(200).json(existingAttendance);
  }

  // Create new attendance record
  const attendance = await Attendance.create({
    staffId,
    staff: staff._id,
    date: attendanceDate,
    status,
    notes: notes || ''
  });

  res.status(201).json(attendance);
});

// @desc Get attendance records with filters
// @route GET /api/attendance
// @access Private
exports.getAttendance = asyncHandler(async (req, res, next) => {
  const { startDate, endDate, staffId, department, status } = req.query;
  
  let query = {};
  
  // Date range filter
  if (startDate && endDate) {
    query.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  } else if (startDate) {
    query.date = { $gte: new Date(startDate) };
  } else if (endDate) {
    query.date = { $lte: new Date(endDate) };
  }
  
  // Staff filter
  if (staffId) {
    query.staffId = staffId;
  }
  
  // Status filter
  if (status) {
    query.status = status;
  }
  
  // For department filter, we need to get all staff IDs from that department first
  if (department) {
    const staffMembers = await Staff.find({ department });
    const staffIds = staffMembers.map(staff => staff.staffId);
    query.staffId = { $in: staffIds };
  }
  
  const attendance = await Attendance.find(query)
    .sort({ date: -1 })
    .populate('staff', 'name department cabinNo');
  
  res.status(200).json(attendance);
});

// @desc Get attendance by ID
// @route GET /api/attendance/:id
// @access Private
exports.getAttendanceById = asyncHandler(async (req, res, next) => {
  const attendance = await Attendance.findById(req.params.id)
    .populate('staff', 'name department cabinNo');
  
  if (!attendance) {
    return next(new ErrorResponse(`Attendance record with id ${req.params.id} not found`, 404));
  }
  
  res.status(200).json(attendance);
});

// @desc Update attendance record
// @route PUT /api/attendance/:id
// @access Private
exports.updateAttendance = asyncHandler(async (req, res, next) => {
  let attendance = await Attendance.findById(req.params.id);
  
  if (!attendance) {
    return next(new ErrorResponse(`Attendance record with id ${req.params.id} not found`, 404));
  }
  
  attendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('staff', 'name department cabinNo');
  
  res.status(200).json(attendance);
});

// @desc Delete attendance record
// @route DELETE /api/attendance/:id
// @access Private
exports.deleteAttendance = asyncHandler(async (req, res, next) => {
  const attendance = await Attendance.findById(req.params.id);
  
  if (!attendance) {
    return next(new ErrorResponse(`Attendance record with id ${req.params.id} not found`, 404));
  }
  
  await attendance.deleteOne();
  
  res.status(200).json({ success: true, data: {} });
});

// @desc Get daily attendance report
// @route GET /api/attendance/reports/daily
// @access Private
exports.getDailyReport = asyncHandler(async (req, res, next) => {
  const { date } = req.query;
  
  if (!date) {
    return next(new ErrorResponse('Please provide a date for the report', 400));
  }
  
  const reportDate = new Date(date);
  const startOfDay = getStartOfDay(reportDate);
  const endOfDay = getEndOfDay(reportDate);
  
  const attendanceRecords = await Attendance.find({
    date: { $gte: startOfDay, $lte: endOfDay }
  }).populate('staff', 'name staffId department cabinNo');
  
  // Get all staff to check who is missing from attendance
  const allStaff = await Staff.find({ active: true });
  
  // Create a map of staff who have attendance marked
  const markedStaffIds = new Set(attendanceRecords.map(record => record.staffId));
  
  // Find staff without attendance records
  const missingStaff = allStaff.filter(staff => !markedStaffIds.has(staff.staffId));
  
  const report = {
    date: reportDate,
    totalStaff: allStaff.length,
    present: attendanceRecords.filter(record => record.status === 'present').length,
    absent: attendanceRecords.filter(record => record.status === 'absent').length,
    unmarked: missingStaff.length,
    records: attendanceRecords,
    missingStaff: missingStaff.map(staff => ({
      _id: staff._id,
      name: staff.name,
      staffId: staff.staffId,
      department: staff.department
    }))
  };
  
  res.status(200).json(report);
});

// @desc Get weekly attendance report
// @route GET /api/attendance/reports/weekly
// @access Private
exports.getWeeklyReport = asyncHandler(async (req, res, next) => {
  const { date } = req.query;
  
  if (!date) {
    return next(new ErrorResponse('Please provide a date within the week for the report', 400));
  }
  
  const reportDate = new Date(date);
  const startOfWeek = getStartOfWeek(reportDate);
  const endOfWeek = getEndOfWeek(reportDate);
  
  const attendanceRecords = await Attendance.find({
    date: { $gte: startOfWeek, $lte: endOfWeek }
  }).populate('staff', 'name staffId department cabinNo');
  
  // Group by staff and day
  const staffAttendance = {};
  
  attendanceRecords.forEach(record => {
    const day = record.date.toISOString().split('T')[0];
    
    if (!staffAttendance[record.staffId]) {
      staffAttendance[record.staffId] = {
        staff: record.staff,
        days: {}
      };
    }
    
    staffAttendance[record.staffId].days[day] = record.status;
  });
  
  // Calculate summary stats
  const summary = {
    startDate: startOfWeek,
    endDate: endOfWeek,
    totalDays: 5, // Assuming 5 working days in a week
    totalStaff: Object.keys(staffAttendance).length,
    dailyPresent: {},
    dailyAbsent: {}
  };
  
  // Calculate presence for each day in the week
  for (let d = new Date(startOfWeek); d <= endOfWeek; d.setDate(d.getDate() + 1)) {
    const day = d.toISOString().split('T')[0];
    
    const presentCount = attendanceRecords.filter(
      record => record.date.toISOString().split('T')[0] === day && record.status === 'present'
    ).length;
    
    const absentCount = attendanceRecords.filter(
      record => record.date.toISOString().split('T')[0] === day && record.status === 'absent'
    ).length;
    
    summary.dailyPresent[day] = presentCount;
    summary.dailyAbsent[day] = absentCount;
  }
  
  const report = {
    summary,
    staffAttendance
  };
  
  res.status(200).json(report);
});

// @desc Get monthly attendance report
// @route GET /api/attendance/reports/monthly
// @access Private
exports.getMonthlyReport = asyncHandler(async (req, res, next) => {
  const { month, year } = req.query;
  
  if (!month || !year) {
    return next(new ErrorResponse('Please provide month and year for the report', 400));
  }
  
  const reportDate = new Date(year, month - 1, 1); // Month is 0-indexed in JavaScript Date
  const startOfMonth = getStartOfMonth(reportDate);
  const endOfMonth = getEndOfMonth(reportDate);
  
  const attendanceRecords = await Attendance.find({
    date: { $gte: startOfMonth, $lte: endOfMonth }
  }).populate('staff', 'name staffId department cabinNo');
  
  // Get all active staff
  const allStaff = await Staff.find({ active: true });
  
  // Prepare staff-wise report
  const staffReports = {};
  
  allStaff.forEach(staff => {
    staffReports[staff.staffId] = {
      _id: staff._id,
      name: staff.name,
      staffId: staff.staffId,
      department: staff.department,
      totalPresent: 0,
      totalAbsent: 0,
      totalUnmarked: 0,
      attendancePercentage: 0,
      dayWiseStatus: {}
    };
  });
  
  // Calculate the number of working days in the month
  // Assuming Monday to Friday are working days
  const workingDays = [];
  const daysInMonth = new Date(year, month, 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay(); // 0 is Sunday, 6 is Saturday
    
    // Consider only weekdays (Monday to Friday)
    if (dayOfWeek > 0 && dayOfWeek < 6) {
      workingDays.push(date.toISOString().split('T')[0]);
    }
  }
  
  // Process attendance records
  attendanceRecords.forEach(record => {
    const staffId = record.staffId;
    const day = record.date.toISOString().split('T')[0];
    
    if (staffReports[staffId]) {
      staffReports[staffId].dayWiseStatus[day] = record.status;
      
      if (record.status === 'present') {
        staffReports[staffId].totalPresent += 1;
      } else if (record.status === 'absent') {
        staffReports[staffId].totalAbsent += 1;
      }
    }
  });
  
  // Calculate unmarked days and attendance percentage
  Object.values(staffReports).forEach(report => {
    workingDays.forEach(day => {
      if (!report.dayWiseStatus[day]) {
        report.totalUnmarked += 1;
        report.dayWiseStatus[day] = 'unmarked';
      }
    });
    
    const totalMarkedDays = report.totalPresent + report.totalAbsent;
    report.attendancePercentage = totalMarkedDays > 0 
      ? ((report.totalPresent / totalMarkedDays) * 100).toFixed(2) 
      : 0;
  });
  
  // Summary statistics
  const summary = {
    month: reportDate.toLocaleString('default', { month: 'long' }),
    year,
    workingDays: workingDays.length,
    totalStaff: allStaff.length,
    averageAttendance: (
      Object.values(staffReports).reduce((sum, staff) => sum + parseFloat(staff.attendancePercentage), 0) / 
      allStaff.length
    ).toFixed(2)
  };
  
  const report = {
    summary,
    staffReports: Object.values(staffReports)
  };
  
  res.status(200).json(report);
});

// @desc Export attendance report to Excel
// @route GET /api/attendance/reports/export
// @access Private
exports.exportAttendanceReport = asyncHandler(async (req, res, next) => {
  const { type, startDate, endDate, month, year } = req.query;
  
  if (!type) {
    return next(new ErrorResponse('Please specify report type: daily, weekly, or monthly', 400));
  }
  
  let report;
  let filename;
  
  // Get the appropriate report data based on type
  if (type === 'daily' && startDate) {
    const reportDate = new Date(startDate);
    const startOfDay = getStartOfDay(reportDate);
    const endOfDay = getEndOfDay(reportDate);
    
    const attendanceRecords = await Attendance.find({
      date: { $gte: startOfDay, $lte: endOfDay }
    }).populate('staff', 'name staffId department cabinNo');
    
    report = attendanceRecords;
    filename = `daily_attendance_report_${startDate}.xlsx`;
  } 
  else if (type === 'weekly' && startDate) {
    const reportDate = new Date(startDate);
    const startOfWeek = getStartOfWeek(reportDate);
    const endOfWeek = getEndOfWeek(reportDate);
    
    const attendanceRecords = await Attendance.find({
      date: { $gte: startOfWeek, $lte: endOfWeek }
    }).populate('staff', 'name staffId department cabinNo');
    
    report = attendanceRecords;
    filename = `weekly_attendance_report_${startOfWeek.toISOString().split('T')[0]}_to_${endOfWeek.toISOString().split('T')[0]}.xlsx`;
  } 
  else if (type === 'monthly' && month && year) {
    const reportDate = new Date(year, month - 1, 1);
    const startOfMonth = getStartOfMonth(reportDate);
    const endOfMonth = getEndOfMonth(reportDate);
    
    const attendanceRecords = await Attendance.find({
      date: { $gte: startOfMonth, $lte: endOfMonth }
    }).populate('staff', 'name staffId department cabinNo');
    
    report = attendanceRecords;
    filename = `monthly_attendance_report_${month}_${year}.xlsx`;
  } 
  else if (type === 'custom' && startDate && endDate) {
    const attendanceRecords = await Attendance.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) }
    }).populate('staff', 'name staffId department cabinNo');
    
    report = attendanceRecords;
    filename = `custom_attendance_report_${startDate}_to_${endDate}.xlsx`;
  } 
  else {
    return next(new ErrorResponse('Invalid report parameters', 400));
  }
  
  // Generate Excel file using the utility function
  const excelBuffer = await generateExcelReport(report, type);
  
  // Set response headers for file download
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  
  // Send the Excel file
  res.send(excelBuffer);
});