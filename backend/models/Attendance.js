const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  staffId: {
    type: String,
    required: [true, 'Please add staff ID'],
    trim: true
  },
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Please add attendance date'],
    default: Date.now
  },
  status: {
    type: String,
    required: [true, 'Please add attendance status'],
    enum: ['present', 'absent', 'leave', 'halfday'],
    default: 'present'
  },
  notes: {
    type: String,
    trim: true
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  markedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure a staff member can only have one attendance record per day
AttendanceSchema.index({ staffId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);