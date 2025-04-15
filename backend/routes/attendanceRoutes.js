const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
  getDailyReport,
  getWeeklyReport,
  getMonthlyReport,
  exportAttendanceReport
} = require('../controllers/attendanceController');

// Protect middleware can be added here
// const { protect } = require('../middleware/auth');

// Attendance routes
router.route('/')
  .get(getAttendance)
  .post(markAttendance);

router.route('/:id')
  .get(getAttendanceById)
  .put(updateAttendance)
  .delete(deleteAttendance);

// Reports routes
router.route('/reports/daily')
  .get(getDailyReport);

router.route('/reports/weekly')
  .get(getWeeklyReport);

router.route('/reports/monthly')
  .get(getMonthlyReport);

router.route('/reports/export')
  .get(exportAttendanceReport);

module.exports = router;